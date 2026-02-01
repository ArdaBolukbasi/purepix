from PIL import Image
import io
from typing import Optional, Tuple

# Try to import rembg for background removal
try:
    from rembg import remove as remove_bg
    REMBG_AVAILABLE = True
except ImportError:
    REMBG_AVAILABLE = False
    print("Warning: rembg not installed. Background removal will not be available.")


def process_image(
    image_bytes: bytes,
    width: Optional[int] = None,
    height: Optional[int] = None,
    format: str = "webp",
    quality: int = 80,
    keep_aspect_ratio: bool = True,
    remove_background: bool = False
) -> Tuple[bytes, dict]:
    """
    Process an image with resize, format conversion, quality adjustment, and optional background removal.
    """
    img = Image.open(io.BytesIO(image_bytes))
    original_size = len(image_bytes)
    original_dimensions = img.size
    original_format = (img.format or "").lower()
    background_removed = False
    needs_processing = False
    
    # Normalize format names
    target_format = format.lower()
    if target_format == "jpg":
        target_format = "jpeg"
    if original_format == "jpg":
        original_format = "jpeg"
    
    # Check if any processing is needed
    target_width = width or original_dimensions[0]
    target_height = height or original_dimensions[1]
    
    # Determine if we need to process
    size_changed = (target_width != original_dimensions[0] or target_height != original_dimensions[1])
    format_changed = (target_format != original_format)
    
    # If same format, same size, quality >= 95, no background removal -> return original
    if not size_changed and not format_changed and quality >= 95 and not remove_background:
        metadata = {
            "original_size": original_size,
            "processed_size": original_size,
            "original_dimensions": original_dimensions,
            "processed_dimensions": original_dimensions,
            "format": original_format,
            "quality": quality,
            "compression_ratio": 0.0,
            "background_removed": False,
            "skipped_processing": True
        }
        return image_bytes, metadata
    
    needs_processing = True
    
    # Handle background removal first
    if remove_background and REMBG_AVAILABLE:
        # Orijinal resmi PNG olarak kaydet (kayıpsız) ve rembg'ye gönder
        img_buffer = io.BytesIO()
        # Her zaman PNG kullan - kayıpsız format
        if img.mode not in ("RGBA", "RGB"):
            img = img.convert("RGBA")
        img.save(img_buffer, format='PNG', compress_level=0)
        img_buffer.seek(0)
        
        output_bytes = remove_bg(img_buffer.getvalue())
        img = Image.open(io.BytesIO(output_bytes))
        background_removed = True
        target_format = "png"
    
    # Handle resize
    if size_changed:
        if keep_aspect_ratio:
            orig_width, orig_height = img.size
            if width and height:
                # Her ikisi de verilmişse, width baz alarak ölçekle
                scale = width / orig_width
                new_width = width
                new_height = int(orig_height * scale)
            elif width:
                scale = width / orig_width
                new_width = width
                new_height = int(orig_height * scale)
            else:
                scale = height / orig_height
                new_width = int(orig_width * scale)
                new_height = height
        else:
            new_width = width or img.size[0]
            new_height = height or img.size[1]
        
        img = img.resize((new_width, new_height), Image.LANCZOS)
    
    # Handle format conversion
    output_format = target_format.upper()
    if output_format == "JPG":
        output_format = "JPEG"
    
    # Handle RGBA to RGB conversion for JPEG
    if output_format == "JPEG" and img.mode in ("RGBA", "P"):
        background = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        background.paste(img, mask=img.split()[3] if len(img.split()) == 4 else None)
        img = background
    elif output_format == "JPEG" and img.mode != "RGB":
        img = img.convert("RGB")
    
    # Ensure PNG maintains RGBA for transparency
    if output_format == "PNG" and img.mode not in ("RGBA", "LA", "PA"):
        if img.mode == "P":
            img = img.convert("RGBA")
        elif img.mode == "RGB":
            img = img.convert("RGBA")
    
    # Save to buffer
    buffer = io.BytesIO()
    
    save_kwargs = {}
    if output_format == "JPEG":
        save_kwargs["quality"] = quality
        if quality >= 95:
            save_kwargs["subsampling"] = 0
            save_kwargs["optimize"] = True
    elif output_format == "WEBP":
        if quality >= 100:
            save_kwargs["lossless"] = True
        else:
            save_kwargs["quality"] = quality
            save_kwargs["method"] = 4
    elif output_format == "PNG":
        # Background removal için maksimum kalite (compress_level=0 en hızlı ve kayıpsız)
        # Quality 100 ise compress_level=0 (kayıpsız), düşük quality için daha yüksek sıkıştırma
        if background_removed or quality >= 95:
            save_kwargs["compress_level"] = 0  # Kayıpsız PNG
        else:
            save_kwargs["compress_level"] = max(0, min(9, (100 - quality) // 11))
    
    img.save(buffer, format=output_format, **save_kwargs)
    processed_bytes = buffer.getvalue()
    
    # If processed is larger than original and same format, return smaller one
    if len(processed_bytes) > original_size and not format_changed and not size_changed and not background_removed:
        metadata = {
            "original_size": original_size,
            "processed_size": original_size,
            "original_dimensions": original_dimensions,
            "processed_dimensions": original_dimensions,
            "format": original_format,
            "quality": quality,
            "compression_ratio": 0.0,
            "background_removed": False,
            "used_original": True
        }
        return image_bytes, metadata
    
    metadata = {
        "original_size": original_size,
        "processed_size": len(processed_bytes),
        "original_dimensions": original_dimensions,
        "processed_dimensions": img.size,
        "format": output_format.lower(),
        "quality": quality,
        "compression_ratio": round((1 - len(processed_bytes) / original_size) * 100, 1),
        "background_removed": background_removed
    }
    
    return processed_bytes, metadata


def get_image_info(image_bytes: bytes) -> dict:
    """Get basic information about an image."""
    img = Image.open(io.BytesIO(image_bytes))
    return {
        "width": img.size[0],
        "height": img.size[1],
        "format": img.format.lower() if img.format else "unknown",
        "mode": img.mode,
        "size_bytes": len(image_bytes)
    }


def is_background_removal_available() -> bool:
    """Check if background removal is available."""
    return REMBG_AVAILABLE

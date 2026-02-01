from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import io
import base64
import os
from typing import Optional
from backend.utils.image_processor import process_image, get_image_info, is_background_removal_available

app = FastAPI(
    title="MiniSquoosh API",
    description="Image compression and optimization API with AI background removal",
    version="2.0.0"
)

# CORS configuration for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Hugging Face
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Max file size: 50MB
MAX_FILE_SIZE = 50 * 1024 * 1024

# Serve static files if directory exists (for Hugging Face deployment)
STATIC_DIR = "/app/static"
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "MiniSquoosh API is running",
        "version": "2.0.0",
        "features": {
            "background_removal": is_background_removal_available()
        }
    }


@app.get("/")
async def root():
    """Serve the frontend application."""
    if os.path.exists(STATIC_DIR):
        index_path = os.path.join(STATIC_DIR, "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path)
    # Fallback if static files are not present
    return {
        "status": "ok",
        "message": "MiniSquoosh API is running (Frontend not found)",
        "version": "2.0.0"
    }


@app.get("/features")
async def get_features():
    """Get available features."""
    return {
        "background_removal": is_background_removal_available()
    }


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image and get its info.
    Returns the image as base64 along with metadata.
    """
    # Validate content type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Read file
    content = await file.read()
    
    # Check file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)}MB"
        )
    
    try:
        info = get_image_info(content)
        
        # Return base64 encoded image with info
        base64_image = base64.b64encode(content).decode("utf-8")
        
        return {
            "success": True,
            "image": base64_image,
            "info": info,
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")


@app.post("/process")
async def process_image_endpoint(
    file: UploadFile = File(...),
    width: Optional[int] = Query(None, ge=1, le=10000),
    height: Optional[int] = Query(None, ge=1, le=10000),
    format: str = Query("webp", pattern="^(jpeg|jpg|png|webp)$"),
    quality: int = Query(80, ge=1, le=100),
    keep_aspect_ratio: bool = Query(True),
    remove_background: bool = Query(False)
):
    """
    Process an image with the given parameters.
    Returns the processed image as base64 with metadata.
    """
    # Validate content type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Check if background removal is requested but not available
    if remove_background and not is_background_removal_available():
        raise HTTPException(
            status_code=400,
            detail="Background removal is not available. Please install rembg: pip install rembg"
        )
    
    content = await file.read()
    
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)}MB"
        )
    
    try:
        processed_bytes, metadata = process_image(
            image_bytes=content,
            width=width,
            height=height,
            format=format,
            quality=quality,
            keep_aspect_ratio=keep_aspect_ratio,
            remove_background=remove_background
        )
        
        base64_image = base64.b64encode(processed_bytes).decode("utf-8")
        
        return {
            "success": True,
            "image": base64_image,
            "metadata": metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@app.post("/download")
async def download_image(
    file: UploadFile = File(...),
    width: Optional[int] = Query(None, ge=1, le=10000),
    height: Optional[int] = Query(None, ge=1, le=10000),
    format: str = Query("webp", pattern="^(jpeg|jpg|png|webp)$"),
    quality: int = Query(80, ge=1, le=100),
    keep_aspect_ratio: bool = Query(True),
    remove_background: bool = Query(False)
):
    """
    Process and download an image directly.
    Returns the processed image file.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Check if background removal is requested but not available
    if remove_background and not is_background_removal_available():
        raise HTTPException(
            status_code=400,
            detail="Background removal is not available. Please install rembg: pip install rembg"
        )
    
    content = await file.read()
    
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)}MB"
        )
    
    try:
        processed_bytes, metadata = process_image(
            image_bytes=content,
            width=width,
            height=height,
            format=format,
            quality=quality,
            keep_aspect_ratio=keep_aspect_ratio,
            remove_background=remove_background
        )
        
        # Determine content type (may be PNG if background was removed)
        actual_format = metadata.get("format", format)
        content_type_map = {
            "jpeg": "image/jpeg",
            "jpg": "image/jpeg",
            "png": "image/png",
            "webp": "image/webp"
        }
        
        # Generate filename
        original_name = file.filename or "image"
        base_name = original_name.rsplit(".", 1)[0]
        suffix = "_nobg" if metadata.get("background_removed") else "_compressed"
        new_filename = f"{base_name}{suffix}.{actual_format}"
        
        return Response(
            content=processed_bytes,
            media_type=content_type_map.get(actual_format, "application/octet-stream"),
            headers={
                "Content-Disposition": f'attachment; filename="{new_filename}"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


# Serve static frontend files (for Hugging Face deployment)
STATIC_DIR = "/app/static"
if os.path.exists(STATIC_DIR):
    from fastapi.staticfiles import StaticFiles
    
    # Serve static assets
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve frontend files"""
        # Try exact file path first
        file_path = os.path.join(STATIC_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Try with .html extension
        html_path = os.path.join(STATIC_DIR, full_path, "index.html")
        if os.path.isfile(html_path):
            return FileResponse(html_path)
        
        # Fallback to main index.html (SPA routing)
        index_path = os.path.join(STATIC_DIR, "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path)
        
        raise HTTPException(status_code=404, detail="Not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
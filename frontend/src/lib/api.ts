// Use relative URL for production (Hugging Face), localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:8000');

export interface ImageInfo {
    width: number;
    height: number;
    format: string;
    mode: string;
    size_bytes: number;
}

export interface UploadResponse {
    success: boolean;
    image: string; // base64
    info: ImageInfo;
    filename: string;
}

export interface ProcessMetadata {
    original_size: number;
    processed_size: number;
    original_dimensions: [number, number];
    processed_dimensions: [number, number];
    format: string;
    quality: number;
    compression_ratio: number;
    background_removed?: boolean;
}

export interface ProcessResponse {
    success: boolean;
    image: string; // base64
    metadata: ProcessMetadata;
}

export interface ProcessParams {
    width?: number;
    height?: number;
    format?: "jpeg" | "png" | "webp";
    quality?: number;
    keep_aspect_ratio?: boolean;
    remove_background?: boolean;
}

export async function uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Upload failed");
    }

    return response.json();
}

export async function processImage(
    file: File,
    params: ProcessParams
): Promise<ProcessResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const queryParams = new URLSearchParams();
    if (params.width) queryParams.append("width", params.width.toString());
    if (params.height) queryParams.append("height", params.height.toString());
    if (params.format) queryParams.append("format", params.format);
    if (params.quality) queryParams.append("quality", params.quality.toString());
    if (params.keep_aspect_ratio !== undefined) {
        queryParams.append("keep_aspect_ratio", params.keep_aspect_ratio.toString());
    }
    if (params.remove_background !== undefined) {
        queryParams.append("remove_background", params.remove_background.toString());
    }

    const response = await fetch(
        `${API_BASE_URL}/process?${queryParams.toString()}`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Processing failed");
    }

    return response.json();
}

export async function downloadImage(
    file: File,
    params: ProcessParams
): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);

    const queryParams = new URLSearchParams();
    if (params.width) queryParams.append("width", params.width.toString());
    if (params.height) queryParams.append("height", params.height.toString());
    if (params.format) queryParams.append("format", params.format);
    if (params.quality) queryParams.append("quality", params.quality.toString());
    if (params.keep_aspect_ratio !== undefined) {
        queryParams.append("keep_aspect_ratio", params.keep_aspect_ratio.toString());
    }
    if (params.remove_background !== undefined) {
        queryParams.append("remove_background", params.remove_background.toString());
    }

    const response = await fetch(
        `${API_BASE_URL}/download?${queryParams.toString()}`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Download failed");
    }

    return response.blob();
}

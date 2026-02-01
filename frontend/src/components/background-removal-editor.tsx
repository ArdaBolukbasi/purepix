"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { downloadImage, ProcessParams } from "@/lib/api";
import { ComparisonSlider } from "./comparison-slider";
import { ResizeControls } from "./resize-controls";
import { SimpleStatsCard } from "./simple-stats-card";
import { DownloadButton } from "./download-button";
import { ArrowLeft, Grid3X3, Loader2, Wand2 } from "lucide-react";

interface BackgroundRemovalEditorProps {
    file: File;
    onBack: () => void;
    className?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:8000');

export function BackgroundRemovalEditor({ file, onBack, className }: BackgroundRemovalEditorProps) {
    // Original image state
    const [originalUrl, setOriginalUrl] = useState<string>("");
    const [originalDimensions, setOriginalDimensions] = useState<[number, number]>([0, 0]);

    // Processed image state
    const [processedUrl, setProcessedUrl] = useState<string>("");
    const [processedSize, setProcessedSize] = useState<number>(0);
    const [processedDimensions, setProcessedDimensions] = useState<[number, number]>([0, 0]);

    // Settings
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [keepAspectRatio, setKeepAspectRatio] = useState(true);

    // UI state
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCheckerboard, setShowCheckerboard] = useState(true);

    // Refs
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize with original image
    useEffect(() => {
        const url = URL.createObjectURL(file);
        setOriginalUrl(url);

        const img = new Image();
        img.onload = () => {
            setOriginalDimensions([img.width, img.height]);
            setWidth(img.width);
            setHeight(img.height);
        };
        img.src = url;

        return () => URL.revokeObjectURL(url);
    }, [file]);

    // Process image with background removal - using base64 API
    const processWithBgRemoval = useCallback(async () => {
        if (originalDimensions[0] === 0) return;

        setIsProcessing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const queryParams = new URLSearchParams();
            queryParams.append("width", width.toString());
            queryParams.append("height", height.toString());
            queryParams.append("format", "png");
            queryParams.append("quality", "100");
            queryParams.append("keep_aspect_ratio", keepAspectRatio.toString());
            queryParams.append("remove_background", "true");

            const response = await fetch(
                `${API_BASE_URL}/process?${queryParams.toString()}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Processing failed");
            }

            const result = await response.json();

            // Convert base64 to blob URL
            const base64Data = result.image;
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "image/png" });

            // Cleanup old URL
            if (processedUrl) {
                URL.revokeObjectURL(processedUrl);
            }

            const newUrl = URL.createObjectURL(blob);
            setProcessedUrl(newUrl);
            setProcessedSize(result.metadata.processed_size);
            setProcessedDimensions(result.metadata.processed_dimensions);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Processing failed");
        } finally {
            setIsProcessing(false);
        }
    }, [file, width, height, keepAspectRatio, originalDimensions]);

    // Debounced processing
    useEffect(() => {
        if (originalDimensions[0] === 0) return;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            processWithBgRemoval();
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [width, height, keepAspectRatio, originalDimensions, processWithBgRemoval]);

    // Handle download
    const handleDownload = useCallback(async () => {
        setIsDownloading(true);
        setError(null);

        try {
            const blob = await downloadImage(file, {
                width,
                height,
                format: "png",
                quality: 100,
                keep_aspect_ratio: keepAspectRatio,
                remove_background: true,
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${file.name.split(".")[0]}_nobg.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Download failed");
        } finally {
            setIsDownloading(false);
        }
    }, [file, width, height, keepAspectRatio]);

    return (
        <div className={cn("flex flex-col lg:flex-row gap-6", className)}>
            {/* Preview Area */}
            <div className="flex-1 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Back</span>
                    </button>

                    <div className="flex items-center gap-2">
                        {isProcessing && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Removing background...</span>
                            </div>
                        )}
                        <button
                            onClick={() => setShowCheckerboard(!showCheckerboard)}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                showCheckerboard
                                    ? "bg-primary/20 text-primary"
                                    : "bg-secondary text-muted-foreground hover:text-foreground"
                            )}
                            title="Toggle transparency preview"
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Comparison Slider */}
                <div className="flex-1 min-h-[400px] glass-card rounded-2xl overflow-hidden">
                    <ComparisonSlider
                        originalImage={originalUrl}
                        processedImage={processedUrl || originalUrl}
                        showCheckerboard={showCheckerboard}
                        className="h-full"
                    />
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Controls Panel */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
                {/* Mode Indicator */}
                <div className="glass-card rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                        <Wand2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Background Removal</h3>
                        <p className="text-xs text-muted-foreground">AI-powered transparency</p>
                    </div>
                </div>

                {/* Stats */}
                <SimpleStatsCard
                    originalSize={file.size}
                    processedSize={processedSize || file.size}
                    originalDimensions={originalDimensions}
                    processedDimensions={processedDimensions[0] > 0 ? processedDimensions : originalDimensions}
                    originalFormat={file.type.split("/")[1] || "unknown"}
                    processedFormat="png"
                />

                {/* Resize */}
                <ResizeControls
                    originalWidth={originalDimensions[0]}
                    originalHeight={originalDimensions[1]}
                    width={width}
                    height={height}
                    onWidthChange={setWidth}
                    onHeightChange={setHeight}
                    keepAspectRatio={keepAspectRatio}
                    onKeepAspectRatioChange={setKeepAspectRatio}
                />

                {/* Download */}
                <DownloadButton
                    onClick={handleDownload}
                    size={processedSize}
                    isLoading={isDownloading}
                    disabled={isProcessing || !processedUrl}
                />

                {/* Info */}
                <div className="glass-card rounded-xl p-4 text-xs text-muted-foreground">
                    <p className="mb-2">
                        <strong className="text-foreground">Output:</strong> PNG with transparency
                    </p>
                    <p>
                        Best for product photos, portraits, and objects with clear edges.
                    </p>
                </div>
            </div>
        </div>
    );
}

"use client";
import { cn } from "@/lib/utils";
import { processImage, downloadImage, ProcessParams } from "@/lib/api";
import { useState, useEffect, useCallback, useRef } from "react";
import { ComparisonSlider } from "./comparison-slider";
import { StatsCard } from "./stats-card";
import { ResizeControls } from "./resize-controls";
import { FormatSelector } from "./format-selector";
import { QualitySlider } from "./quality-slider";
import { DownloadButton } from "./download-button";
import { BackgroundRemovalToggle } from "./background-removal-toggle";
import { ArrowLeft, Loader2, ZoomIn, ZoomOut, Grid3X3 } from "lucide-react";

interface ImageEditorProps {
    file: File;
    onBack: () => void;
    className?: string;
}

export function ImageEditor({ file, onBack, className }: ImageEditorProps) {
    // Original image state
    const [originalUrl, setOriginalUrl] = useState<string>("");
    const [originalDimensions, setOriginalDimensions] = useState<[number, number]>([0, 0]);

    // Right side - customizable (processed)
    const [rightUrl, setRightUrl] = useState<string>("");
    const [rightSize, setRightSize] = useState<number>(0);
    const [rightDimensions, setRightDimensions] = useState<[number, number]>([0, 0]);

    // Right side controls
    const [rightWidth, setRightWidth] = useState<number | undefined>();
    const [rightHeight, setRightHeight] = useState<number | undefined>();
    const [rightFormat, setRightFormat] = useState<"jpeg" | "png" | "webp">("webp");
    const [rightQuality, setRightQuality] = useState(80);
    const [rightKeepAspectRatio, setRightKeepAspectRatio] = useState(true);
    const [rightRemoveBackground, setRightRemoveBackground] = useState(false);

    // UI state
    const [isProcessingRight, setIsProcessingRight] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [showCheckerboard, setShowCheckerboard] = useState(true);

    // Refs for cleanup
    const debounceRightRef = useRef<NodeJS.Timeout | null>(null);
    const rightUrlRef = useRef<string>("");

    // Get original format from file type
    const getFormatFromMime = (mimeType: string): "jpeg" | "png" | "webp" => {
        if (mimeType.includes("png")) return "png";
        if (mimeType.includes("webp")) return "webp";
        return "jpeg";
    };

    // Store original format for comparison
    const originalFormatRef = useRef<"jpeg" | "png" | "webp">("webp");

    // Initialize with original image
    useEffect(() => {
        const url = URL.createObjectURL(file);
        setOriginalUrl(url);

        // Set initial format based on file type
        const originalFormat = getFormatFromMime(file.type);
        originalFormatRef.current = originalFormat;

        // Get original dimensions
        const img = new Image();
        img.onload = () => {
            setOriginalDimensions([img.width, img.height]);
            setRightWidth(img.width);
            setRightHeight(img.height);
        };
        img.src = url;

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    // Process RIGHT side image
    const processRight = useCallback(async () => {
        if (!file || originalDimensions[0] === 0) return;

        setIsProcessingRight(true);
        setError(null);

        try {
            const params: ProcessParams = {
                width: rightWidth,
                height: rightHeight,
                format: rightRemoveBackground ? "png" : rightFormat,
                quality: rightQuality,
                keep_aspect_ratio: rightKeepAspectRatio,
                remove_background: rightRemoveBackground,
            };

            const result = await processImage(file, params);

            if (result.success) {
                const byteCharacters = atob(result.image);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const actualFormat = result.metadata.format || (rightRemoveBackground ? "png" : rightFormat);
                const blob = new Blob([byteArray], { type: `image/${actualFormat}` });

                if (rightUrlRef.current) {
                    URL.revokeObjectURL(rightUrlRef.current);
                }

                const newUrl = URL.createObjectURL(blob);
                rightUrlRef.current = newUrl;
                setRightUrl(newUrl);
                setRightSize(result.metadata.processed_size);
                setRightDimensions(result.metadata.processed_dimensions);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Processing failed");
        } finally {
            setIsProcessingRight(false);
        }
    }, [file, rightWidth, rightHeight, rightFormat, rightQuality, rightKeepAspectRatio, rightRemoveBackground, originalDimensions]);

    // Debounced processing for RIGHT side
    useEffect(() => {
        if (originalDimensions[0] === 0) return;

        if (debounceRightRef.current) {
            clearTimeout(debounceRightRef.current);
        }

        debounceRightRef.current = setTimeout(() => {
            processRight();
        }, 500);

        return () => {
            if (debounceRightRef.current) {
                clearTimeout(debounceRightRef.current);
            }
        };
    }, [rightWidth, rightHeight, rightFormat, rightQuality, rightKeepAspectRatio, rightRemoveBackground, originalDimensions, processRight]);

    // Handle download
    const handleDownload = useCallback(async (overrideFormat?: "jpeg" | "png" | "webp") => {
        setIsDownloading(true);
        setError(null);

        const downloadFormat = overrideFormat || (rightRemoveBackground ? "png" : rightFormat);

        const params: ProcessParams = {
            width: rightWidth,
            height: rightHeight,
            format: downloadFormat,
            quality: rightQuality,
            keep_aspect_ratio: rightKeepAspectRatio,
            remove_background: rightRemoveBackground,
        };

        try {
            const blob = await downloadImage(file, params);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const suffix = rightRemoveBackground ? "_nobg" : "_compressed";
            a.download = `${file.name.split(".")[0]}${suffix}.${downloadFormat}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Download failed");
        } finally {
            setIsDownloading(false);
        }
    }, [file, rightWidth, rightHeight, rightFormat, rightQuality, rightKeepAspectRatio, rightRemoveBackground]);

    // Check if transparency is needed
    const hasTransparency = rightRemoveBackground || rightFormat === "png";

    return (
        <div className={cn("w-full h-full flex flex-col lg:flex-row gap-6", className)}>
            {/* Left Side - Image Comparison */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={onBack}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl",
                            "glass-card hover:border-primary/50",
                            "text-foreground text-sm font-medium transition-all",
                            "hover:-translate-x-1"
                        )}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        New Image
                    </button>

                    <div className="flex items-center gap-2">
                        {/* Checkerboard Toggle */}
                        <button
                            onClick={() => setShowCheckerboard(!showCheckerboard)}
                            className={cn(
                                "p-2.5 rounded-xl transition-all",
                                showCheckerboard
                                    ? "bg-gradient-to-br from-primary to-accent text-white"
                                    : "glass-card hover:border-primary/50"
                            )}
                            title={showCheckerboard ? "Hide transparency grid" : "Show transparency grid"}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>

                        {/* Zoom Controls */}
                        <button
                            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                            className="p-2.5 rounded-xl glass-card hover:border-primary/50 transition-all disabled:opacity-50"
                            disabled={zoom <= 0.5}
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-muted-foreground w-14 text-center font-medium">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                            className="p-2.5 rounded-xl glass-card hover:border-primary/50 transition-all disabled:opacity-50"
                            disabled={zoom >= 3}
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Comparison Area */}
                <div className={cn(
                    "flex-1 relative rounded-2xl overflow-hidden border border-border/50",
                    showCheckerboard && hasTransparency ? "checkerboard" : "bg-black/50"
                )}>
                    {isProcessingRight && !rightUrl && (
                        <div className="absolute inset-0 flex items-center justify-center glass z-10">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
                                    <Loader2 className="w-10 h-10 text-primary animate-spin relative" />
                                </div>
                                <span className="text-muted-foreground font-medium">Processing image...</span>
                            </div>
                        </div>
                    )}

                    {originalUrl && rightUrl ? (
                        <div
                            style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: "center center",
                                transition: "transform 0.2s ease",
                                height: "100%",
                            }}
                        >
                            <ComparisonSlider
                                originalImage={originalUrl}
                                processedImage={rightUrl}
                                showCheckerboard={showCheckerboard && hasTransparency}
                                className="h-full"
                            />
                        </div>
                    ) : originalUrl ? (
                        <div className="h-full flex items-center justify-center p-4">
                            <img
                                src={originalUrl}
                                alt="Original"
                                className="max-w-full max-h-full object-contain"
                                style={{
                                    transform: `scale(${zoom})`,
                                    transition: "transform 0.2s ease",
                                }}
                            />
                        </div>
                    ) : null}

                    {/* Processing Indicator */}
                    {isProcessingRight && rightUrl && (
                        <div className="absolute bottom-4 right-4 glass px-4 py-2 rounded-xl flex items-center gap-2 animate-fade-in">
                            <Loader2 className="w-4 h-4 text-accent animate-spin" />
                            <span className="text-sm font-medium">Processing...</span>
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-4 p-4 rounded-xl glass border border-red-500/30 text-red-400 text-sm animate-scale-in">
                        {error}
                    </div>
                )}
            </div>

            {/* Right Side - Controls */}
            <div className="w-full lg:w-80 space-y-4 overflow-y-auto">
                {/* Title */}
                <div className="glass-card rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        Output Settings
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Left side shows original, right side shows edited result
                    </p>
                </div>

                {/* Background Removal Toggle */}
                <BackgroundRemovalToggle
                    enabled={rightRemoveBackground}
                    onToggle={setRightRemoveBackground}
                    isProcessing={isProcessingRight}
                />

                {/* Stats - Original vs Edited */}
                <StatsCard
                    leftSize={file.size}
                    rightSize={rightSize || file.size}
                    leftDimensions={originalDimensions}
                    rightDimensions={rightDimensions[0] > 0 ? rightDimensions : originalDimensions}
                    leftFormat={originalFormatRef.current}
                    rightFormat={rightRemoveBackground ? "png" : rightFormat}
                />

                {/* Quality */}
                <QualitySlider value={rightQuality} onChange={setRightQuality} />

                {/* Format - Disabled when background removal is on */}
                <div className={cn(rightRemoveBackground && "opacity-50 pointer-events-none")}>
                    <FormatSelector value={rightFormat} onChange={setRightFormat} />
                    {rightRemoveBackground && (
                        <p className="text-xs text-primary mt-2 px-2">
                            ℹ️ Format locked to PNG for transparency
                        </p>
                    )}
                </div>

                {/* Resize */}
                <ResizeControls
                    originalWidth={originalDimensions[0]}
                    originalHeight={originalDimensions[1]}
                    width={rightWidth}
                    height={rightHeight}
                    onWidthChange={setRightWidth}
                    onHeightChange={setRightHeight}
                    keepAspectRatio={rightKeepAspectRatio}
                    onKeepAspectRatioChange={setRightKeepAspectRatio}
                />

                {/* Download */}
                <DownloadButton
                    onClick={() => handleDownload()}
                    size={rightSize}
                    isLoading={isDownloading}
                    disabled={isProcessingRight || !rightUrl}
                />
            </div>
        </div>
    );
}

"use client";
import { cn } from "@/lib/utils";
import { Upload, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
    maxSize?: number;
    className?: string;
    mode?: "compress" | "remove-bg" | null;
}

export function UploadZone({
    onFileSelect,
    maxSize = 50 * 1024 * 1024,
    className,
    mode,
}: UploadZoneProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateAndSelect = useCallback(
        (file: File) => {
            setError(null);
            if (!file.type.startsWith("image/")) {
                setError("Please select an image file");
                return;
            }
            if (file.size > maxSize) {
                setError(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
                return;
            }
            onFileSelect(file);
        },
        [maxSize, onFileSelect]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) {
                validateAndSelect(file);
            }
        },
        [validateAndSelect]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                validateAndSelect(file);
            }
        },
        [validateAndSelect]
    );

    const handleDemoImage = useCallback(async () => {
        try {
            // Compress için manzara, Remove BG için ürün fotoğrafı
            const demoUrl = mode === "remove-bg"
                ? "/demo-remove.jpg"
                : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&q=90";
            
            const response = await fetch(demoUrl);
            const blob = await response.blob();
            const file = new File([blob], "demo-image.jpg", { type: "image/jpeg" });
            onFileSelect(file);
        } catch {
            setError("Could not load demo image. Please try uploading your own.");
        }
    }, [onFileSelect, mode]);

    return (
        <div className={cn("w-full max-w-2xl mx-auto", className)}>
            {/* Upload Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    "relative rounded-2xl border-2 border-dashed transition-all duration-500",
                    "flex flex-col items-center justify-center p-12 cursor-pointer",
                    "glass-card hover:border-primary/50",
                    "glow-border",
                    isDragOver && "active border-primary scale-[1.02]"
                )}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {/* Icon */}
                <div className={cn(
                    "relative w-20 h-20 rounded-2xl flex items-center justify-center mb-5",
                    "transition-all duration-500",
                    isDragOver && "scale-110"
                )}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl blur-xl" />
                    <div className={cn(
                        "relative w-full h-full rounded-2xl flex items-center justify-center",
                        "bg-gradient-to-br from-primary/20 to-accent/20",
                        "border border-primary/30",
                        isDragOver && "animate-pulse"
                    )}>
                        <Upload className={cn(
                            "w-9 h-9 text-primary transition-all duration-300",
                            isDragOver && "text-white scale-110"
                        )} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                    {isDragOver ? (
                        <span className="gradient-text">Release to Upload</span>
                    ) : (
                        "Drop Image Here"
                    )}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                    or click to browse • Max {maxSize / (1024 * 1024)}MB
                </p>

                <div className="flex gap-2">
                    {["PNG", "JPEG", "WebP", "GIF"].map((format) => (
                        <span key={format} className="px-3 py-1.5 text-xs rounded-lg font-medium bg-secondary/50 border border-border/50">
                            {format}
                        </span>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 rounded-xl glass border border-red-500/30 text-red-400 text-sm text-center animate-scale-in">
                    {error}
                </div>
            )}

            {/* Demo Button */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={handleDemoImage}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-xl",
                        "glass-card hover:border-primary/50",
                        "text-sm font-medium",
                        "transition-all duration-300 hover:-translate-y-0.5"
                    )}
                >
                    <Sparkles className="w-4 h-4 text-primary" />
                    Try Demo Image
                </button>
            </div>
        </div>
    );
}

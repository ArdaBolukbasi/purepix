"use client";
import { cn } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";
import { Lock, Unlock, RefreshCw } from "lucide-react";

interface ResizeControlsProps {
    originalWidth: number;
    originalHeight: number;
    width?: number;
    height?: number;
    onWidthChange: (value: number) => void;
    onHeightChange: (value: number) => void;
    keepAspectRatio?: boolean;
    onKeepAspectRatioChange?: (value: boolean) => void;
    className?: string;
}

export function ResizeControls({
    originalWidth,
    originalHeight,
    width,
    height,
    onWidthChange,
    onHeightChange,
    keepAspectRatio = true,
    onKeepAspectRatioChange,
    className,
}: ResizeControlsProps) {
    const [localWidth, setLocalWidth] = useState<string>((width || originalWidth).toString());
    const [localHeight, setLocalHeight] = useState<string>((height || originalHeight).toString());
    const [scalePercent, setScalePercent] = useState<string>("100");

    const aspectRatio = originalWidth / originalHeight;

    // Current scale calculation
    const currentScale = (width && originalWidth > 0) ? Math.round((width / originalWidth) * 100) : 100;

    // Sync local values when props change
    useEffect(() => {
        if (width !== undefined) {
            setLocalWidth(width.toString());
        }
    }, [width]);

    useEffect(() => {
        if (height !== undefined) {
            setLocalHeight(height.toString());
        }
    }, [height]);

    // Update scale input when dimensions change
    useEffect(() => {
        const scale = (width && originalWidth > 0) ? Math.round((width / originalWidth) * 100) : 100;
        setScalePercent(scale.toString());
    }, [width, originalWidth]);

    const handleWidthChange = useCallback((value: string) => {
        setLocalWidth(value);
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue > 0) {
            onWidthChange(numValue);
            if (keepAspectRatio) {
                const newHeight = Math.round(numValue / aspectRatio);
                setLocalHeight(newHeight.toString());
                onHeightChange(newHeight);
            }
        }
    }, [keepAspectRatio, aspectRatio, onWidthChange, onHeightChange]);

    const handleHeightChange = useCallback((value: string) => {
        setLocalHeight(value);
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue > 0) {
            onHeightChange(numValue);
            if (keepAspectRatio) {
                const newWidth = Math.round(numValue * aspectRatio);
                setLocalWidth(newWidth.toString());
                onWidthChange(newWidth);
            }
        }
    }, [keepAspectRatio, aspectRatio, onWidthChange, onHeightChange]);

    // Handle scale slider change
    const handleScaleSlider = useCallback((value: number) => {
        const newWidth = Math.round(originalWidth * (value / 100));
        const newHeight = Math.round(originalHeight * (value / 100));
        setLocalWidth(newWidth.toString());
        setLocalHeight(newHeight.toString());
        setScalePercent(value.toString());
        onWidthChange(newWidth);
        onHeightChange(newHeight);
    }, [originalWidth, originalHeight, onWidthChange, onHeightChange]);

    // Handle scale input change (custom percentage)
    const handleScaleInput = useCallback((value: string) => {
        setScalePercent(value);
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
            const newWidth = Math.round(originalWidth * (numValue / 100));
            const newHeight = Math.round(originalHeight * (numValue / 100));
            setLocalWidth(newWidth.toString());
            setLocalHeight(newHeight.toString());
            onWidthChange(newWidth);
            onHeightChange(newHeight);
        }
    }, [originalWidth, originalHeight, onWidthChange, onHeightChange]);

    const handleReset = useCallback(() => {
        setLocalWidth(originalWidth.toString());
        setLocalHeight(originalHeight.toString());
        setScalePercent("100");
        onWidthChange(originalWidth);
        onHeightChange(originalHeight);
    }, [originalWidth, originalHeight, onWidthChange, onHeightChange]);

    return (
        <div className={cn("glass-card rounded-xl p-5", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Resize
                </h3>
                <button
                    type="button"
                    onClick={handleReset}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        currentScale === 100
                            ? "text-muted-foreground cursor-default"
                            : "text-primary hover:bg-primary/10"
                    )}
                    disabled={currentScale === 100}
                >
                    <RefreshCw className="w-3 h-3" />
                    Reset
                </button>
            </div>

            {/* Scale Slider with Input */}
            <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Scale</span>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            value={scalePercent}
                            onChange={(e) => handleScaleInput(e.target.value)}
                            className={cn(
                                "w-14 px-2 py-1 rounded-lg text-sm font-bold text-right",
                                "bg-secondary border border-border/50",
                                "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                                "transition-all"
                            )}
                            min={1}
                            max={100}
                        />
                        <span className="text-xs text-muted-foreground font-medium">%</span>
                    </div>
                </div>

                {/* Slider Track */}
                <div className="relative h-8 flex items-center">
                    <div className="absolute w-full h-2 rounded-full bg-secondary border border-border/50" />
                    <div
                        className="absolute h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-150"
                        style={{ width: `${Math.min(currentScale, 100)}%` }}
                    />
                    <input
                        type="range"
                        min={10}
                        max={100}
                        value={currentScale}
                        onChange={(e) => handleScaleSlider(parseInt(e.target.value))}
                        className="absolute w-full h-8 cursor-pointer opacity-0"
                    />
                    {/* Custom Thumb */}
                    <div
                        className="absolute w-5 h-5 rounded-full bg-white border-2 border-primary shadow-lg pointer-events-none transition-all"
                        style={{ left: `calc(${((currentScale - 10) / 90) * 100}% - 10px)` }}
                    />
                </div>

                {/* Scale Labels */}
                <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                    <span>10%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Preset Buttons */}
            <div className="flex gap-2 mb-4">
                {[25, 50, 75, 100].map((preset) => (
                    <button
                        key={preset}
                        onClick={() => handleScaleSlider(preset)}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300",
                            currentScale === preset
                                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20"
                                : "bg-secondary hover:bg-primary/20 hover:text-primary border border-border/50 hover:border-primary/50"
                        )}
                    >
                        {preset}%
                    </button>
                ))}
            </div>

            {/* Width & Height Inputs */}
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <label className="text-xs text-muted-foreground block mb-1.5">Width</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={localWidth}
                            onChange={(e) => handleWidthChange(e.target.value)}
                            className={cn(
                                "w-full px-3 py-2.5 pr-8 rounded-lg text-sm font-medium",
                                "bg-secondary border border-border/50",
                                "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                                "transition-all"
                            )}
                            min={1}
                            max={10000}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
                    </div>
                </div>

                {/* Lock Button */}
                <button
                    onClick={() => onKeepAspectRatioChange?.(!keepAspectRatio)}
                    className={cn(
                        "mt-6 p-2.5 rounded-lg transition-all duration-300",
                        keepAspectRatio
                            ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30"
                            : "bg-secondary border border-border/50 hover:border-primary/50 text-muted-foreground"
                    )}
                    title={keepAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                >
                    {keepAspectRatio ? (
                        <Lock className="w-4 h-4" />
                    ) : (
                        <Unlock className="w-4 h-4" />
                    )}
                </button>

                <div className="flex-1">
                    <label className="text-xs text-muted-foreground block mb-1.5">Height</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={localHeight}
                            onChange={(e) => handleHeightChange(e.target.value)}
                            className={cn(
                                "w-full px-3 py-2.5 pr-8 rounded-lg text-sm font-medium",
                                "bg-secondary border border-border/50",
                                "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                                "transition-all"
                            )}
                            min={1}
                            max={10000}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
                    </div>
                </div>
            </div>

            {/* Dimensions Info */}
            <div className="mt-3 text-center text-xs text-muted-foreground">
                Original: {originalWidth} × {originalHeight} px
            </div>
        </div>
    );
}

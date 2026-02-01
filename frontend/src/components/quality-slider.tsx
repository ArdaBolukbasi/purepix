"use client";
import { cn } from "@/lib/utils";
import { useState, useCallback, useRef } from "react";

interface QualitySliderProps {
    value: number;
    onChange: (value: number) => void;
    onChangeEnd?: (value: number) => void;
    className?: string;
}

export function QualitySlider({
    value,
    onChange,
    onChangeEnd,
    className,
}: QualitySliderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = parseInt(e.target.value);
            onChange(newValue);
        },
        [onChange]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            onChangeEnd?.(value);
        }, 300);
    }, [onChangeEnd, value]);

    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const getQualityLabel = (q: number): string => {
        if (q >= 90) return "Maximum";
        if (q >= 75) return "High";
        if (q >= 50) return "Medium";
        if (q >= 25) return "Low";
        return "Minimum";
    };

    const getQualityColor = (q: number): string => {
        if (q >= 75) return "text-emerald-400";
        if (q >= 50) return "text-primary";
        if (q >= 25) return "text-yellow-400";
        return "text-red-400";
    };

    const getProgressGradient = (q: number): string => {
        if (q >= 75) return "from-emerald-500 to-teal-400";
        if (q >= 50) return "from-primary to-accent";
        if (q >= 25) return "from-yellow-500 to-orange-500";
        return "from-red-500 to-red-600";
    };

    const getBadgeColor = (q: number): string => {
        if (q >= 75) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        if (q >= 50) return "bg-primary/20 text-primary border-primary/30";
        if (q >= 25) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        return "bg-red-500/20 text-red-400 border-red-500/30";
    };

    return (
        <div className={cn("glass-card rounded-xl p-5", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    Quality
                </h3>
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "text-xs font-semibold px-2.5 py-1 rounded-lg border",
                            getBadgeColor(value)
                        )}
                    >
                        {getQualityLabel(value)}
                    </span>
                    <span className={cn("text-2xl font-bold tabular-nums", getQualityColor(value))}>
                        {value}%
                    </span>
                </div>
            </div>

            {/* Custom Slider Track */}
            <div className="relative h-8 flex items-center">
                {/* Background Track */}
                <div className="absolute w-full h-2 rounded-full bg-secondary border border-border/50" />

                {/* Progress Track */}
                <div
                    className={cn(
                        "absolute h-2 rounded-full bg-gradient-to-r transition-all duration-150",
                        getProgressGradient(value)
                    )}
                    style={{ width: `${value}%` }}
                />

                {/* Input Range */}
                <input
                    type="range"
                    min={1}
                    max={100}
                    value={value}
                    onChange={handleChange}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={handleMouseUp}
                    className={cn(
                        "absolute w-full h-8 cursor-pointer",
                        isDragging && "thumb-active"
                    )}
                />
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-3 text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Smaller file
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                    Better quality
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
            </div>

            {/* Preset Buttons */}
            <div className="flex gap-2 mt-4">
                {[100, 80, 60, 40].map((preset) => (
                    <button
                        key={preset}
                        onClick={() => onChange(preset)}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300",
                            value === preset
                                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20"
                                : "bg-secondary hover:bg-primary/20 hover:text-primary border border-border/50 hover:border-primary/50"
                        )}
                    >
                        {preset}%
                    </button>
                ))}
            </div>
        </div>
    );
}

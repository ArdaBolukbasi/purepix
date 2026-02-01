"use client";
import { cn, formatBytes } from "@/lib/utils";
import { TrendingDown, TrendingUp, FileImage, Layers } from "lucide-react";

interface SimpleStatsCardProps {
    originalSize: number;
    processedSize: number;
    originalDimensions?: [number, number];
    processedDimensions?: [number, number];
    originalFormat?: string;
    processedFormat?: string;
    className?: string;
}

export function SimpleStatsCard({
    originalSize,
    processedSize,
    originalDimensions,
    processedDimensions,
    originalFormat,
    processedFormat,
    className,
}: SimpleStatsCardProps) {
    const reduction = originalSize > 0
        ? Math.round((1 - processedSize / originalSize) * 100)
        : 0;
    const isSmaller = reduction > 0;

    const formatLabel = (format?: string) => {
        if (!format) return "";
        return format.toUpperCase();
    };

    return (
        <div className={cn("glass-card rounded-xl p-5 animate-fade-in", className)}>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Stats
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {/* Original */}
                <div className="p-2.5 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="flex items-center justify-between mb-1">
                        <FileImage className="w-3.5 h-3.5 text-muted-foreground" />
                        {originalFormat && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                                {formatLabel(originalFormat)}
                            </span>
                        )}
                    </div>
                    <p className="text-lg font-bold text-foreground">{formatBytes(originalSize)}</p>
                    {originalDimensions && (
                        <p className="text-[10px] text-muted-foreground">
                            {originalDimensions[0]} × {originalDimensions[1]}
                        </p>
                    )}
                </div>

                {/* Processed */}
                <div className="p-2.5 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="flex items-center justify-between mb-1">
                        <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                        {processedFormat && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent uppercase">
                                {formatLabel(processedFormat)}
                            </span>
                        )}
                    </div>
                    <p className="text-lg font-bold text-foreground">{formatBytes(processedSize)}</p>
                    {processedDimensions && (
                        <p className="text-[10px] text-muted-foreground">
                            {processedDimensions[0]} × {processedDimensions[1]}
                        </p>
                    )}
                </div>
            </div>

            {/* Comparison Badge */}
            <div className={cn(
                "mt-3 flex items-center justify-center gap-2 py-2 rounded-lg",
                isSmaller
                    ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30"
                    : "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30"
            )}>
                {isSmaller ? (
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                ) : (
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                )}
                <span className={cn(
                    "text-lg font-bold",
                    isSmaller ? "text-emerald-400" : "text-yellow-400"
                )}>
                    {isSmaller ? `-${reduction}%` : `+${Math.abs(reduction)}%`}
                </span>
                <span className={cn(
                    "text-sm font-medium",
                    isSmaller ? "text-emerald-400/80" : "text-yellow-400/80"
                )}>
                    {isSmaller ? "smaller" : "larger"}
                </span>
            </div>
        </div>
    );
}

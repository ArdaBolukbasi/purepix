"use client";
import { cn, formatBytes } from "@/lib/utils";
import { TrendingDown, TrendingUp, FileImage, Layers, Equal } from "lucide-react";

interface StatsCardProps {
    leftSize: number;
    rightSize: number;
    leftDimensions?: [number, number];
    rightDimensions?: [number, number];
    leftFormat?: string;
    rightFormat?: string;
    className?: string;
}

export function StatsCard({
    leftSize,
    rightSize,
    leftDimensions,
    rightDimensions,
    leftFormat,
    rightFormat,
    className,
}: StatsCardProps) {
    // Right vs Left comparison
    const reduction = leftSize > 0
        ? Math.round((1 - rightSize / leftSize) * 100)
        : 0;
    const isSmaller = reduction > 0;
    const isSame = leftSize === rightSize;

    const formatLabel = (format?: string) => {
        if (!format) return "";
        return format.toUpperCase();
    };

    return (
        <div className={cn("glass-card rounded-xl p-5 animate-fade-in", className)}>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Compression Stats
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {/* Original */}
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <FileImage className="w-4 h-4 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground font-medium">Original</p>
                        </div>
                        {leftFormat && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase">
                                {formatLabel(leftFormat)}
                            </span>
                        )}
                    </div>
                    <p className="text-xl font-bold text-foreground">
                        {formatBytes(leftSize)}
                    </p>
                    {leftDimensions && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {leftDimensions[0]} × {leftDimensions[1]}
                        </p>
                    )}
                </div>

                {/* Edited */}
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground font-medium">Edited</p>
                        </div>
                        {rightFormat && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent uppercase">
                                {formatLabel(rightFormat)}
                            </span>
                        )}
                    </div>
                    <p className="text-xl font-bold text-foreground">
                        {formatBytes(rightSize)}
                    </p>
                    {rightDimensions && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {rightDimensions[0]} × {rightDimensions[1]}
                        </p>
                    )}
                </div>
            </div>

            {/* Comparison Badge */}
            <div className={cn(
                "mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl",
                isSame
                    ? "bg-blue-500/10 border border-blue-500/30"
                    : isSmaller
                        ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30"
                        : "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30"
            )}>
                {isSame ? (
                    <Equal className="w-5 h-5 text-blue-400" />
                ) : isSmaller ? (
                    <TrendingDown className="w-5 h-5 text-emerald-400" />
                ) : (
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                )}
                <span className={cn(
                    "text-xl font-bold",
                    isSame ? "text-blue-400" : isSmaller ? "text-emerald-400" : "text-yellow-400"
                )}>
                    {isSame ? "0%" : isSmaller ? `-${reduction}%` : `+${Math.abs(reduction)}%`}
                </span>
                <span className={cn(
                    "text-sm font-medium",
                    isSame ? "text-blue-400/80" : isSmaller ? "text-emerald-400/80" : "text-yellow-400/80"
                )}>
                    {isSame ? "same" : isSmaller ? "smaller" : "larger"}
                </span>
            </div>
        </div>
    );
}

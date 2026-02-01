"use client";
import { cn } from "@/lib/utils";
import { Eraser, Loader2, CheckCircle } from "lucide-react";

interface BackgroundRemovalToggleProps {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    isProcessing?: boolean;
    disabled?: boolean;
    className?: string;
}

export function BackgroundRemovalToggle({
    enabled,
    onToggle,
    isProcessing = false,
    disabled = false,
    className,
}: BackgroundRemovalToggleProps) {
    return (
        <div className={cn(
            "glass-card rounded-xl p-5 transition-all duration-300",
            enabled && "ring-2 ring-primary/50",
            className
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                        enabled
                            ? "bg-gradient-to-br from-primary to-accent"
                            : "bg-secondary"
                    )}>
                        {isProcessing ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : enabled ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                            <Eraser className="w-5 h-5 text-muted-foreground" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            Remove Background
                            {enabled && !isProcessing && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    Active
                                </span>
                            )}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            AI-powered background removal
                        </p>
                    </div>
                </div>

                {/* Toggle Switch */}
                <button
                    onClick={() => !disabled && !isProcessing && onToggle(!enabled)}
                    disabled={disabled || isProcessing}
                    className={cn(
                        "toggle-switch",
                        enabled && "active",
                        (disabled || isProcessing) && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label="Toggle background removal"
                />
            </div>

            {/* Info Text */}
            {enabled && (
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 animate-scale-in">
                    <p className="text-xs text-muted-foreground">
                        🎨 Output will be saved as <strong className="text-foreground">PNG</strong> with transparent background.
                        The checkerboard pattern shows transparency preview.
                    </p>
                </div>
            )}
        </div>
    );
}

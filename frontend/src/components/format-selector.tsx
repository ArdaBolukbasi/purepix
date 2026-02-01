"use client";
import { cn } from "@/lib/utils";
import { Sparkles, Check } from "lucide-react";

interface FormatSelectorProps {
    value: "jpeg" | "png" | "webp";
    onChange: (value: "jpeg" | "png" | "webp") => void;
    className?: string;
}

const formats = [
    { value: "webp" as const, label: "WebP", recommended: true, icon: "🌐", description: "Best compression" },
    { value: "jpeg" as const, label: "JPEG", recommended: false, icon: "📷", description: "Universal support" },
    { value: "png" as const, label: "PNG", recommended: false, icon: "🎨", description: "Transparency support" },
];

export function FormatSelector({
    value,
    onChange,
    className,
}: FormatSelectorProps) {
    return (
        <div className={cn("glass-card rounded-xl p-5", className)}>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                Format
            </h3>

            {/* Format Buttons - Grid Layout */}
            <div className="grid grid-cols-3 gap-2">
                {formats.map((format) => (
                    <button
                        key={format.value}
                        onClick={() => onChange(format.value)}
                        className={cn(
                            "relative flex flex-col items-center gap-2 p-3 rounded-xl",
                            "border transition-all duration-300",
                            value === format.value
                                ? "bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg shadow-primary/20"
                                : "bg-secondary/50 border-border/50 hover:border-primary/50 hover:bg-secondary"
                        )}
                    >
                        {/* Selected indicator */}
                        {value === format.value && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                        )}

                        <span className="text-2xl">{format.icon}</span>
                        <div className="text-center">
                            <span className={cn(
                                "font-semibold text-sm block",
                                value === format.value ? "text-primary" : "text-foreground"
                            )}>
                                {format.label}
                            </span>
                            {format.recommended && (
                                <span className="flex items-center justify-center gap-0.5 text-[10px] text-accent mt-0.5">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    Best
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Format Info */}
            <div className="mt-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-xs text-muted-foreground">
                    {value === "webp" && "✨ Best compression with transparency support. Modern browsers only."}
                    {value === "jpeg" && "📷 Great for photos. No transparency. Universal compatibility."}
                    {value === "png" && "🎨 Lossless with full transparency. Larger file sizes."}
                </p>
            </div>
        </div>
    );
}

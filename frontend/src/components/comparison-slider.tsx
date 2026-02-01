"use client";
import { cn } from "@/lib/utils";
import {
    ReactCompareSlider,
    ReactCompareSliderImage,
    ReactCompareSliderHandle,
} from "react-compare-slider";

interface ComparisonSliderProps {
    originalImage: string;
    processedImage: string;
    showCheckerboard?: boolean;
    className?: string;
}

export function ComparisonSlider({
    originalImage,
    processedImage,
    showCheckerboard = false,
    className,
}: ComparisonSliderProps) {
    // Boş src hatası önlemek için kontrol
    if (!originalImage || !processedImage) {
        return (
            <div className={cn("relative rounded-xl overflow-hidden flex items-center justify-center bg-muted/30", className)}>
                <span className="text-muted-foreground">Loading images...</span>
            </div>
        );
    }

    return (
        <div className={cn("relative rounded-xl overflow-hidden", className)}>
            <ReactCompareSlider
                itemOne={
                    <div className={cn("w-full h-full", showCheckerboard ? "checkerboard" : "bg-black")}>
                        <ReactCompareSliderImage
                            src={originalImage}
                            alt="Left Side"
                            style={{ objectFit: "contain", background: "transparent" }}
                        />
                    </div>
                }
                itemTwo={
                    <div className={cn("w-full h-full", showCheckerboard ? "checkerboard" : "bg-black")}>
                        <ReactCompareSliderImage
                            src={processedImage}
                            alt="Right Side"
                            style={{ objectFit: "contain", background: "transparent" }}
                        />
                    </div>
                }
                handle={
                    <ReactCompareSliderHandle
                        buttonStyle={{
                            background: "linear-gradient(180deg, #8b5cf6, #06b6d4)",
                            border: "none",
                            boxShadow: "0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(6, 182, 212, 0.3)",
                            width: 52,
                            height: 52,
                            backdropFilter: "blur(10px)",
                        }}
                        linesStyle={{
                            width: 3,
                            background: "linear-gradient(180deg, #8b5cf6, #06b6d4)",
                            boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)",
                        }}
                    />
                }
                className="w-full h-full"
                style={{
                    height: "100%",
                }}
            />
            {/* Labels */}
            <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-foreground">Original</span>
            </div>
            <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-medium text-foreground">Edited</span>
            </div>

            {/* Checkerboard indicator */}
            {showCheckerboard && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-3 py-1.5 rounded-lg">
                    <span className="text-xs text-muted-foreground">Transparency Preview</span>
                </div>
            )}
        </div>
    );
}

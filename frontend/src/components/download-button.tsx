"use client";
import { cn, formatBytes } from "@/lib/utils";
import { Download, Loader2 } from "lucide-react";

interface DownloadButtonProps {
    onClick: () => void;
    size?: number;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
}

export function DownloadButton({
    onClick,
    size,
    isLoading = false,
    disabled = false,
    className,
}: DownloadButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={cn(
                "relative w-full py-4 rounded-xl font-bold text-lg transition-all duration-300",
                "flex items-center justify-center gap-3",
                "bg-gradient-to-r from-primary via-purple-500 to-accent",
                "text-white shadow-xl shadow-primary/30",
                "hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
                "active:scale-[0.98]",
                "overflow-hidden group",
                className
            )}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                    {size !== undefined && (
                        <span className="text-sm opacity-80 font-medium">
                            ({formatBytes(size)})
                        </span>
                    )}
                </>
            )}
        </button>
    );
}

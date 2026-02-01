"use client";
import { cn } from "@/lib/utils";

interface SettingsTabsProps {
    activeTab: "left" | "right";
    onTabChange: (tab: "left" | "right") => void;
    className?: string;
}

export function SettingsTabs({
    activeTab,
    onTabChange,
    className,
}: SettingsTabsProps) {
    return (
        <div className={cn("glass-card p-1.5 rounded-xl", className)}>
            <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
                <button
                    onClick={() => onTabChange("left")}
                    className={cn(
                        "flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                        "flex items-center justify-center gap-2",
                        activeTab === "left"
                            ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    )}
                >
                    <div className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        activeTab === "left" ? "bg-white" : "bg-primary"
                    )} />
                    Left Side
                </button>
                <button
                    onClick={() => onTabChange("right")}
                    className={cn(
                        "flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                        "flex items-center justify-center gap-2",
                        activeTab === "right"
                            ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    )}
                >
                    <div className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        activeTab === "right" ? "bg-white" : "bg-accent"
                    )} />
                    Right Side
                </button>
            </div>
        </div>
    );
}
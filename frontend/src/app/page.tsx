"use client";
import { useState, useRef } from "react";
import { UploadZone } from "@/components/upload-zone";
import { ImageEditor } from "@/components/image-editor";
import { BackgroundRemovalEditor } from "@/components/background-removal-editor";
import { Sparkles, Zap, Shield, Gauge, ImageDown, Wand2, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type EditorMode = "compress" | "remove-bg" | null;

export default function Home() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editorMode, setEditorMode] = useState<EditorMode>(null);
    const uploadZoneRef = useRef<HTMLDivElement>(null);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const handleBack = () => {
        setSelectedFile(null);
    };

    const handleModeSelect = (mode: "compress" | "remove-bg") => {
        if (editorMode === mode) {
            // Toggle off if already selected
            setEditorMode(null);
        } else {
            setEditorMode(mode);
            // Scroll to upload zone after a short delay to allow expansion
            // Only on mobile (width < 768px)
            if (window.innerWidth < 768) {
                setTimeout(() => {
                    uploadZoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
            }
        }
    };

    return (
        <main className="min-h-screen flex flex-col relative" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
            {/* Animated Background */}
            <div className="animated-bg" />

            {/* Floating Orbs */}
            <div className="floating-orb orb-primary w-96 h-96 top-20 -left-48 opacity-30" />
            <div className="floating-orb orb-accent w-80 h-80 top-1/2 -right-40 opacity-20" style={{ animationDelay: '-5s' }} />
            <div className="floating-orb orb-primary w-64 h-64 bottom-20 left-1/4 opacity-20" style={{ animationDelay: '-10s' }} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10">
                {selectedFile ? (
                    /* Editor Mode */
                    <div className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full animate-fade-in">
                        {editorMode === "compress" ? (
                            <ImageEditor file={selectedFile} onBack={handleBack} />
                        ) : (
                            <BackgroundRemovalEditor file={selectedFile} onBack={handleBack} />
                        )}
                    </div>
                ) : (
                    /* Mode Selection */
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        {/* Hero Text */}
                        <div className="text-center mb-6 animate-slide-up">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light mb-4">
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span className="text-xs text-muted-foreground">Next-Gen Image Processing</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
                                <span className="gradient-text">Transform</span>
                                <br />
                                <span className="text-foreground">Your Images</span>
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Select a mode to get started
                            </p>
                        </div>

                        {/* Mode Selector - Large Cards */}
                        <div className="w-full max-w-4xl mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ModeCard
                                    icon={<ImageDown className="w-10 h-10" />}
                                    title="Compress & Optimize"
                                    description="Reduce file size, change format, adjust quality and resize images"
                                    features={["WebP, JPEG, PNG", "Quality control", "Resize & crop", "Side-by-side preview"]}
                                    gradient="from-primary via-purple-500 to-accent"
                                    isActive={editorMode === "compress"}
                                    onClick={() => handleModeSelect("compress")}
                                />
                                <ModeCard
                                    icon={<Wand2 className="w-10 h-10" />}
                                    title="Remove Background"
                                    description="AI-powered background removal for transparent PNG output"
                                    features={["AI-powered", "Transparent PNG", "Product photos", "Resize support"]}
                                    gradient="from-pink-500 via-rose-500 to-purple-500"
                                    isActive={editorMode === "remove-bg"}
                                    onClick={() => handleModeSelect("remove-bg")}
                                />
                            </div>
                        </div>

                        {/* Upload Zone - Animated appearance */}
                        <div
                            ref={uploadZoneRef}
                            className={cn(
                                "w-full max-w-2xl transition-all duration-500 ease-out overflow-hidden scroll-mt-24",
                                editorMode
                                    ? "opacity-100 max-h-[500px] translate-y-0"
                                    : "opacity-0 max-h-0 -translate-y-4 pointer-events-none"
                            )}
                        >
                            {/* Arrow indicator */}
                            <div
                                key={editorMode}
                                className={cn(
                                    "flex justify-center mb-4 transition-all duration-300 animate-slide-up",
                                    editorMode ? "opacity-100" : "opacity-0"
                                )}
                            >
                                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                    <ChevronDown className="w-5 h-5 animate-bounce" />
                                    <span className="text-sm">Drop Image Here</span>
                                </div>
                            </div>
                            <UploadZone onFileSelect={handleFileSelect} mode={editorMode} />
                        </div>

                        {/* Features */}
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <FeatureCard
                                icon={<Zap className="w-6 h-6" />}
                                title="Lightning Fast"
                                description="Real-time preview with instant processing"
                                gradient="from-yellow-500 to-orange-500"
                            />
                            <FeatureCard
                                icon={<Gauge className="w-6 h-6" />}
                                title="Precise Control"
                                description="Fine-tune quality, size, and format"
                                gradient="from-primary to-accent"
                            />
                            <FeatureCard
                                icon={<Shield className="w-6 h-6" />}
                                title="100% Private"
                                description="All processing happens locally"
                                gradient="from-emerald-500 to-teal-500"
                            />
                        </div>
                    </div>
                )}
            </div>

        </main>
    );
}

function ModeCard({
    icon,
    title,
    description,
    features,
    gradient,
    isActive,
    onClick,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    features: string[];
    gradient: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "glass-card rounded-2xl p-8 text-left transition-all duration-300 relative overflow-hidden",
                "border-2 hover:scale-[1.02] min-h-[280px]",
                isActive
                    ? "border-primary shadow-xl shadow-primary/20"
                    : "border-transparent hover:border-primary/30"
            )}
        >
            {/* Active indicator */}
            {isActive && (
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                    <Check className="w-4 h-4 text-white" />
                </div>
            )}

            {/* Glow effect when active */}
            {isActive && (
                <div className={cn(
                    "absolute inset-0 opacity-10 bg-gradient-to-br",
                    gradient
                )} />
            )}

            {/* Icon */}
            <div className={cn(
                "inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br mb-5 transition-all",
                gradient,
                isActive && "scale-110 shadow-lg"
            )}>
                <div className="text-white">{icon}</div>
            </div>

            {/* Title & Description */}
            <h3 className={cn(
                "font-bold text-2xl mb-3",
                isActive ? "text-primary" : "text-foreground"
            )}>{title}</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{description}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
                {features.map((feature, i) => (
                    <span
                        key={i}
                        className={cn(
                            "text-xs px-3 py-1.5 rounded-full transition-colors",
                            isActive
                                ? "bg-primary/20 text-primary"
                                : "bg-secondary text-muted-foreground"
                        )}
                    >
                        {feature}
                    </span>
                ))}
            </div>

            {/* Click hint */}
            <div className={cn(
                "absolute bottom-4 right-4 text-xs transition-opacity",
                isActive ? "opacity-0" : "opacity-50"
            )}>
                Click to select
            </div>
        </button>
    );
}

function FeatureCard({
    icon,
    title,
    description,
    gradient,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
}) {
    return (
        <div className="glass-card rounded-2xl p-6 text-center card-3d group cursor-default">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} mb-4 transition-transform group-hover:scale-110`}>
                <div className="text-white">{icon}</div>
            </div>
            <h3 className="font-semibold text-foreground text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

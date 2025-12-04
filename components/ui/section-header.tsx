import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeaderProps {
    badge?: string;
    title: string;
    description?: string;
    align?: "left" | "center" | "right";
    className?: string;
}

export function SectionHeader({
    badge,
    title,
    description,
    align = "center",
    className,
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-4 mb-12",
                {
                    "text-center items-center": align === "center",
                    "text-left items-start": align === "left",
                    "text-right items-end": align === "right",
                },
                className
            )}
        >
            {badge && (
                <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider">
                        {badge}
                    </span>
                </div>
            )}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {title}
            </h2>
            {description && (
                <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}

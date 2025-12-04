import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { TransitionLink } from "@/components/transition-link";

interface FeatureCardProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    image?: string;
    href: string;
    count?: string;
    className?: string;
}

export function FeatureCard({
    title,
    description,
    icon: Icon,
    image,
    href,
    count,
    className,
}: FeatureCardProps) {
    return (
        <Card
            className={cn(
                "group/card hover:shadow-2xl transition-all duration-500 h-full shadow-lg overflow-hidden border border-border/50 hover:border-primary/50 cursor-pointer bg-card",
                className
            )}
        >
            <TransitionLink href={href} className="flex flex-col h-full">
                {/* Image Section */}
                <div className="relative h-56 sm:h-64 overflow-hidden">
                    {image && (
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 group-hover/card:scale-110"
                            style={{ backgroundImage: `url(${image})` }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {Icon && (
                        <div className="absolute top-4 left-4 w-10 h-10 sm:w-12 sm:h-12 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-all duration-300">
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                    )}

                    {count && (
                        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                            <p className="text-[10px] sm:text-xs font-semibold text-foreground">
                                {count}
                            </p>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <CardContent className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover/card:text-primary transition-colors duration-300">
                            {title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                            {description}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full bg-transparent border-2 group-hover/card:bg-primary group-hover/card:text-primary-foreground group-hover/card:border-primary transition-all duration-300 mt-auto"
                    >
                        Explore
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/card:translate-x-1 transition-transform duration-300" />
                    </Button>
                </CardContent>
            </TransitionLink>
        </Card>
    );
}

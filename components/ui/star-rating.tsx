"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  readonly = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleStarClick = (starIndex: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const filled = index < Math.floor(rating);
        const halfFilled = index < rating && index >= Math.floor(rating);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(index)}
            disabled={readonly}
            className={cn(
              "transition-colors duration-200",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default",
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled && "fill-yellow-400 text-yellow-400",
                halfFilled && "fill-yellow-200 text-yellow-400",
                !filled && !halfFilled && "text-gray-300",
              )}
            />
          </button>
        );
      })}
      {rating > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

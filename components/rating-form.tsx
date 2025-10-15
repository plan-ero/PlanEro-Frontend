"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/ui/star-rating";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const ratingSchema = z.object({
  rating: z
    .number()
    .min(1, "Please select a rating")
    .max(5, "Rating cannot exceed 5"),
  review: z.string().optional(),
});

type RatingFormData = z.infer<typeof ratingSchema>;

interface RatingFormProps {
  serviceId?: number;
  vendorId?: number;
  onRatingSubmitted?: () => void;
  onCancel?: () => void;
}

export function RatingForm({
  serviceId,
  vendorId,
  onRatingSubmitted,
  onCancel,
}: RatingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const { data: session } = useSession();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
  });

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  const onSubmit = async (data: RatingFormData) => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a rating.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: data.rating,
          review: data.review,
          serviceId,
          vendorId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit rating");
      }

      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });

      reset();
      setSelectedRating(0);
      onRatingSubmitted?.();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit rating",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rating">Rating *</Label>
        <div className="flex items-center gap-2">
          <StarRating
            rating={selectedRating}
            onRatingChange={handleRatingChange}
            readonly={false}
            size="lg"
          />
          {errors.rating && (
            <span className="text-sm text-destructive">
              {errors.rating.message}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review">Review (Optional)</Label>
        <Textarea
          {...register("review")}
          placeholder="Share your experience..."
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || selectedRating === 0}>
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </Button>
      </div>
    </form>
  );
}

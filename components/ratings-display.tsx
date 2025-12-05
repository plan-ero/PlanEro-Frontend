"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { RatingForm } from "@/components/rating-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Star, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Rating {
  id: number;
  userId: number;
  rating: number;
  review?: string;
  serviceId?: number;
  vendorId?: number;
  createdAt: string;
  updatedAt: string;
}

interface RatingsDisplayProps {
  serviceId?: number;
  vendorId?: number;
  title?: string;
  showAddRating?: boolean;
}

export function RatingsDisplay({
  serviceId,
  vendorId,
  title,
  showAddRating = true,
}: RatingsDisplayProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (serviceId) params.append("serviceId", serviceId.toString());
      if (vendorId) params.append("vendorId", vendorId.toString());

      const response = await fetch(`/api/ratings?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ratings");
      }

      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      toast({
        title: "Error",
        description: "Failed to load ratings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [serviceId, vendorId]);

  const handleDeleteRating = async (ratingId: number) => {
    try {
      const response = await fetch(`/api/ratings/${ratingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete rating");
      }

      toast({
        title: "Rating deleted",
        description: "Your rating has been removed",
      });

      fetchRatings(); // Refresh ratings
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast({
        title: "Error",
        description: "Failed to delete rating",
        variant: "destructive",
      });
    }
  };

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
      : 0;

  const ratingCounts = {
    5: ratings.filter((r) => r.rating === 5).length,
    4: ratings.filter((r) => r.rating === 4).length,
    3: ratings.filter((r) => r.rating === 3).length,
    2: ratings.filter((r) => r.rating === 2).length,
    1: ratings.filter((r) => r.rating === 1).length,
  };

  const userHasRated =
    session?.user &&
    ratings.some((rating) => rating.userId.toString() === session.user.id);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            {title || "Ratings & Reviews"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} readonly size="md" />
              <div className="text-sm text-muted-foreground mt-1">
                {ratings.length} review{ratings.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-2">{star}</span>
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width:
                          ratings.length > 0
                            ? `${(ratingCounts[star as keyof typeof ratingCounts] / ratings.length) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {ratingCounts[star as keyof typeof ratingCounts]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Rating Button */}
          {showAddRating && session?.user && !userHasRated && (
            <Dialog open={showRatingForm} onOpenChange={setShowRatingForm}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Your Review</DialogTitle>
                </DialogHeader>
                <RatingForm
                  serviceId={serviceId}
                  vendorId={vendorId}
                  onRatingSubmitted={() => {
                    setShowRatingForm(false);
                    fetchRatings();
                  }}
                  onCancel={() => setShowRatingForm(false)}
                />
              </DialogContent>
            </Dialog>
          )}

          {userHasRated && (
            <Badge variant="secondary" className="w-full justify-center">
              You have already rated this {serviceId ? "service" : "vendor"}
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      {ratings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reviews</h3>
          {ratings.map((rating) => (
            <Card key={rating.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <StarRating
                            rating={rating.rating}
                            readonly
                            size="sm"
                          />
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(rating.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {session?.user &&
                      rating.userId.toString() === session.user.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRating(rating.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                  </div>

                  {rating.review && (
                    <p className="text-sm text-muted-foreground">
                      {rating.review}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {ratings.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">
              Be the first to share your experience!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

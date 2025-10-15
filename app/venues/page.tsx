"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Filters, FilterState } from "@/components/filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, MapPin, Users, Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Venue {
  id: string;
  name: string;
  description: string;
  cost: number;
  serviceType: string;
  eventType: string;
  availability: boolean;
  metadata?: string;
  averageRating?: number;
  totalReviews?: number;
  vendorId: string;
}

export default function VenuesPage() {
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    type: "venue",
    location: "",
    category: "",
  });

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();

  // Fetch venues from API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.query) params.append("search", filters.query);

        const response = await fetch(`/api/venues?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data = await response.json();
        setVenues(data);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("Failed to load venues");
        toast.error("Failed to load venues");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [filters.category, filters.query]);

  // Frontend filtering for location (if needed)
  const filteredVenues = venues.filter((venue) => {
    const matchesLocation =
      !filters.location ||
      venue.metadata?.toLowerCase().includes(filters.location.toLowerCase());

    return matchesLocation;
  });

  const handleAddToCart = (venue: Venue) => {
    addItem({
      id: venue.id,
      name: venue.name,
      price: venue.cost,
      image: "/placeholder.svg", // Default image since backend might not have images
      type: "venue",
      quantity: 1,
    });
    toast.success("Added to cart!");
  };

  const handleToggleFavorite = (venue: Venue) => {
    if (!user) {
      toast.error("Please log in to add favorites");
      return;
    }

    if (isFavorite(venue.id)) {
      removeFromFavorites(venue.id);
      toast.success("Removed from favorites");
    } else {
      addToFavorites({
        id: venue.id,
        name: venue.name,
        price: venue.cost,
        image: "/placeholder.svg",
        type: "venue",
      });
      toast.success("Added to favorites!");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Venue</h1>
        <p className="text-lg text-muted-foreground">
          Discover unique venues for your special event
        </p>
      </div>

      {/* Filters */}
      <Filters onFilterChange={setFilters} className="mb-8" />

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue, index) => (
          <motion.div
            key={venue.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src="/placeholder.svg"
                  alt={venue.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${
                    isFavorite(venue.id) ? "text-red-500" : "text-gray-600"
                  }`}
                  onClick={() => handleToggleFavorite(venue)}
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite(venue.id) ? "fill-current" : ""}`}
                  />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {venue.eventType}
                  </span>
                </div>
                <Link href={`/services/${venue.id}`}>
                  <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                    {venue.name}
                  </h3>
                </Link>
                {venue.metadata && (
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {(() => {
                      try {
                        return (
                          JSON.parse(venue.metadata)?.location ||
                          "Location not specified"
                        );
                      } catch {
                        return venue.metadata || "Location not specified";
                      }
                    })()}
                  </div>
                )}
                <p className="text-sm text-muted-foreground mb-3">
                  {venue.description}
                </p>

                {/* Rating Display */}
                {venue.averageRating && (
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>{venue.averageRating.toFixed(1)}</span>
                    {venue.totalReviews && (
                      <span className="ml-1">
                        ({venue.totalReviews} reviews)
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">
                      ${venue.cost.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      / event
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(venue)}
                    className="flex items-center gap-2"
                    disabled={!venue.availability}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {venue.availability ? "Add to Cart" : "Unavailable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredVenues.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No venues found matching your criteria.
          </p>
        </div>
      )}
    </main>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { TransitionLink } from "@/components/transition-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, MapPin, Users, Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { getPriceDisplay } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/loading-spinner";
import { VenueCardSkeleton, GridSkeleton } from "@/components/ui/skeleton";

const venueCategories = [
  "wedding",
  "anniversary-engagement",
  "corporate",
  "college-fests",
  "house-private-party",
  "farewell",
  "baby-shower",
];

const locations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
];

interface Venue {
  id: string;
  name: string;
  description: string;
  serviceType: string;
  eventType: string;
  availability: boolean;
  metadata?: string;
  images?: string[];
  priceEnum?: string;
  averageRating?: number;
  totalReviews?: number;
  vendorId: string;
}

function VenuesContent() {
  const pathname = usePathname();
  const { replace } = useRouter();

  // Use the hook approach for client-side navigation - extract immediately
  const rawSearchParams = useSearchParams();
  const searchQuery = rawSearchParams?.get("search") || "";
  const categoryParam = rawSearchParams?.get("category") || "";
  const locationParam = rawSearchParams?.get("location") || "";
  // rawSearchParams goes out of scope after extraction

  const [venues, setVenues] = useState<Venue[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local state for search and filters
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();

  // Sync local state with URL params on mount/URL change
  useEffect(() => {
    setSearchInput(searchQuery);
    setCategoryFilter(categoryParam || "all");
    setLocationFilter(locationParam || "all");
    setPageLoading(false);
  }, [searchQuery, categoryParam, locationParam]);

  // Manual search function
  const handleManualSearch = () => {
    const params = new URLSearchParams();

    // Build new URL with search query + current filters
    if (searchInput) params.set("search", searchInput);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (locationFilter !== "all") params.set("location", locationFilter);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle search key press
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleManualSearch();
    }
  };

  // Handle filter changes
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (value !== "all") params.set("category", value);
    if (locationFilter !== "all") params.set("location", locationFilter);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (value !== "all") params.set("location", value);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchInput("");
    setCategoryFilter("all");
    setLocationFilter("all");
    replace(pathname, { scroll: false });
  };

  // Fetch venues when URL params change
  useEffect(() => {
    fetchVenues();
  }, [searchQuery, categoryParam, locationParam]);

  const fetchVenues = async () => {
    try {
      setDataLoading(true);
      setError(null);
      const params = new URLSearchParams();
      // Only send eventType if category is selected and not empty
      if (
        categoryParam &&
        categoryParam.trim() !== "" &&
        categoryParam !== "all"
      ) {
        params.append("eventType", categoryParam);
      }
      if (searchQuery) params.append("search", searchQuery);
      if (locationParam) params.append("location", locationParam);

      const url = `/api/venues?${params.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch venues (${response.status})`,
        );
      }

      const data = await response.json();
      setVenues(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load venues";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDataLoading(false);
      setPageLoading(false); // Mark page as loaded after first fetch
    }
  };

  const handleAddToCart = (venue: Venue) => {
    addItem({
      id: venue.id,
      name: venue.name,
      image: venue.images?.[0] || "/placeholder.svg",
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
        image: venue.images?.[0] || "/placeholder.svg",
        type: "venue",
      });
      toast.success("Added to favorites!");
    }
  };

  if (pageLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="mb-8">
          <div className="h-12 w-full max-w-md bg-muted animate-pulse rounded-md" />
        </div>
        <GridSkeleton count={6} CardComponent={VenueCardSkeleton} />
      </main>
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

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search venues..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleManualSearch}
                className="px-6"
                disabled={dataLoading}
              >
                {dataLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {venueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={handleLocationChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location.toLowerCase()}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchInput ||
              categoryFilter !== "all" ||
              locationFilter !== "all") && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearAllFilters}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      {dataLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <VenueCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={venue.images?.[0] || "/placeholder.svg"}
                    alt={venue.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ viewTransitionName: `venue-image-${venue.id}` }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
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
                  <TransitionLink href={`/services/${venue.id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                      {venue.name}
                    </h3>
                  </TransitionLink>
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
                        {venue.priceEnum
                          ? getPriceDisplay(venue.priceEnum)
                          : "Price on request"}
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
      )}

      {venues.length === 0 && !dataLoading && !pageLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No venues found matching your criteria.
          </p>
        </div>
      )}
    </main>
  );
}

export default VenuesContent;

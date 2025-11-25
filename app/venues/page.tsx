"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { TransitionLink } from "@/components/transition-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, MapPin, Users, Star, Search, X, Filter, Sparkles, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getPriceDisplay } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 py-20 border-b">
          <div className="container mx-auto px-4">
            <div className="h-12 w-64 bg-muted animate-pulse rounded-md mb-4" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded-md" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="h-12 w-full max-w-md bg-muted animate-pulse rounded-md mb-8" />
          <GridSkeleton count={6} CardComponent={VenueCardSkeleton} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-destructive font-medium mb-2">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-muted/30 py-24 border-b overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 text-sm">
                <Sparkles className="h-3.5 w-3.5 mr-2 inline-block" />
                Exclusive Venues
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display tracking-tight text-foreground">
                Find Your Perfect Venue
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Discover unique and breathtaking venues for your special event. From intimate gatherings to grand celebrations.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row gap-4 mb-6 p-2 bg-card rounded-xl border shadow-sm">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search venues..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="pl-10 h-12 border-none shadow-none focus-visible:ring-0 bg-transparent"
              />
            </div>

            <div className="h-px lg:h-12 w-full lg:w-px bg-border" />

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-0">
              <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 border-none shadow-none focus:ring-0 bg-transparent">
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

              <div className="hidden sm:block w-px h-12 bg-border" />

              <Select value={locationFilter} onValueChange={handleLocationChange}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 border-none shadow-none focus:ring-0 bg-transparent">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Location" />
                  </div>
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
            </div>

            <Button
              onClick={handleManualSearch}
              className="h-12 px-8 rounded-lg shadow-sm"
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

          {(searchInput || categoryFilter !== "all" || locationFilter !== "all") && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Venues Grid */}
        {dataLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <VenueCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue, index) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-none shadow-sm ring-1 ring-border/50 flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                    <img
                      src={venue.images?.[0] || "/placeholder.svg"}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ viewTransitionName: `venue-image-${venue.id}` }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute top-3 left-3 z-20">
                      <Badge className="bg-white/90 text-foreground backdrop-blur-sm shadow-sm border-none">
                        {venue.eventType}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-3 right-3 z-20 rounded-full backdrop-blur-sm transition-colors ${isFavorite(venue.id)
                          ? "bg-white text-red-500 hover:bg-white/90"
                          : "bg-black/20 text-white hover:bg-white hover:text-red-500"
                        }`}
                      onClick={() => handleToggleFavorite(venue)}
                    >
                      <Heart
                        className={`h-4 w-4 ${isFavorite(venue.id) ? "fill-current" : ""}`}
                      />
                    </Button>

                    <div className="absolute bottom-3 left-3 right-3 z-20 text-white">
                      <h3 className="font-bold text-xl leading-tight mb-1 drop-shadow-md line-clamp-1">
                        {venue.name}
                      </h3>
                      {venue.metadata && (
                        <div className="flex items-center text-xs text-white/90">
                          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span className="truncate">
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
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {venue.description}
                    </p>

                    {/* Rating Display */}
                    <div className="flex items-center justify-between mb-4">
                      {venue.averageRating ? (
                        <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-semibold text-yellow-700">{venue.averageRating.toFixed(1)}</span>
                          {venue.totalReviews && (
                            <span className="text-xs text-yellow-600/80">
                              ({venue.totalReviews})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No reviews yet</span>
                      )}

                      <Badge variant={venue.availability ? "outline" : "secondary"} className={venue.availability ? "text-green-600 border-green-200 bg-green-50" : ""}>
                        {venue.availability ? "Available" : "Booked"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t mt-auto">
                      <div>
                        <span className="text-lg font-bold text-primary">
                          {venue.priceEnum
                            ? getPriceDisplay(venue.priceEnum)
                            : "Price on request"}
                        </span>
                        {venue.priceEnum && <span className="text-xs text-muted-foreground ml-1">/ event</span>}
                      </div>

                      <div className="flex gap-2">
                        <TransitionLink href={`/services/${venue.id}`}>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </TransitionLink>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(venue)}
                          disabled={!venue.availability}
                          className="shadow-sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {venues.length === 0 && !dataLoading && !pageLoading && (
          <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No venues found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any venues matching your criteria. Try adjusting your filters.
              </p>
              <Button onClick={clearAllFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VenuesContent;


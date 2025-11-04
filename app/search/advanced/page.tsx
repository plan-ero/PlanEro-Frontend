"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  Users,
  Filter,
  X,
  ChevronDown,
  Sliders,
  Clock,
} from "lucide-react";
import { SearchResultSkeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdvancedFilters {
  query: string;
  category: string;
  location: string;
  priceRange: [number, number];
  rating: number;
  availability: string;
  capacity: [number, number];
  amenities: string[];
  sortBy: string;
  searchType: "all" | "venues" | "services" | "vendors";
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "wedding", label: "Weddings" },
  { value: "corporate", label: "Corporate Events" },
  { value: "birthday", label: "Birthday Parties" },
  { value: "conference", label: "Conferences" },
  { value: "exhibition", label: "Exhibitions" },
  { value: "social", label: "Social Events" },
];

const locations = [
  { value: "all", label: "All Locations" },
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "bangalore", label: "Bangalore" },
  { value: "pune", label: "Pune" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "chennai", label: "Chennai" },
];

const amenities = [
  "WiFi",
  "Parking",
  "AC",
  "Audio/Visual",
  "Catering",
  "Photography",
  "Security",
  "Decoration",
  "Live Streaming",
  "Stage",
  "Dance Floor",
  "Bar",
];

const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "distance", label: "Nearest First" },
  { value: "popularity", label: "Most Popular" },
];

export default function AdvancedSearchPage() {
  const [filters, setFilters] = useState<AdvancedFilters>({
    query: "",
    category: "all",
    location: "all",
    priceRange: [0, 100000],
    rating: 0,
    availability: "all",
    capacity: [10, 1000],
    amenities: [],
    sortBy: "relevance",
    searchType: "all",
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key: keyof AdvancedFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      query: "",
      category: "all",
      location: "all",
      priceRange: [0, 100000],
      rating: 0,
      availability: "all",
      capacity: [10, 1000],
      amenities: [],
      sortBy: "relevance",
      searchType: "all",
    });
    setActiveFilters([]);
  };

  // Remove URL updating to prevent page reloads and focus loss
  // The search will work purely with client-side state

  // Manual search function - only triggered by Enter key or Search button
  const performSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.query) params.append("query", filters.query);
      if (filters.searchType !== "all")
        params.append("type", filters.searchType);
      if (filters.location !== "all")
        params.append("location", filters.location);
      if (filters.category !== "all")
        params.append("category", filters.category);
      if (filters.sortBy !== "relevance")
        params.append("sortBy", filters.sortBy);

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        console.error("Search API error:", response.status);
        setResults([]);
        return;
      }

      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    performSearch();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== "all") count++;
    if (filters.location !== "all") count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count++;
    if (filters.rating > 0) count++;
    if (filters.availability !== "all") count++;
    if (filters.amenities.length > 0) count++;
    return count;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Advanced Search
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you're looking for with our comprehensive search
              filters
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-6xl mx-auto"
          >
            {/* Main Search Bar */}
            <Card className="mb-8 shadow-lg border-0 bg-background/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <Label
                      htmlFor="search-query"
                      className="text-sm font-medium mb-2 block"
                    >
                      What are you looking for?
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="search-query"
                        type="search"
                        placeholder="Enter keywords, venue names, or services..."
                        value={filters.query}
                        onChange={(e) =>
                          handleFilterChange("query", e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            performSearch();
                          }
                        }}
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="h-12 px-6"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                    <Button
                      onClick={handleSearch}
                      className="h-12 px-8 bg-primary hover:bg-primary/90"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Type Tabs */}
            <Tabs
              value={filters.searchType}
              onValueChange={(value) =>
                handleFilterChange("searchType", value as any)
              }
              className="mb-8"
            >
              <TabsList className="grid w-full grid-cols-4 lg:w-96 mx-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="venues">Venues</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Basic Filters */}
              <Card className="shadow-lg border-0 bg-background/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Filter className="h-5 w-5 mr-2 text-blue-600" />
                    Basic Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Category
                    </Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) =>
                        handleFilterChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value || "All Categories"}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Location
                    </Label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) =>
                        handleFilterChange("location", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem
                            key={location.value}
                            value={location.value || "All Locations"}
                          >
                            {location.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Sort By
                    </Label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) =>
                        handleFilterChange("sortBy", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value || "Most Relevant"}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Price & Rating */}
              <Card className="shadow-lg border-0 bg-background/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Price & Rating
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Price Range: ₹{filters.priceRange[0].toLocaleString()} - ₹
                      {filters.priceRange[1].toLocaleString()}
                    </Label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) =>
                        handleFilterChange("priceRange", value)
                      }
                      max={100000}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Minimum Rating:{" "}
                      {filters.rating > 0
                        ? `${filters.rating}+ stars`
                        : "Any rating"}
                    </Label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={
                            filters.rating >= rating ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleFilterChange(
                              "rating",
                              rating === filters.rating ? 0 : rating,
                            )
                          }
                          className="p-2"
                        >
                          <Star
                            className={`h-4 w-4 ${filters.rating >= rating ? "fill-current" : ""}`}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Capacity Range */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Capacity: {filters.capacity[0]} - {filters.capacity[1]}{" "}
                      people
                    </Label>
                    <Slider
                      value={filters.capacity}
                      onValueChange={(value) =>
                        handleFilterChange("capacity", value)
                      }
                      max={1000}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Amenities & Availability */}
              <Card className="shadow-lg border-0 bg-background/70 backdrop-blur-sm lg:col-span-2 xl:col-span-1">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Sliders className="h-5 w-5 mr-2 text-purple-600" />
                    Amenities & More
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Availability */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Availability
                    </Label>
                    <Select
                      value={filters.availability}
                      onValueChange={(value) =>
                        handleFilterChange("availability", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Default" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any time</SelectItem>
                        <SelectItem value="today">Available today</SelectItem>
                        <SelectItem value="week">This week</SelectItem>
                        <SelectItem value="month">This month</SelectItem>
                        <SelectItem value="custom">
                          Custom date range
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amenities */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Amenities ({filters.amenities.length} selected)
                    </Label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={amenity}
                            checked={filters.amenities.includes(amenity)}
                            onCheckedChange={(checked) =>
                              handleAmenityChange(amenity, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={amenity}
                            className="text-sm cursor-pointer"
                          >
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-8"
              >
                <Card className="shadow-lg border-0 bg-muted/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm text-foreground">
                        Active Filters ({getActiveFiltersCount()})
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.category !== "all" && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          Category:{" "}
                          {
                            categories.find((c) => c.value === filters.category)
                              ?.label
                          }
                        </Badge>
                      )}
                      {filters.location !== "all" && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          Location:{" "}
                          {
                            locations.find((l) => l.value === filters.location)
                              ?.label
                          }
                        </Badge>
                      )}
                      {(filters.priceRange[0] > 0 ||
                        filters.priceRange[1] < 100000) && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          Price: ₹{filters.priceRange[0].toLocaleString()} - ₹
                          {filters.priceRange[1].toLocaleString()}
                        </Badge>
                      )}
                      {filters.rating > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          Rating: {filters.rating}+ stars
                        </Badge>
                      )}
                      {filters.amenities.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          Amenities: {filters.amenities.length} selected
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Search Results */}
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 space-y-4"
              >
                <h2 className="text-2xl font-bold mb-6">Searching...</h2>
                {[1, 2, 3].map((i) => (
                  <SearchResultSkeleton key={i} />
                ))}
              </motion.div>
            ) : results.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold mb-6">
                  Found {results.length} result{results.length !== 1 ? "s" : ""}
                </h2>
                <div className="grid gap-6">
                  {results.map((result) => {
                    const href =
                      result.type === "vendor"
                        ? `/vendors/${result.id}`
                        : `/services/${result.id}`;

                    return (
                      <Link key={result.id} href={href}>
                        <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              {/* Image */}
                              {result.image && (
                                <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={result.image}
                                    alt={result.name}
                                    className="w-full h-full object-cover"
                                    style={{
                                      viewTransitionName: `result-image-${result.id}`,
                                    }}
                                  />
                                </div>
                              )}

                              {/* Content */}
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h3 className="text-xl font-bold mb-1">
                                      {result.name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                      {result.category && (
                                        <Badge variant="secondary">
                                          {result.category}
                                        </Badge>
                                      )}
                                      {result.type && (
                                        <Badge
                                          variant="outline"
                                          className="capitalize"
                                        >
                                          {result.type}
                                        </Badge>
                                      )}
                                      {result.location && (
                                        <span className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          {result.location}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Price */}
                                  {result.price && (
                                    <div className="text-right">
                                      <div className="text-2xl font-bold text-primary">
                                        ₹{result.price.toLocaleString()}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {result.type === "vendor"
                                          ? "per event"
                                          : "onwards"}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Description */}
                                {result.description && (
                                  <p className="text-muted-foreground line-clamp-2">
                                    {result.description}
                                  </p>
                                )}

                                {/* Rating and other info */}
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                  {result.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="font-semibold">
                                        {result.rating}
                                      </span>
                                      {result.reviews && (
                                        <span className="text-muted-foreground">
                                          ({result.reviews} reviews)
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {result.capacity && (
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      <span>{result.capacity} guests</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            ) : filters.query ||
              filters.category !== "all" ||
              filters.location !== "all" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center py-12"
              >
                <div className="text-muted-foreground text-lg">
                  No results found. Try adjusting your filters.
                </div>
              </motion.div>
            ) : null}

            {/* Quick Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={handleSearch}
                  className="px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-200"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search with Filters
                </Button>

                <Link href="/search">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold border-2 hover:bg-primary hover:text-background transition-all duration-200"
                  >
                    Basic Search
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

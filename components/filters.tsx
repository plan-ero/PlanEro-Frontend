"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  onSearch?: (query: string) => void; // New prop for manual search
  className?: string;
}

export interface FilterState {
  query: string;
  type: "venue" | "vendor" | "all";
  location: string;
  category: string;
}

const venueCategories = [
  "wedding",
  "anniversary-engagement",
  "corporate",
  "college-fests",
  "house-private-party",
  "farewell",
  "reunion",
  "baby-shower",
];

const vendorCategories = [
  "venues",
  "magician",
  "dj",
  "wedding-bands",
  "singer",
  "anchor",
  "photographer",
  "decorator",
  "transportation",
  "caterers",
  "florists",
  "bakers",
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

export function Filters({ onFilterChange, onSearch, className }: FiltersProps) {
  // Separate search input state from filters
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    type: "all",
    location: "all_locations",
    category: "all_categories",
  });

  // Manual search function
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchInput);
    } else {
      // Fallback to old behavior if onSearch not provided
      handleFilterChange("query", searchInput);
    }
  };

  // Handle Enter key in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };

    // Reset category when type changes
    if (key === "type") {
      newFilters.category = "all_categories";
    }

    setFilters(newFilters);

    // Convert special values back to empty strings for API calls
    const apiFilters: FilterState = {
      ...newFilters,
      location:
        newFilters.location === "all_locations" ? "" : newFilters.location,
      category:
        newFilters.category === "all_categories" ? "" : newFilters.category,
    };

    onFilterChange?.(apiFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      query: "",
      type: "all",
      location: "all_locations",
      category: "all_categories",
    };
    setFilters(clearedFilters);

    const apiFilters: FilterState = {
      query: "",
      type: "all" as const,
      location: "",
      category: "",
    };
    onFilterChange?.(apiFilters);
  };

  const getCategoriesForType = () => {
    switch (filters.type) {
      case "venue":
        return venueCategories;
      case "vendor":
        return vendorCategories;
      default:
        return [...venueCategories, ...vendorCategories];
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Query */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search venues, vendors, or services..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="px-6">
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <Select
              value={filters.type}
              onValueChange={(value) =>
                handleFilterChange("type", value as "venue" | "vendor" | "all")
              }
            >
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="venue">Venues</SelectItem>
                <SelectItem value="vendor">Vendors</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select
              value={filters.location}
              onValueChange={(value) => handleFilterChange("location", value)}
            >
              <SelectTrigger>
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_locations">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem
                    key={location}
                    value={location.toLowerCase() || "all"}
                  >
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_categories">All Categories</SelectItem>
                {getCategoriesForType().map((category) => (
                  <SelectItem key={category} value={category || "all"}>
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
          </div>

          {/* Clear Filters */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {(filters.query !== "" ||
                filters.type !== "all" ||
                filters.location !== "all_locations" ||
                filters.category !== "all_categories") && (
                <span>Filters applied</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              disabled={
                filters.query === "" &&
                filters.type === "all" &&
                filters.location === "all_locations" &&
                filters.category === "all_categories"
              }
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

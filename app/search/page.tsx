"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Filters } from "@/components/filters";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MapPin,
  Star,
  Users,
  Grid3X3,
  List,
  Search,
  SlidersHorizontal,
  Zap,
  Award,
  Clock,
  Phone,
  Globe,
  ArrowRight,
  Filter as FilterIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchResultSkeleton, GridSkeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { getPriceDisplay } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SearchContent() {
  const pathname = usePathname();
  const { replace } = useRouter();

  // Extract URL params IMMEDIATELY and discard searchParams reference
  const rawSearchParams = useSearchParams();
  const searchQuery =
    rawSearchParams?.get("q") || rawSearchParams?.get("search") || "";
  const typeParam =
    (rawSearchParams?.get("type") as "venue" | "vendor" | "all") || "all";
  const locationParam = rawSearchParams?.get("location") || "";
  const categoryParam = rawSearchParams?.get("category") || "";
  const sortParam = rawSearchParams?.get("sort") || "relevance";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Local state for filters
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState<"venue" | "vendor" | "all">(
    "all",
  );
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  // Sync local state with URL params on mount/URL change
  useEffect(() => {
    setSearchInput(searchQuery);
    setTypeFilter(typeParam);
    setLocationFilter(locationParam);
    setCategoryFilter(categoryParam);
    setSortBy(sortParam);
  }, [searchQuery, typeParam, locationParam, categoryParam, sortParam]);

  // Manual search function
  const handleManualSearch = () => {
    const params = new URLSearchParams();

    // Rebuild params: new searchInput + current URL params for filters
    if (searchInput) params.set("q", searchInput);
    if (typeParam && typeParam !== "all") params.set("type", typeParam);
    if (locationParam) params.set("location", locationParam);
    if (categoryParam) params.set("category", categoryParam);
    if (sortParam && sortParam !== "relevance") params.set("sort", sortParam);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle Enter key in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleManualSearch();
    }
  };

  // Direct URL update for filters (no debounce needed)
  const handleTypeChange = (type: "venue" | "vendor" | "all") => {
    setTypeFilter(type);
    const params = new URLSearchParams();

    // Rebuild params from current state
    if (searchInput) params.set("q", searchInput);
    if (type && type !== "all") params.set("type", type);
    if (locationFilter) params.set("location", locationFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (sortBy && sortBy !== "relevance") params.set("sort", sortBy);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLocationChange = (location: string) => {
    setLocationFilter(location);
    const params = new URLSearchParams();

    // Rebuild params from current state
    if (searchInput) params.set("q", searchInput);
    if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
    if (location) params.set("location", location);
    if (categoryFilter) params.set("category", categoryFilter);
    if (sortBy && sortBy !== "relevance") params.set("sort", sortBy);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    const params = new URLSearchParams();

    // Rebuild params from current state
    if (searchInput) params.set("q", searchInput);
    if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
    if (locationFilter) params.set("location", locationFilter);
    if (category) params.set("category", category);
    if (sortBy && sortBy !== "relevance") params.set("sort", sortBy);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    const params = new URLSearchParams();

    // Rebuild params from current state
    if (searchInput) params.set("q", searchInput);
    if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
    if (locationFilter) params.set("location", locationFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (sort && sort !== "relevance") params.set("sort", sort);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Fetch search results when URL params change
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append("query", searchQuery);
        if (typeParam && typeParam !== "all") params.append("type", typeParam);
        if (locationParam) params.append("location", locationParam);
        if (categoryParam) params.append("category", categoryParam);
        if (sortParam && sortParam !== "relevance")
          params.append("sortBy", sortParam);

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

    fetchResults();
  }, [searchQuery, typeParam, locationParam, categoryParam, sortParam]);

  const ResultCard = ({ item, index }: { item: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full border-none shadow-sm ring-1 ring-border/50">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
          <img
            src={item.image}
            alt={item.name}
            className={`w-full ${viewMode === "grid" ? "h-56" : "h-40"} object-cover group-hover:scale-105 transition-transform duration-500`}
          />
          <div className="absolute top-3 left-3 flex gap-2 z-20">
            <Badge
              variant={item.type === "venue" ? "default" : "secondary"}
              className="bg-white/90 text-foreground backdrop-blur-sm shadow-sm"
            >
              {item.type === "venue" ? "Venue" : "Vendor"}
            </Badge>
            {item.verified && (
              <Badge className="bg-green-500/90 text-white backdrop-blur-sm shadow-sm border-none">
                <Award className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm z-20 rounded-full"
          >
            <Heart className="h-4 w-4" />
          </Button>

          {item.availability === "Available" && (
            <div className="absolute bottom-3 right-3 z-20">
              <Badge className="bg-green-500/90 text-white border-none backdrop-blur-sm">
                <Zap className="h-3 w-3 mr-1" />
                Available
              </Badge>
            </div>
          )}
        </div>

        <CardContent className={`p-${viewMode === "grid" ? "5" : "6"}`}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                {item.category
                  .split("-")
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1),
                  )
                  .join(" ")}
              </span>
            </div>
            <div className="flex items-center text-sm bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
              <Star className="h-3.5 w-3.5 text-yellow-500 mr-1 fill-yellow-500" />
              <span className="font-semibold text-yellow-700">{item.rating}</span>
              <span className="text-yellow-600/70 ml-1 text-xs">
                ({item.reviews})
              </span>
            </div>
          </div>

          <Link
            href={`/${item.type === "venue" ? "venues" : "services"}/${item.id}`}
          >
            <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1 font-display">
              {item.name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="space-y-2.5 mb-5">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2.5 flex-shrink-0 text-primary/70" />
              <span className="line-clamp-1">{item.location}</span>
            </div>

            {item.type === "venue" && item.capacity && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2.5 flex-shrink-0 text-primary/70" />
                <span>Up to {item.capacity} guests</span>
              </div>
            )}

            {item.responseTime && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2.5 flex-shrink-0 text-primary/70" />
                <span>Responds {item.responseTime}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {item.tags
                .slice(0, viewMode === "grid" ? 2 : 4)
                .map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-muted/50 hover:bg-muted font-normal text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
              {item.tags.length > (viewMode === "grid" ? 2 : 4) && (
                <Badge variant="secondary" className="text-xs bg-muted/50 hover:bg-muted font-normal text-muted-foreground">
                  +{item.tags.length - (viewMode === "grid" ? 2 : 4)} more
                </Badge>
              )}
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-foreground">
                {getPriceDisplay(item.priceEnum)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="rounded-full px-4 shadow-sm group-hover:shadow-md transition-all">
                {item.type === "venue" ? "View Venue" : "View Service"}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="flex gap-4 mb-8">
          <div className="h-12 flex-1 bg-muted animate-pulse rounded-md" />
          <div className="h-12 w-32 bg-muted animate-pulse rounded-md" />
          <div className="h-12 w-24 bg-muted animate-pulse rounded-md" />
        </div>
        <GridSkeleton
          count={9}
          CardComponent={() => <SearchResultSkeleton viewMode="grid" />}
        />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 font-display tracking-tight">Search Results</h1>
            <p className="text-lg text-muted-foreground">
              Found <span className="font-semibold text-foreground">{results.length}</span> results
              {searchQuery && <> for "<span className="font-semibold text-foreground">{searchQuery}</span>"</>}
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-md w-full">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Refine your search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-10 h-11 shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
              />
            </div>
            <Button onClick={handleManualSearch} className="px-6 h-11 shadow-sm">
              Search
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filter Toggle */}
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 h-9"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(typeFilter !== "all" || locationFilter || categoryFilter) && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] h-5 min-w-5 flex items-center justify-center bg-primary/20 text-primary">
                  !
                </Badge>
              )}
            </Button>

            <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] h-9 border-muted-foreground/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Sort by Relevance</SelectItem>
                <SelectItem value="rating">Rating: High to Low</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0 rounded-md shadow-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0 rounded-md shadow-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <AnimatePresence mode="wait">
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 320 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-shrink-0 overflow-hidden hidden lg:block"
            >
              <div className="sticky top-24 pb-4">
                <Filters
                  onFilterChange={(newFilters) => {
                    if (newFilters.type) handleTypeChange(newFilters.type);
                    if (newFilters.location !== undefined)
                      handleLocationChange(newFilters.location);
                    if (newFilters.category !== undefined)
                      handleCategoryChange(newFilters.category);
                  }}
                  className="shadow-sm border rounded-xl bg-card"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Filters Drawer (could be added here or handled via the existing Filters component if it supports mobile) */}
        {/* For now, we'll just show the filters on mobile without animation or use a different approach if needed. 
            But the previous code had it hidden on mobile via CSS classes in the Filters component or parent. 
            Let's ensure it works for both. 
        */}
        {showFilters && (
          <div className="lg:hidden w-full mb-6">
            <Filters
              onFilterChange={(newFilters) => {
                if (newFilters.type) handleTypeChange(newFilters.type);
                if (newFilters.location !== undefined)
                  handleLocationChange(newFilters.location);
                if (newFilters.category !== undefined)
                  handleCategoryChange(newFilters.category);
              }}
              className="shadow-sm border rounded-xl bg-card"
            />
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-muted/30 rounded-xl border border-dashed"
            >
              <div className="max-w-md mx-auto px-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-display">No results found</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  We couldn't find any matches for your search. Try adjusting your filters or search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="shadow-md">
                    <Link href="/venues">
                      <Globe className="h-4 w-4 mr-2" />
                      Browse Venues
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg" className="bg-background">
                    <Link href="/services">
                      <Users className="h-4 w-4 mr-2" />
                      Browse Services
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div
              className={`grid gap-6 ${viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1"
                }`}
            >
              {results.map((item, index) => (
                <ResultCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default SearchContent;


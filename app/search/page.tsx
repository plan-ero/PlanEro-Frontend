"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Filters, FilterState } from "@/components/filters";
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
  Filter,
  Grid3X3,
  List,
  Search,
  SlidersHorizontal,
  Zap,
  Award,
  Clock,
  Phone,
  Globe,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Enhanced mock search results with more detailed data
const mockResults = [
  {
    id: "1",
    type: "venue",
    name: "Elegant Garden Venue",
    category: "wedding",
    location: "Beverly Hills, CA",
    price: 5000,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    description:
      "Beautiful outdoor garden venue perfect for intimate weddings with stunning landscaping and romantic ambiance",
    rating: 4.8,
    capacity: 150,
    reviews: 89,
    verified: true,
    responseTime: "within 1 hour",
    availability: "Available",
    tags: ["Outdoor", "Garden", "Parking Available", "Catering Kitchen"],
  },
  {
    id: "2",
    type: "vendor",
    name: "Elite Wedding Photography",
    category: "photographer",
    location: "Los Angeles, CA",
    price: 2500,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    description:
      "Award-winning wedding photography with artistic flair and 10+ years of experience",
    rating: 4.9,
    reviews: 156,
    verified: true,
    responseTime: "within 2 hours",
    availability: "Available",
    tags: [
      "Award Winning",
      "Drone Photography",
      "Same Day Editing",
      "Destination Weddings",
    ],
  },
  {
    id: "3",
    type: "venue",
    name: "Modern Corporate Center",
    category: "corporate",
    location: "San Francisco, CA",
    price: 3000,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    description:
      "State-of-the-art conference facilities with cutting-edge technology and professional service",
    rating: 4.7,
    capacity: 200,
    reviews: 67,
    verified: true,
    responseTime: "within 30 minutes",
    availability: "Available",
    tags: ["A/V Equipment", "High-Speed WiFi", "Catering Service", "Parking"],
  },
  {
    id: "4",
    type: "vendor",
    name: "Gourmet Catering Co",
    category: "caterers",
    location: "San Diego, CA",
    price: 75,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    description:
      "Premium catering service specializing in farm-to-table cuisine and custom menus",
    rating: 4.6,
    reviews: 203,
    verified: true,
    responseTime: "within 4 hours",
    availability: "Available",
    tags: [
      "Farm-to-Table",
      "Custom Menus",
      "Dietary Restrictions",
      "Organic Options",
    ],
  },
  {
    id: "5",
    type: "venue",
    name: "Historic Mansion",
    category: "anniversary-engagement",
    location: "Napa Valley, CA",
    price: 8000,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    description:
      "Stunning 19th-century mansion with vineyard views, perfect for romantic celebrations",
    rating: 4.9,
    capacity: 120,
    reviews: 94,
    verified: true,
    responseTime: "within 1 hour",
    availability: "Available",
    tags: ["Historic", "Vineyard Views", "Wine Cellar", "Bridal Suite"],
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    query: searchParams.get("q") || "",
    type: "all",
    location: "",
    category: "",
  });
  const [results, setResults] = useState(mockResults);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Filter results based on current filters
    const filtered = mockResults.filter((item) => {
      const matchesQuery =
        !filters.query ||
        item.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(filters.query.toLowerCase()),
        );

      const matchesType = filters.type === "all" || item.type === filters.type;

      const matchesCategory =
        !filters.category ||
        item.category.toLowerCase().includes(filters.category.toLowerCase());

      const matchesLocation =
        !filters.location ||
        item.location.toLowerCase().includes(filters.location.toLowerCase());

      return matchesQuery && matchesType && matchesCategory && matchesLocation;
    });

    // Sort results
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
        default:
          return 0; // relevance - keep original order
      }
    });

    setResults(sorted);
  }, [filters, sortBy]);

  const ResultCard = ({
    item,
    index,
  }: {
    item: (typeof mockResults)[0];
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full ${viewMode === "grid" ? "h-48" : "h-32"} object-cover group-hover:scale-105 transition-transform duration-300`}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge
              variant={item.type === "venue" ? "default" : "secondary"}
              className="bg-white/90 text-gray-800"
            >
              {item.type === "venue" ? "Venue" : "Vendor"}
            </Badge>
            {item.verified && (
              <Badge className="bg-green-500 text-white">
                <Award className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
          </Button>
          {item.availability === "Available" && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-green-100 text-green-800 border border-green-300">
                <Zap className="h-3 w-3 mr-1" />
                Available
              </Badge>
            </div>
          )}
        </div>

        <CardContent className={`p-${viewMode === "grid" ? "4" : "6"}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                {item.category
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="font-semibold">{item.rating}</span>
              <span className="text-muted-foreground ml-1">
                ({item.reviews})
              </span>
            </div>
          </div>

          <Link
            href={`/${item.type === "venue" ? "venues" : "services"}/${item.id}`}
          >
            <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors line-clamp-1">
              {item.name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{item.location}</span>
            </div>

            {item.type === "venue" && item.capacity && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Up to {item.capacity} guests</span>
              </div>
            )}

            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Responds {item.responseTime}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, viewMode === "grid" ? 2 : 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > (viewMode === "grid" ? 2 : 4) && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - (viewMode === "grid" ? 2 : 4)} more
              </Badge>
            )}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-primary">
                ₹{item.price.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                {item.type === "venue"
                  ? "/event"
                  : item.category === "caterers"
                    ? "/person"
                    : "/service"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-1" />
                Contact
              </Button>
              <Button size="sm">
                {item.type === "venue" ? "Book Now" : "Hire Now"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Search Results</h1>
            <p className="text-lg text-muted-foreground">
              {results.length} results found
              {filters.query && ` for "${filters.query}"`}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Refine your search..."
              value={filters.query}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, query: e.target.value }))
              }
              className="pl-10"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(filters.type !== "all" ||
                filters.location ||
                filters.category) && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                  !
                </Badge>
              )}
            </Button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              className="w-80 flex-shrink-0"
            >
              <div className="sticky top-4">
                <Filters onFilterChange={setFilters} className="shadow-lg" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="flex-1">
          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-lg shadow-sm"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or browse our categories
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/venues">
                      <Globe className="h-4 w-4 mr-2" />
                      Browse Venues
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
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
              className={`grid gap-6 ${
                viewMode === "grid"
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

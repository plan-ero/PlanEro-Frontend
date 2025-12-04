"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { StarRating } from "@/components/ui/star-rating";
import { VendorCardSkeleton, GridSkeleton } from "@/components/ui/skeleton";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { VendorsSEO } from "@/components/seo/vendors-seo";
import { MapPin, Phone, Search, Filter, Mail, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { TransitionLink } from "@/components/transition-link";

interface Vendor {
  id: number;
  businessName: string;
  location: string;
  bio: string;
  websiteUrl: string[];
  profilePictureUrl: string;
  email: string;
  phoneNumber: string;
  addressId: number;
  approved: boolean;
  published: boolean;
  totalRating?: number;
  numberOfRatings?: number;
}

interface VendorsResponse {
  vendors: Vendor[];
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

function VendorsContent() {
  const pathname = usePathname();
  const { replace } = useRouter();

  // Extract URL params IMMEDIATELY and discard searchParams reference
  const rawSearchParams = useSearchParams();
  const searchQuery = rawSearchParams?.get("search") || "";
  const locationParam = rawSearchParams?.get("location") || "all";
  const categoryParam = rawSearchParams?.get("category") || "all";
  const pageParam = Number(rawSearchParams?.get("page")) || 1;

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local state for filters
  const [searchInput, setSearchInput] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVendors, setTotalVendors] = useState(0);

  const pageSize = 12;

  // Sync local state with URL params on mount/URL change
  useEffect(() => {
    setSearchInput(searchQuery);
    setLocationFilter(locationParam);
    setCategoryFilter(categoryParam);
    setCurrentPage(pageParam);
  }, [searchQuery, locationParam, categoryParam, pageParam]);

  // Manual search function
  const handleManualSearch = () => {
    const params = new URLSearchParams();

    // Rebuild params: new searchInput + current URL params for filters
    if (searchInput) params.set("search", searchInput);
    if (locationParam && locationParam !== "all")
      params.set("location", locationParam);
    if (categoryParam && categoryParam !== "all")
      params.set("category", categoryParam);
    // Reset to page 1 when search changes

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
  const handleLocationChange = (location: string) => {
    setLocationFilter(location);
    const params = new URLSearchParams();

    // Rebuild params from current state
    if (searchInput) params.set("search", searchInput);
    if (location && location !== "all") params.set("location", location);
    if (categoryFilter && categoryFilter !== "all")
      params.set("category", categoryFilter);
    // Reset to page 1 when filter changes

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    const params = new URLSearchParams();

    // Rebuild params from current state
    if (searchInput) params.set("search", searchInput);
    if (locationFilter && locationFilter !== "all")
      params.set("location", locationFilter);
    if (category && category !== "all") params.set("category", category);
    // Reset to page 1 when filter changes

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams();

    // Rebuild params from current state
    if (searchInput) params.set("search", searchInput);
    if (locationFilter && locationFilter !== "all")
      params.set("location", locationFilter);
    if (categoryFilter && categoryFilter !== "all")
      params.set("category", categoryFilter);
    if (page > 1) params.set("page", page.toString());

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Fetch vendors when URL params change
  useEffect(() => {
    fetchVendors();
  }, [searchQuery, locationParam, categoryParam, pageParam]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        pgNo: pageParam.toString(),
        pgSize: pageSize.toString(),
      });

      if (searchQuery && searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      if (locationParam && locationParam !== "all") {
        params.append("location", locationParam);
      }

      const response = await fetch(`/api/vendors?${params.toString()}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch vendors: ${response.status} ${response.statusText}`,
        );
      }

      const data: VendorsResponse = await response.json();
      const vendorsArray = Array.isArray(data.vendors) ? data.vendors : [];
      setVendors(vendorsArray);
      setTotalPages(data.pagination?.pages || 1);
      setTotalVendors(data.pagination?.total || 0);
    } catch (err) {
      console.error("Frontend: Error fetching vendors:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setVendors([]);
      setTotalPages(1);
      setTotalVendors(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleManualSearch();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading && vendors.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 py-20 border-b">
          <div className="container mx-auto px-4">
            <div className="h-12 w-64 bg-muted animate-pulse rounded-md mb-4" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded-md" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-4 mb-8 flex-wrap">
            <div className="h-12 flex-1 bg-muted animate-pulse rounded-md" />
            <div className="h-12 w-48 bg-muted animate-pulse rounded-md" />
            <div className="h-12 w-48 bg-muted animate-pulse rounded-md" />
          </div>
          <GridSkeleton count={9} CardComponent={VendorCardSkeleton} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <VendorsSEO
        vendors={vendors.slice(0, 10).map((v) => ({
          businessName: v.businessName,
          location: v.location,
          bio: v.bio,
          phoneNumber: v.phoneNumber,
          email: v.email,
        }))}
        totalCount={totalVendors}
      />
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
                Premium Vendors
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display tracking-tight text-foreground">
                Discover Amazing Vendors
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Find the perfect professionals for your special events. From
                photographers to caterers, connect with the best in the industry.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 mb-6 p-2 bg-card rounded-xl border shadow-sm">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search vendors by name, service, or specialty..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 h-12 border-none shadow-none focus-visible:ring-0 bg-transparent"
                />
              </div>
            </form>

            <div className="h-px md:h-12 w-full md:w-px bg-border" />

            <Select value={locationFilter} onValueChange={handleLocationChange}>
              <SelectTrigger className="w-full md:w-48 h-12 border-none shadow-none focus:ring-0 bg-transparent">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
                <SelectItem value="Houston">Houston</SelectItem>
                <SelectItem value="Phoenix">Phoenix</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" onClick={handleSearch} className="h-12 px-8 rounded-lg shadow-sm">
              Search
            </Button>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between px-2">
            <p className="text-muted-foreground font-medium">
              {totalVendors > 0
                ? `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalVendors)} of ${totalVendors} vendors`
                : "No vendors found"}
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-destructive font-medium mb-2">
                Error loading vendors
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={fetchVendors} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Vendors Grid */}
        {!error && (
          <>
            {vendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {vendors.map((vendor, index) => (
                  <motion.div
                    key={vendor?.id || Math.random()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-none shadow-sm ring-1 ring-border/50 flex flex-col">
                      {/* Full-width Image at top */}
                      <div className="relative w-full h-48 bg-muted overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                        <Avatar className="w-full h-full rounded-none">
                          <AvatarImage
                            src={
                              vendor?.profilePictureUrl || "/placeholder-user.jpg"
                            }
                            alt={
                              vendor?.businessName || vendor?.email || "Vendor"
                            }
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            style={{
                              viewTransitionName: `vendor-avatar-${vendor?.id}`,
                            }}
                          />
                          <AvatarFallback className="text-4xl rounded-none w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                            {getInitials(
                              vendor?.businessName ||
                              vendor?.email ||
                              "Unknown Vendor",
                            )}
                          </AvatarFallback>
                        </Avatar>

                        {/* Status Badge */}
                        {vendor?.approved && vendor?.published && (
                          <Badge className="absolute top-3 right-3 bg-primary/80 text-foreground backdrop-blur-sm shadow-sm z-20 border-none">
                            Verified
                          </Badge>
                        )}

                        <div className="absolute bottom-3 left-3 z-20 text-white">
                          <h3 className="font-bold text-lg leading-tight mb-1 drop-shadow-md">
                            {vendor?.businessName || vendor?.email || "Unnamed Vendor"}
                          </h3>
                          <div className="flex items-center text-xs text-white/90">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate max-w-[180px]">
                              {vendor?.location || "Location not specified"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-5 flex-1 flex flex-col">
                        {vendor?.bio && vendor.bio.trim() && (
                          <div className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                            {vendor.bio}
                          </div>
                        )}

                        {/* Rating */}
                        <div className="flex items-center justify-between mb-4">
                          {vendor?.totalRating !== undefined &&
                            vendor?.numberOfRatings !== undefined ? (
                            <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                              <StarRating
                                rating={vendor.totalRating || 0}
                                readonly
                                size="sm"
                              />
                              <span className="text-xs font-medium text-yellow-700">
                                ({vendor.numberOfRatings})
                              </span>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground italic">
                              No reviews yet
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto pt-2 border-t">
                          <InquiryDialog
                            serviceId={vendor?.id?.toString() || ""}
                            serviceName={vendor?.businessName || "Vendor"}
                            serviceType="VENDOR"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Mail className="h-3.5 w-3.5 mr-1.5" />
                              Inquire
                            </Button>
                          </InquiryDialog>

                          <TransitionLink
                            href={`/vendors/${vendor?.id}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-primary hover:bg-primary/90"
                            >
                              Profile
                              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                            </Button>
                          </TransitionLink>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      No vendors found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search criteria or browse all available
                      vendors.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchInput("");
                          handleLocationChange("all");
                          handleCategoryChange("all");
                          handlePageChange(1);
                        }}
                      >
                        Clear Filters
                      </Button>
                      <Button
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              "/api/vendors?showAll=true",
                            );
                            const data = await response.json();
                            console.log("Show all API call result:", data);
                            // Refresh logic here if needed
                            window.location.reload();
                          } catch (err) {
                            console.error("Show all API call failed:", err);
                          }
                        }}
                      >
                        Show All Vendors
                      </Button>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                        className={
                          currentPage <= 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber =
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        i;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={pageNumber === currentPage}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                        className={
                          currentPage >= totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VendorsContent;

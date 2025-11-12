"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { TransitionLink } from "@/components/transition-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { LoadingSpinner } from "@/components/loading-spinner";
import { StarRating } from "@/components/ui/star-rating";
import { VendorCardSkeleton, GridSkeleton } from "@/components/ui/skeleton";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { MapPin, Globe, Phone, Star, Search, Filter, Mail } from "lucide-react";

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

      console.log(
        "Frontend: Fetching vendors with params:",
        Object.fromEntries(params),
      );
      const response = await fetch(`/api/vendors?${params.toString()}`);
      console.log("Frontend: API response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch vendors: ${response.status} ${response.statusText}`,
        );
      }

      const data: VendorsResponse = await response.json();
      console.log("Frontend: API Response:", data);
      console.log("Frontend: Vendors array:", data.vendors);
      console.log("Frontend: Number of vendors:", data.vendors?.length || 0);

      // Ensure vendors is always an array
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
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
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
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Discover Amazing Vendors
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect vendors for your special events. From
              photographers to caterers, discover trusted professionals in your
              area.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Debug Info - Remove this after debugging */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p>Vendors count: {vendors.length}</p>
            <p>Total from API: {totalVendors}</p>
            <p>Current page: {currentPage}</p>
            <p>Loading: {loading ? "true" : "false"}</p>
            <p>Error: {error || "none"}</p>
            <details className="mt-2">
              <summary className="cursor-pointer">Raw vendor data</summary>
              <pre className="text-xs mt-2 overflow-auto max-h-40">
                {JSON.stringify(vendors.slice(0, 2), null, 2)}
              </pre>
            </details>
          </div>
        )}
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search vendors by name, service, or specialty..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </form>

            <Select value={locationFilter} onValueChange={handleLocationChange}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by location" />
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

            <Button type="submit" onClick={handleSearch} className="h-12 px-8">
              Search
            </Button>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {vendors.map((vendor) => (
                  <Card
                    key={vendor?.id || Math.random()}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Full-width Image at top */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage
                          src={
                            vendor?.profilePictureUrl ||
                            "/placeholder-user.jpg"
                          }
                          alt={
                            vendor?.businessName || vendor?.email || "Vendor"
                          }
                          className="object-cover w-full h-full"
                          style={{
                            viewTransitionName: `vendor-avatar-${vendor?.id}`,
                          }}
                        />
                        <AvatarFallback className="text-4xl rounded-none w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          {getInitials(
                            vendor?.businessName ||
                              vendor?.email ||
                              "Unknown Vendor",
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {/* Status Badge */}
                      {vendor?.approved && vendor?.published && (
                        <Badge className="absolute top-3 right-3 bg-green-500">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                        {vendor?.businessName ||
                          vendor?.email ||
                          "Unnamed Vendor"}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {vendor?.location || "Location not specified"}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      {vendor?.bio && vendor.bio.trim() && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {vendor.bio}
                        </p>
                      )}

                      {/* Rating */}
                      {vendor?.totalRating !== undefined &&
                      vendor?.numberOfRatings !== undefined ? (
                        <div className="flex items-center gap-2">
                          <StarRating
                            rating={vendor.totalRating || 0}
                            readonly
                            size="sm"
                          />
                          <span className="text-xs text-muted-foreground">
                            ({vendor.numberOfRatings} reviews)
                          </span>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          No reviews yet
                        </div>
                      )}

                      {/* View Profile in same row on larger devices */}
                      <div className="hidden md:flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0"
                          disabled={!vendor?.phoneNumber || !vendor.phoneNumber.trim()}
                          asChild={vendor?.phoneNumber && vendor.phoneNumber.trim()}
                        >
                          {vendor?.phoneNumber && vendor.phoneNumber.trim() ? (
                            <a href={`tel:${vendor.phoneNumber}`} title="Call vendor">
                              <Phone className="h-4 w-4" />
                            </a>
                          ) : (
                            <Phone className="h-4 w-4" />
                          )}
                        </Button>

                        <InquiryDialog
                          serviceId={vendor?.id?.toString() || ""}
                          serviceName={vendor?.businessName || "Vendor"}
                          serviceType="VENDOR"
                        >
                          <Button
                            size="sm"
                            className="flex-1 bg-primary hover:bg-primary/90"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Inquire
                          </Button>
                        </InquiryDialog>

                        <TransitionLink
                          href={`/vendors/${vendor?.id}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            View Profile
                          </Button>
                        </TransitionLink>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No vendors found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or browse all available
                      vendors.
                    </p>
                    <Button
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
                      variant="outline"
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            "/api/vendors?showAll=true",
                          );
                          const data = await response.json();
                          console.log("Show all API call result:", data);
                          alert(
                            `Show all API call: ${data.vendors?.length || 0} vendors found`,
                          );
                        } catch (err) {
                          console.error("Show all API call failed:", err);
                          alert("Show all API call failed");
                        }
                      }}
                    >
                      Show All Vendors
                    </Button>
                  </div>
                </div>
              )
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
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

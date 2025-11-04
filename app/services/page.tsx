"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { TransitionLink } from "@/components/transition-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { StarRating } from "@/components/ui/star-rating";
import { ServiceCardSkeleton, GridSkeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Heart,
  ShoppingCart,
  Camera,
  Music,
  Utensils,
  Palette,
  Car,
  Gift,
  Mic,
  Sparkles,
  Cake,
  Crown,
  Building,
  DollarSign,
  TrendingUp,
  Zap,
  Gem,
  Tag,
  ImageIcon,
} from "lucide-react";
import { getPriceDisplay, PriceEnum } from "@/lib/utils";

enum ServiceType {
  PHOTOGRAPHER = "PHOTOGRAPHER",
  PHOTO_VIDEOGRAPHER = "PHOTO_VIDEOGRAPHER",
  DECORATOR = "DECORATOR",
  FLORIST = "FLORIST",
  CATERS = "CATERS",
  BAKERS = "BAKERS",
  TRANSPORTATION = "TRANSPORTATION",
  BRIDE_GROOMING = "BRIDE_GROOMING",
  WEDDING_BAND = "WEDDING_BAND",
  DJ = "DJ",
  SINGER = "SINGER",
  ANCHOR = "ANCHOR",
  MAGICIAN = "MAGICIAN",
  VENUE = "VENUE",
}

enum EventType {
  WEDDING = "WEDDING",
  BIRTHDAY = "BIRTHDAY",
  ANNIVERSARY = "ANNIVERSARY",
  CORPORATE = "CORPORATE",
  ENGAGEMENT = "ENGAGEMENT",
  BABY_SHOWER = "BABY_SHOWER",
  GRADUATION = "GRADUATION",
  HOLIDAY_PARTY = "HOLIDAY_PARTY",
  CONFERENCE = "CONFERENCE",
  EXHIBITION = "EXHIBITION",
}

const serviceTypeIcons = {
  [ServiceType.PHOTOGRAPHER]: Camera,
  [ServiceType.PHOTO_VIDEOGRAPHER]: Camera,
  [ServiceType.DECORATOR]: Palette,
  [ServiceType.FLORIST]: Gift,
  [ServiceType.CATERS]: Utensils,
  [ServiceType.BAKERS]: Cake,
  [ServiceType.TRANSPORTATION]: Car,
  [ServiceType.BRIDE_GROOMING]: Crown,
  [ServiceType.WEDDING_BAND]: Music,
  [ServiceType.DJ]: Music,
  [ServiceType.SINGER]: Mic,
  [ServiceType.ANCHOR]: Mic,
  [ServiceType.MAGICIAN]: Sparkles,
  [ServiceType.VENUE]: Building,
};

const priceEnumIcons = {
  [PriceEnum.INEXPENSIVE]: DollarSign,
  [PriceEnum.AFFORDABLE]: TrendingUp,
  [PriceEnum.MODERATE]: Zap,
  [PriceEnum.LUXURY]: Gem,
};

interface Service {
  id: number;
  name: string;
  serviceType: ServiceType;
  eventType: EventType;
  priceEnum: PriceEnum;
  availability: boolean;
  metadata?: string;
  images?: string[];
  vendorId: number;
  totalRating?: number;
  numberOfRatings?: number;
}

const eventTypeOptions = [
  {
    type: EventType.WEDDING,
    name: "Wedding",
    description: "Find perfect vendors for your dream event",
    icon: Crown,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
  },
  {
    type: EventType.CORPORATE,
    name: "Corporate",
    description: "Professional services for corporate events",
    icon: Building,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
  },
  {
    type: EventType.BIRTHDAY,
    name: "Birthday",
    description: "Make birthdays unforgettable",
    icon: Cake,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
  },
  {
    type: EventType.ENGAGEMENT,
    name: "Engagement",
    description: "Celebrate your special moment",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
  },
  {
    type: EventType.BABY_SHOWER,
    name: "Baby Shower",
    description: "Welcome the new arrival",
    icon: Gift,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400",
  },
  {
    type: EventType.CONFERENCE,
    name: "Conference",
    description: "Professional conference services",
    icon: Building,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400",
  },
];

function ServicesContent() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { data: session } = useSession();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { addItem } = useCart();

  // Extract URL params IMMEDIATELY and discard searchParams reference
  const rawSearchParams = useSearchParams();
  const searchQuery = rawSearchParams?.get("search") || "";
  const serviceTypeFilter = rawSearchParams?.get("type") || "all";
  const eventTypeFilter = rawSearchParams?.get("event") || "all";
  const priceFilter = rawSearchParams?.get("price") || "all";

  const [services, setServices] = useState<Service[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEventTypeSelection, setShowEventTypeSelection] = useState(true);

  // Local state for search input (for immediate UI feedback)
  const [searchInput, setSearchInput] = useState("");

  // Update showEventTypeSelection based on URL params
  useEffect(() => {
    const hasFilters =
      searchQuery ||
      serviceTypeFilter !== "all" ||
      eventTypeFilter !== "all" ||
      priceFilter !== "all";
    if (hasFilters) {
      setShowEventTypeSelection(false);
    }
    // Page has finished initial setup
    setPageLoading(false);
  }, [searchQuery, serviceTypeFilter, eventTypeFilter, priceFilter]);

  // Sync searchInput with URL on mount/URL change
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Manual search function
  const handleManualSearch = () => {
    const params = new URLSearchParams();

    // Rebuild params: new searchInput + current URL params for filters
    if (searchInput) params.set("search", searchInput);
    if (serviceTypeFilter && serviceTypeFilter !== "all")
      params.set("type", serviceTypeFilter);
    if (eventTypeFilter && eventTypeFilter !== "all")
      params.set("event", eventTypeFilter);
    if (priceFilter && priceFilter !== "all") params.set("price", priceFilter);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle Enter key in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleManualSearch();
    }
  };

  // Immediate URL updates for filters
  const setServiceTypeFilter = (value: string) => {
    const params = new URLSearchParams();

    // Rebuild params from current state
    if (searchInput) params.set("search", searchInput);
    if (value && value !== "all") params.set("type", value);
    if (eventTypeFilter && eventTypeFilter !== "all")
      params.set("event", eventTypeFilter);
    if (priceFilter && priceFilter !== "all") params.set("price", priceFilter);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setEventTypeFilter = (value: string) => {
    const params = new URLSearchParams();

    // Rebuild params from current state
    if (searchInput) params.set("search", searchInput);
    if (serviceTypeFilter && serviceTypeFilter !== "all")
      params.set("type", serviceTypeFilter);
    if (value && value !== "all") params.set("event", value);
    if (priceFilter && priceFilter !== "all") params.set("price", priceFilter);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setPriceFilter = (value: string) => {
    const params = new URLSearchParams();

    // Rebuild params from current state
    if (searchInput) params.set("search", searchInput);
    if (serviceTypeFilter && serviceTypeFilter !== "all")
      params.set("type", serviceTypeFilter);
    if (eventTypeFilter && eventTypeFilter !== "all")
      params.set("event", eventTypeFilter);
    if (value && value !== "all") params.set("price", value);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setSearchQuery = (value: string) => {
    setSearchInput(value);
  };

  // Fetch services when URL params change (no debounce - already debounced in URL update)
  useEffect(() => {
    fetchServices();
  }, [searchQuery, serviceTypeFilter, eventTypeFilter, priceFilter]);

  const fetchServices = async () => {
    try {
      setDataLoading(true);
      setError(null);

      // Fetch all services from the public API
      const servicesResponse = await fetch(`/api/services`);

      if (!servicesResponse.ok) {
        throw new Error(`Failed to fetch services: ${servicesResponse.status}`);
      }

      const allServices = await servicesResponse.json();

      // Apply filters
      let filteredServices = allServices;

      if (searchQuery && searchQuery.trim()) {
        filteredServices = filteredServices.filter(
          (service: Service) =>
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.metadata?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      if (serviceTypeFilter && serviceTypeFilter !== "all") {
        filteredServices = filteredServices.filter(
          (service: Service) => service.serviceType === serviceTypeFilter,
        );
      }

      if (eventTypeFilter && eventTypeFilter !== "all") {
        filteredServices = filteredServices.filter(
          (service: Service) => service.eventType === eventTypeFilter,
        );
      }

      if (priceFilter && priceFilter !== "all") {
        filteredServices = filteredServices.filter(
          (service: Service) => service.priceEnum === priceFilter,
        );
      }

      setServices(filteredServices);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setServices([]);
    } finally {
      setDataLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setServiceTypeFilter("all");
    setEventTypeFilter("all");
    setPriceFilter("all");
  };

  const handleAddToFavorites = (service: Service) => {
    if (!session?.user) {
      toast.error("Please sign in to add favorites");
      return;
    }

    const serviceId = service.id.toString();
    const isFavorite = favorites.some(
      (fav) => fav.id === serviceId && fav.type === "service",
    );

    if (isFavorite) {
      removeFromFavorites(serviceId);
      toast.success("Removed from favorites");
    } else {
      addToFavorites({
        id: serviceId,
        name: service.name,
        image: service.images?.[0] || "/placeholder.jpg",
        type: "service",
      });
      toast.success("Added to favorites");
    }
  };

  const handleAddToCart = (service: Service) => {
    if (!session?.user) {
      toast.error("Please sign in to add to cart");
      return;
    }

    if (!service.availability) {
      toast.error("This service is currently unavailable");
      return;
    }

    addItem({
      id: service.id.toString(),
      name: service.name,
      image: service.images?.[0] || "/placeholder.jpg",
      type: "service",
      quantity: 1,
    });
    toast.success("Added to cart");
  };

  const handleEventTypeSelection = (eventType: EventType) => {
    setEventTypeFilter(eventType);
    setShowEventTypeSelection(false);
  };

  const handleBackToSelection = () => {
    setShowEventTypeSelection(true);
    setEventTypeFilter("all");
  };

  if (pageLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-10 w-80 bg-muted animate-pulse rounded-md mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="h-12 w-64 bg-muted animate-pulse rounded-md" />
          <div className="h-12 w-48 bg-muted animate-pulse rounded-md" />
          <div className="h-12 w-48 bg-muted animate-pulse rounded-md" />
        </div>
        <GridSkeleton count={6} CardComponent={ServiceCardSkeleton} />
      </div>
    );
  }

  // Show event type selection screen first
  if (showEventTypeSelection) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Services for Your Event
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              What type of event are you planning? Select below to discover the
              perfect vendors.
            </p>
          </div>

          {/* Event Type Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {eventTypeOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card
                  key={option.type}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary"
                  onClick={() => handleEventTypeSelection(option.type)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={option.image}
                      alt={option.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {option.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">
                      {option.description}
                    </p>
                    <Button className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Browse {option.name} Services
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Skip to All Services */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowEventTypeSelection(false)}
            >
              Skip and Browse All Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToSelection}
            className="mb-4"
          >
            ← Back to Event Types
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            {eventTypeFilter !== "all"
              ? `${eventTypeFilter.replace(/_/g, " ")} Services`
              : "All Services"}
          </h1>
          <p className="text-muted-foreground">
            Discover amazing services for your events
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
                    placeholder="Search services..."
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
              <Select
                value={serviceTypeFilter}
                onValueChange={setServiceTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {Object.values(ServiceType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={eventTypeFilter}
                onValueChange={setEventTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {Object.values(EventType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Price Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  {Object.values(PriceEnum).map((tier) => (
                    <SelectItem key={tier} value={tier}>
                      {tier.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {dataLoading
              ? "Loading services..."
              : `Showing ${services.length} services`}
          </p>
          {dataLoading && (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-muted-foreground">
                Fetching data...
              </span>
            </div>
          )}
        </div>

        {/* Services Grid */}
        {error ? (
          <div className="text-center py-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Error
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchServices}>Try Again</Button>
            </div>
          </div>
        ) : dataLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const ServiceIconComponent =
                serviceTypeIcons[service.serviceType] || Tag;
              const PriceIconComponent =
                priceEnumIcons[service.priceEnum] || DollarSign;

              return (
                <Card
                  key={service.id}
                  className="group hover:shadow-lg transition-all duration-200 flex flex-col h-full"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex-shrink-0">
                          <ServiceIconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg font-semibold line-clamp-2">
                            {service.name}
                          </CardTitle>
                          <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {service.serviceType.replace(/_/g, " ")}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <PriceIconComponent className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-muted-foreground truncate">
                                {service.priceEnum.replace(/_/g, " ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant={service.availability ? "default" : "secondary"}
                        className={cn(
                          "flex-shrink-0 text-xs",
                          service.availability &&
                            "bg-green-100 text-green-800 border-green-200",
                        )}
                      >
                        {service.availability ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0 flex-1 flex flex-col">
                    {/* Price */}
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0">
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <span className="text-base sm:text-lg font-bold text-gray-900">
                            {getPriceDisplay(service.priceEnum)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    {service.totalRating !== undefined &&
                    service.numberOfRatings !== undefined ? (
                      <div className="flex items-center justify-between gap-2">
                        <StarRating
                          rating={service.totalRating || 0}
                          readonly
                          size="sm"
                        />
                        <span className="text-xs text-muted-foreground whitespace-nowrap truncate">
                          ({service.numberOfRatings} reviews)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <StarRating rating={0} readonly size="sm" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          (No reviews yet)
                        </span>
                      </div>
                    )}

                    {/* Images Preview */}
                    {service.images && service.images.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <ImageIcon className="h-4 w-4" />
                          Service Images ({service.images.length})
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {service.images.slice(0, 3).map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={imageUrl}
                                alt={`${service.name} image ${index + 1}`}
                                className="w-full h-16 object-cover rounded-lg border border-gray-200"
                                style={{
                                  viewTransitionName: `service-image-${service.id}-${index}`,
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                              {index === 2 &&
                                service.images &&
                                service.images.length > 3 && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">
                                      +{service.images.length - 2} more
                                    </span>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {service.metadata && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.metadata}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button asChild className="flex-1">
                        <TransitionLink href={`/services/${service.id}`}>
                          View Details
                        </TransitionLink>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAddToFavorites(service)}
                        className={
                          favorites.some(
                            (fav) =>
                              fav.id === service.id.toString() &&
                              fav.type === "service",
                          )
                            ? "text-red-500"
                            : ""
                        }
                      >
                        <Heart
                          className={`h-4 w-4 ${favorites.some((fav) => fav.id === service.id.toString() && fav.type === "service") ? "fill-current" : ""}`}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAddToCart(service)}
                        disabled={!service.availability}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          !dataLoading && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No services found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all available
                  services.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ServicesContent;

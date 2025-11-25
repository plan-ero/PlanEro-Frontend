"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
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
import { ServicesSEO } from "@/components/seo/services-seo";
import { motion } from "framer-motion";
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
  X,
  ArrowRight,
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
    // Also clear URL params
    replace(pathname, { scroll: false });
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
          <GridSkeleton count={6} CardComponent={ServiceCardSkeleton} />
        </div>
      </div>
    );
  }

  // Show event type selection screen first
  if (showEventTypeSelection) {
    return (
      <div className="min-h-screen bg-background">
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
                  Start Planning
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display tracking-tight text-foreground">
                  Find Services for Your Event
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  What type of event are you planning? Select below to discover the perfect vendors.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Event Type Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {eventTypeOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={option.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-none shadow-md ring-1 ring-border/50 h-full"
                    onClick={() => handleEventTypeSelection(option.type)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={option.image}
                        alt={option.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center space-x-3 mb-1">
                          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white">
                            {option.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground mb-4">
                        {option.description}
                      </p>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                        Browse Services <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Skip to All Services */}
          <div className="text-center mt-12">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowEventTypeSelection(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip and Browse All Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalServices = services.length;

  return (
    <div className="min-h-screen bg-background">
      <ServicesSEO
        services={services.slice(0, 10).map((s) => ({
          name: s.name,
          description: s.metadata,
          serviceType: s.serviceType,
          eventTypes: [s.eventType],
          price: s.priceEnum ? getPriceDisplay(s.priceEnum) : undefined,
        }))}
        totalCount={totalServices}
        category={serviceTypeFilter !== "all" ? serviceTypeFilter : undefined}
      />

      {/* Mini Hero */}
      <div className="bg-muted/30 border-b py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={handleBackToSelection}
            className="mb-6 pl-0 hover:pl-2 transition-all"
          >
            ← Back to Event Types
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {eventTypeFilter !== "all"
              ? `${eventTypeFilter.replace(/_/g, " ")} Services`
              : "All Services"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse our curated list of professional services to make your event truly special.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row gap-4 mb-6 p-2 bg-card rounded-xl border shadow-sm">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search services..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="pl-10 h-12 border-none shadow-none focus-visible:ring-0 bg-transparent"
              />
            </div>

            <div className="h-px lg:h-12 w-full lg:w-px bg-border" />

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-0">
              <Select
                value={serviceTypeFilter}
                onValueChange={setServiceTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[160px] h-12 border-none shadow-none focus:ring-0 bg-transparent">
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

              <div className="hidden sm:block w-px h-12 bg-border" />

              <Select
                value={eventTypeFilter}
                onValueChange={setEventTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[160px] h-12 border-none shadow-none focus:ring-0 bg-transparent">
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

              <div className="hidden sm:block w-px h-12 bg-border" />

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-12 border-none shadow-none focus:ring-0 bg-transparent">
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

          {(searchInput || serviceTypeFilter !== "all" || eventTypeFilter !== "all" || priceFilter !== "all") && (
            <div className="flex justify-between items-center px-2">
              <p className="text-sm text-muted-foreground font-medium">
                {dataLoading
                  ? "Loading services..."
                  : `Showing ${services.length} services`}
              </p>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
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
              <Button onClick={fetchServices} variant="outline">Try Again</Button>
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
            {services.map((service, index) => {
              const ServiceIconComponent =
                serviceTypeIcons[service.serviceType] || Tag;
              const PriceIconComponent =
                priceEnumIcons[service.priceEnum] || DollarSign;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card
                    className="group hover:shadow-xl transition-all duration-300 flex flex-col h-full border-none shadow-sm ring-1 ring-border/50 overflow-hidden"
                  >
                    <CardHeader className="pb-3 bg-muted/30 border-b">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2.5 bg-white rounded-xl shadow-sm border flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <ServiceIconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                              {service.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Badge variant="secondary" className="text-xs font-normal bg-white/50 hover:bg-white">
                                {service.serviceType.replace(/_/g, " ")}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <PriceIconComponent className="h-3 w-3" />
                                <span className="truncate">
                                  {service.priceEnum.replace(/_/g, " ")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Badge
                          variant={service.availability ? "default" : "secondary"}
                          className={cn(
                            "flex-shrink-0 text-xs shadow-none",
                            service.availability &&
                            "bg-green-100 text-green-700 hover:bg-green-200 border-transparent",
                            !service.availability && "bg-gray-100 text-gray-500"
                          )}
                        >
                          {service.availability ? "Available" : "Booked"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-5 flex-1 flex flex-col">
                      {/* Images Preview */}
                      {service.images && service.images.length > 0 ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            {service.images.slice(0, 3).map((imageUrl, index) => (
                              <div key={index} className="relative group/image aspect-square overflow-hidden rounded-md bg-muted">
                                <img
                                  src={imageUrl}
                                  alt={`${service.name} image ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
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
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                                      <span className="text-white text-xs font-bold">
                                        +{service.images.length - 2}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-20 bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}

                      {/* Description */}
                      {service.metadata && (
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {service.metadata}
                        </div>
                      )}

                      <div className="mt-auto pt-4 border-t flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-50 rounded-md">
                              <DollarSign className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-lg font-bold text-foreground">
                              {getPriceDisplay(service.priceEnum)}
                            </span>
                          </div>

                          {/* Rating */}
                          {service.totalRating !== undefined &&
                            service.numberOfRatings !== undefined ? (
                            <div className="flex items-center gap-1.5">
                              <StarRating
                                rating={service.totalRating || 0}
                                readonly
                                size="sm"
                              />
                              <span className="text-xs text-muted-foreground">
                                ({service.numberOfRatings})
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              No reviews
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <TransitionLink href={`/services/${service.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              Details
                            </Button>
                          </TransitionLink>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleAddToFavorites(service)}
                            className={cn(
                              "transition-colors",
                              favorites.some(
                                (fav) =>
                                  fav.id === service.id.toString() &&
                                  fav.type === "service",
                              )
                                ? "text-red-500 border-red-200 bg-red-50 hover:bg-red-100"
                                : "hover:text-red-500"
                            )}
                          >
                            <Heart
                              className={cn("h-4 w-4", favorites.some((fav) => fav.id === service.id.toString() && fav.type === "service") && "fill-current")}
                            />
                          </Button>

                          <Button
                            size="icon"
                            onClick={() => handleAddToCart(service)}
                            disabled={!service.availability}
                            className={cn(!service.availability && "opacity-50")}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No services found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any services matching your criteria. Try adjusting your filters.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServicesContent;

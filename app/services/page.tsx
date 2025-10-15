"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
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

enum PriceEnum {
  INEXPENSIVE = "INEXPENSIVE",
  AFFORDABLE = "AFFORDABLE",
  MODERATE = "MODERATE",
  LUXURY = "LUXURY",
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
  cost: number;
  metadata?: string;
  images?: string[];
  vendorId: number;
  totalRating?: number;
  numberOfRatings?: number;
}

export default function ServicesPage() {
  const { data: session } = useSession();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { addItem } = useCart();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    fetchServices();
  }, [searchQuery, serviceTypeFilter, eventTypeFilter, priceFilter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
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
        price: service.cost,
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
      price: service.cost,
      image: service.images?.[0] || "/placeholder.jpg",
      type: "service",
      quantity: 1,
    });
    toast.success("Added to cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Services</h1>
          <p className="text-muted-foreground">
            Discover amazing services for your events
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
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
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {services.length} services
          </p>
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
                  className="group hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                          <ServiceIconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold line-clamp-2">
                            {service.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {service.serviceType.replace(/_/g, " ")}
                            </Badge>
                            <PriceIconComponent className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {service.priceEnum.replace(/_/g, " ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant={service.availability ? "default" : "secondary"}
                        className={
                          service.availability
                            ? "bg-green-100 text-green-800 border-green-200"
                            : ""
                        }
                      >
                        {service.availability ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    {/* Price */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            ${service.cost.toFixed(2)}
                          </span>
                          <p className="text-xs text-gray-500">
                            Starting price
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    {service.totalRating !== undefined &&
                    service.numberOfRatings !== undefined ? (
                      <div className="flex items-center justify-between">
                        <StarRating
                          rating={service.totalRating || 0}
                          readonly
                          size="sm"
                        />
                        <span className="text-xs text-muted-foreground">
                          ({service.numberOfRatings} reviews)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <StarRating rating={0} readonly size="sm" />
                        <span className="text-xs text-muted-foreground">
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
                        <Link href={`/services/${service.id}`}>
                          View Details
                        </Link>
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
          !loading && (
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

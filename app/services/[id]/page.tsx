"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StarRating } from "@/components/ui/star-rating";
import { RatingsDisplay } from "@/components/ratings-display";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Camera,
  Music,
  Utensils,
  Palette,
  Car,
  Heart,
  Gift,
  Mic,
  Sparkles,
  User,
  Cake,
  Crown,
  TrendingUp,
  Zap,
  Gem,
  Building,
  DollarSign,
  Tag,
  MapPin,
  ImageIcon,
  ShoppingCart,
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

const eventTypeIcons = {
  [EventType.WEDDING]: Heart,
  [EventType.BIRTHDAY]: Gift,
  [EventType.ANNIVERSARY]: Heart,
  [EventType.CORPORATE]: User,
  [EventType.ENGAGEMENT]: Heart,
  [EventType.BABY_SHOWER]: Gift,
  [EventType.GRADUATION]: Sparkles,
  [EventType.HOLIDAY_PARTY]: Gift,
  [EventType.CONFERENCE]: User,
  [EventType.EXHIBITION]: Tag,
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

interface Vendor {
  id: number;
  businessName: string;
  location: string;
  profilePictureUrl?: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { addItem } = useCart();

  const [service, setService] = useState<Service | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceId = params.id as string;

  // Check if service is in favorites
  const isFavorite = favorites.some(
    (fav) => fav.id === serviceId && fav.type === "service",
  );

  const handleAddToFavorites = () => {
    if (!session?.user) {
      toast.error("Please sign in to add favorites");
      return;
    }

    if (!service) return;

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

  const handleAddToCart = () => {
    if (!session?.user) {
      toast.error("Please sign in to add to cart");
      return;
    }

    if (!service) return;

    addItem({
      id: serviceId,
      name: service.name,
      price: service.cost,
      image: service.images?.[0] || "/placeholder.jpg",
      type: "service",
      quantity: 1,
    });
    toast.success("Added to cart");
  };

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch service details from public API
      const serviceResponse = await fetch(`/api/services/${serviceId}`);

      if (!serviceResponse.ok) {
        if (serviceResponse.status === 404) {
          throw new Error("Service not found");
        }
        throw new Error("Failed to fetch service details");
      }

      const serviceData = await serviceResponse.json();
      setService(serviceData);

      // Fetch vendor details
      if (serviceData.vendorId) {
        const vendorResponse = await fetch(
          `/api/vendors/${serviceData.vendorId}`,
        );
        if (vendorResponse.ok) {
          const vendorData = await vendorResponse.json();
          setVendor(vendorData);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-destructive mb-2">
                {error || "Service not found"}
              </h2>
              <p className="text-muted-foreground mb-4">
                The service you're looking for could not be found.
              </p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ServiceIconComponent = serviceTypeIcons[service.serviceType] || Tag;
  const EventIconComponent = eventTypeIcons[service.eventType] || Tag;
  const PriceIconComponent = priceEnumIcons[service.priceEnum] || DollarSign;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                    <ServiceIconComponent className="h-12 w-12 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-4">{service.name}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <ServiceIconComponent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Service Type:
                        </span>
                        <Badge variant="outline">
                          {service.serviceType.replace(/_/g, " ")}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <EventIconComponent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Event Type:
                        </span>
                        <Badge variant="outline">
                          {service.eventType.replace(/_/g, " ")}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <PriceIconComponent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Price Tier:
                        </span>
                        <Badge variant="outline">
                          {service.priceEnum.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-primary">
                          ₹{service.cost.toFixed(2)}
                        </div>
                        <Badge
                          variant={
                            service.availability ? "default" : "secondary"
                          }
                          className={
                            service.availability
                              ? "bg-green-100 text-green-800 border-green-200"
                              : ""
                          }
                        >
                          {service.availability ? "Available" : "Unavailable"}
                        </Badge>
                      </div>

                      {service.totalRating !== undefined &&
                      service.numberOfRatings !== undefined ? (
                        <div className="flex items-center gap-2">
                          <StarRating
                            rating={service.totalRating || 0}
                            readonly
                            size="md"
                          />
                          <span className="text-sm text-muted-foreground">
                            ({service.numberOfRatings} reviews)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <StarRating rating={0} readonly size="md" />
                          <span className="text-sm text-muted-foreground">
                            (No reviews yet)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={handleAddToFavorites}
                    variant={isFavorite ? "default" : "outline"}
                    className="flex items-center gap-2"
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>

                  <Button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2"
                    disabled={!service?.availability}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Link href={vendor ? `/vendors/${vendor.id}` : "#"}>
                      <User className="h-4 w-4" />
                      View Vendor
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Service Images */}
            {service.images && service.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Service Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {service.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`${service.name} image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 group-hover:shadow-lg transition-shadow"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Description */}
            {service.metadata && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.metadata}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Ratings & Reviews */}
            <RatingsDisplay
              serviceId={service.id}
              title={`Reviews for ${service.name}`}
              showAddRating={true}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vendor Information */}
            {vendor && (
              <Card>
                <CardHeader>
                  <CardTitle>Provided by</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{vendor.businessName}</h3>
                      {vendor.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {vendor.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/vendors/${vendor.id}`}>
                      View Vendor Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Service ID
                  </span>
                  <span className="text-sm font-medium">#{service.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Category
                  </span>
                  <span className="text-sm font-medium">
                    {service.serviceType.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Event Type
                  </span>
                  <span className="text-sm font-medium">
                    {service.eventType.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Price Tier
                  </span>
                  <span className="text-sm font-medium">
                    {service.priceEnum.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Starting Price
                  </span>
                  <span className="text-sm font-medium">
                    ₹{service.cost.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InquiryDialog
                  serviceId={service.id.toString()}
                  serviceName={service.name}
                  serviceType={service.serviceType}
                >
                  <Button className="w-full">Inquire Vendor</Button>
                </InquiryDialog>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={vendor ? `/vendors/${vendor.id}` : "#"}>
                    Contact Vendor
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

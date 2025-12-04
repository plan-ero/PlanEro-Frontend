"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TransitionLink as Link } from "@/components/transition-link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { getPriceDisplay, PriceEnum, cn } from "@/lib/utils";
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
  Share2,
  CheckCircle,
  Info,
  Calendar,
  Clock,
  ShieldCheck,
  Phone,
  Mail
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
  metadata?: any;
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
  metadata?: any;
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      image: service.images?.[0] || "/placeholder.jpg",
      type: "service",
      quantity: 1,
    });
    toast.success("Added to cart");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
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

      // Parse metadata if it's a string
      if (serviceData.metadata && typeof serviceData.metadata === 'string') {
        try {
          serviceData.metadata = JSON.parse(serviceData.metadata);
        } catch (e) {
          console.error("Failed to parse service metadata", e);
        }
      }

      setService(serviceData);

      // Fetch vendor details
      if (serviceData.vendorId) {
        const vendorResponse = await fetch(
          `/api/vendors/${serviceData.vendorId}`,
        );
        if (vendorResponse.ok) {
          const vendorData = await vendorResponse.json();
          // Parse vendor metadata as well
          if (vendorData.metadata && typeof vendorData.metadata === 'string') {
            try {
              vendorData.metadata = JSON.parse(vendorData.metadata);
            } catch (e) {
              console.error("Failed to parse vendor metadata", e);
            }
          }
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Info className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{error || "Service Not Found"}</h1>
          <p className="text-muted-foreground mb-6">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse All Services
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const ServiceIconComponent = serviceTypeIcons[service.serviceType] || Tag;
  const EventIconComponent = eventTypeIcons[service.eventType] || Tag;
  const PriceIconComponent = priceEnumIcons[service.priceEnum] || DollarSign;

  const hasImages = service.images && service.images.length > 0;
  const coverImage = hasImages ? service.images![currentImageIndex] : null;

  // Extract metadata fields
  const description = service.metadata?.description || (typeof service.metadata === 'string' ? service.metadata : null);
  const amenities = service.metadata?.amenities || [];
  const location = service.metadata?.location;
  const capacity = service.metadata?.capacity;
  const venueDetails = service.metadata?.venueDetails || (vendor?.metadata?.venueDetails);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] bg-muted overflow-hidden group">
        {coverImage ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background z-10" />
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              src={coverImage}
              alt={service.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <ServiceIconComponent className="h-32 w-32 text-primary/20" />
          </div>
        )}

        <div className="container mx-auto px-4 h-full relative z-20 flex flex-col justify-between py-8">
          <div className="flex justify-between items-start">
            <Button
              variant="ghost"
              asChild
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/services">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 hover:text-white rounded-full"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full hover:bg-white/20",
                  isFavorite ? "text-red-500 hover:text-red-400" : "text-white hover:text-white"
                )}
                onClick={handleAddToFavorites}
              >
                <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground border-none">
                    {service.serviceType.replace(/_/g, " ")}
                  </Badge>
                  <Badge variant="outline" className="text-white border-white/50">
                    {service.eventType.replace(/_/g, " ")}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
                  {service.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/90">
                  {vendor && (
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      By {vendor.businessName}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={service.totalRating || 0} readonly size="sm" />
                    <span className="opacity-75">({service.numberOfRatings || 0} reviews)</span>
                  </div>
                  {location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {location}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Gallery Thumbnails */}
            {hasImages && service.images!.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {service.images!.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                      currentImageIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            {description && (
              <section>
                <h2 className="text-2xl font-bold mb-4">About this Service</h2>
                <Card className="border-none shadow-sm bg-secondary/10">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Amenities */}
            {amenities && amenities.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Amenities & Features</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((amenity: string, i: number) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Venue Details (if available) */}
            {venueDetails && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Venue Information</h2>
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(venueDetails.capacity || capacity) && (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" /> Capacity
                          </span>
                          <span className="text-sm">{venueDetails.capacity || capacity} Guests</span>
                        </div>
                      )}
                      {venueDetails.venuePricePerEvent && (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" /> Price Per Event
                          </span>
                          <span className="text-sm">{getPriceDisplay(service.priceEnum)}</span>
                        </div>
                      )}
                      {venueDetails.parkingAvailable !== undefined && (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Car className="h-4 w-4 text-primary" /> Parking
                          </span>
                          <span className="text-sm">{venueDetails.parkingAvailable ? "Available" : "Not Available"}</span>
                        </div>
                      )}
                      {venueDetails.cateringAvailable !== undefined && (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Utensils className="h-4 w-4 text-primary" /> Catering
                          </span>
                          <span className="text-sm">{venueDetails.cateringAvailable ? "Available" : "Not Available"}</span>
                        </div>
                      )}
                    </div>

                    {venueDetails.amenities && venueDetails.amenities.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-3">Venue Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {venueDetails.amenities.map((amenity: string, i: number) => (
                            <Badge key={i} variant="secondary" className="px-3 py-1">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Ratings & Reviews */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              <RatingsDisplay
                serviceId={service.id}
                title=""
                showAddRating={true}
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <Card className="shadow-lg border-t-4 border-t-primary overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">Price Tier</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">
                        {getPriceDisplay(service.priceEnum)}
                      </span>
                      <span className="text-xs text-muted-foreground block uppercase tracking-wider mt-1">
                        {service.priceEnum.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Availability</span>
                      <Badge
                        variant={service.availability ? "default" : "destructive"}
                        className={service.availability ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {service.availability ? "Available Now" : "Unavailable"}
                      </Badge>
                    </div>
                    <Separator />
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full h-12 text-base shadow-md"
                      onClick={handleAddToCart}
                      disabled={!service.availability}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    <InquiryDialog
                      serviceId={service.id.toString()}
                      serviceName={service.name}
                      serviceType={service.serviceType}
                    >
                      <Button variant="outline" className="w-full">
                        Send Inquiry
                      </Button>
                    </InquiryDialog>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" />
                    Secure booking powered by Planero
                  </div>
                </CardContent>
              </Card>

              {/* Vendor Card */}
              {vendor && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Service Provider</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                        {vendor.profilePictureUrl ? (
                          <img src={vendor.profilePictureUrl} alt={vendor.businessName} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{vendor.businessName}</h3>
                        {vendor.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {vendor.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button asChild variant="outline" className="w-full text-xs h-9">
                      <Link href={`/vendors/${vendor.id}`}>
                        View Vendor Profile
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

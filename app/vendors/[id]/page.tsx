"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TransitionLink as Link } from "@/components/transition-link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StarRating } from "@/components/ui/star-rating";
import { RatingsDisplay } from "@/components/ratings-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  Star,
  ArrowLeft,
  Calendar,
  Award,
  CheckCircle,
  MessageSquare,
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
  Tag,
  Share2,
  Heart,
  Clock,
  Users,
  ShieldCheck,
  CreditCard,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ImageIcon,
} from "lucide-react";
import { getPriceDisplay } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "react-hot-toast";

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
  metadata?: any;
}

interface Service {
  id: number;
  name: string;
  serviceType: string;
  eventType: string;
  priceEnum: string;
  availability: boolean;
  metadata?: string;
  images?: string[];
  vendorId: number;
  totalRating?: number;
  numberOfRatings?: number;
}

const serviceTypeIcons: { [key: string]: any } = {
  PHOTOGRAPHER: Camera,
  PHOTO_VIDEOGRAPHER: Camera,
  DECORATOR: Palette,
  FLORIST: Gift,
  CATERS: Utensils,
  BAKERS: Cake,
  TRANSPORTATION: Car,
  BRIDE_GROOMING: Crown,
  WEDDING_BAND: Music,
  DJ: Music,
  SINGER: Mic,
  ANCHOR: Mic,
  MAGICIAN: Sparkles,
  VENUE: Building,
};

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const vendorId = params.id as string;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/vendors/${vendorId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Vendor not found");
        }
        throw new Error("Failed to fetch vendor details");
      }

      const vendorData = await response.json();

      // Parse metadata if it's a string
      if (vendorData.metadata && typeof vendorData.metadata === 'string') {
        try {
          vendorData.metadata = JSON.parse(vendorData.metadata);
        } catch (e) {
          console.error("Failed to parse vendor metadata", e);
        }
      }

      setVendor(vendorData);

      // Fetch vendor services
      await fetchVendorServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorServices = async () => {
    try {
      setServicesLoading(true);
      const response = await fetch(`/api/services?vendorId=${vendorId}`);

      if (response.ok) {
        const servicesData = await response.json();
        setServices(Array.isArray(servicesData) ? servicesData : []);
      } else {
        console.error("Failed to fetch vendor services");
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching vendor services:", err);
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const isFavorite = vendor ? favorites.some(f => f.id === vendor.id.toString() && f.type === 'vendor') : false;

  const toggleFavorite = () => {
    if (!vendor) return;
    if (isFavorite) {
      removeFromFavorites(vendor.id.toString());
      toast.success("Removed from favorites");
    } else {
      addToFavorites({
        id: vendor.id.toString(),
        name: vendor.businessName,
        image: vendor.profilePictureUrl,
        type: 'vendor'
      });
      toast.success("Added to favorites");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {error || "Vendor not found"}
          </h2>
          <p className="text-muted-foreground mb-6">
            The vendor you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/vendors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vendors
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background z-10" />
        {/* Placeholder for cover image - in real app would come from vendor data */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop')] bg-cover bg-center" />

        <div className="container mx-auto px-4 h-full relative z-20 flex flex-col justify-between py-8">
          <div className="flex justify-between items-start">
            <Button
              variant="ghost"
              asChild
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/vendors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
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
                onClick={toggleFavorite}
              >
                <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage
                  src={vendor.profilePictureUrl || "/placeholder-user.jpg"}
                  alt={vendor.businessName}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {getInitials(vendor.businessName || vendor.email || "Vendor")}
                </AvatarFallback>
              </Avatar>
              {vendor.approved && (
                <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-background shadow-sm" title="Verified Vendor">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
            </motion.div>

            <div className="flex-1 mb-2 text-white">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold mb-2"
              >
                {vendor.businessName || "Unnamed Vendor"}
              </motion.h1>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/90">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {vendor.location || "Location not specified"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{vendor.totalRating?.toFixed(1) || "New"}</span>
                  <span className="opacity-75">({vendor.numberOfRatings || 0} reviews)</span>
                </div>
                {vendor.metadata?.serviceVendorDetails?.workingHours && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {vendor.metadata.serviceVendorDetails.workingHours}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto mb-2">
              <Button className="flex-1 md:flex-none shadow-lg" size="lg">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
              <Button variant="secondary" className="flex-1 md:flex-none shadow-lg" size="lg">
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6 mb-6">
                <TabsTrigger
                  value="about"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-base"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-base"
                >
                  Services ({services.length})
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-base"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="portfolio"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-base"
                >
                  Portfolio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6 animate-in fade-in-50 duration-300">
                <Card>
                  <CardHeader>
                    <CardTitle>About {vendor.businessName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {vendor.bio || "This vendor hasn't provided a bio yet."}
                    </p>
                  </CardContent>
                </Card>

                {/* Company Details */}
                {vendor.metadata?.serviceVendorDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Building className="h-4 w-4 text-primary" />
                          Business Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {vendor.metadata.serviceVendorDetails.yearsOfExperience > 0 && (
                          <div className="flex justify-between py-1 border-b last:border-0">
                            <span className="text-muted-foreground text-sm">Experience</span>
                            <span className="font-medium text-sm">{vendor.metadata.serviceVendorDetails.yearsOfExperience} Years</span>
                          </div>
                        )}
                        {vendor.metadata.serviceVendorDetails.teamSize > 0 && (
                          <div className="flex justify-between py-1 border-b last:border-0">
                            <span className="text-muted-foreground text-sm">Team Size</span>
                            <span className="font-medium text-sm">{vendor.metadata.serviceVendorDetails.teamSize} Members</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          Legal & Payment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {vendor.metadata?.legalAndPayment?.businessRegistrationNumber && (
                          <div className="flex justify-between py-1 border-b last:border-0">
                            <span className="text-muted-foreground text-sm">Reg. No</span>
                            <span className="font-medium text-sm">{vendor.metadata.legalAndPayment.businessRegistrationNumber}</span>
                          </div>
                        )}
                        {vendor.metadata?.legalAndPayment?.paymentMethods?.length > 0 && (
                          <div className="py-1">
                            <span className="text-muted-foreground text-sm block mb-1.5">Accepted Payments</span>
                            <div className="flex flex-wrap gap-1.5">
                              {vendor.metadata.legalAndPayment.paymentMethods.map((method: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                  {method}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Certifications */}
                {vendor.metadata?.serviceVendorDetails?.certifications?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Certifications & Awards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {vendor.metadata.serviceVendorDetails.certifications.map((cert: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg border">
                            <Award className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="services" className="space-y-6 animate-in fade-in-50 duration-300">
                {servicesLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => {
                      const ServiceIcon = serviceTypeIcons[service.serviceType] || Tag;
                      return (
                        <Card key={service.id} className="group hover:shadow-md transition-all duration-300 overflow-hidden border-l-4 border-l-primary">
                          <CardContent className="p-0">
                            <div className="flex h-full">
                              {service.images && service.images.length > 0 && (
                                <div className="w-32 hidden sm:block relative overflow-hidden">
                                  <img
                                    src={service.images[0]}
                                    alt={service.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                </div>
                              )}
                              <div className="flex-1 p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-primary/10 rounded-md sm:hidden">
                                      <ServiceIcon className="h-4 w-4 text-primary" />
                                    </div>
                                    <Badge variant="outline" className="text-xs font-normal">
                                      {service.serviceType.replace(/_/g, " ")}
                                    </Badge>
                                  </div>
                                  <Badge
                                    variant={service.availability ? "default" : "secondary"}
                                    className={cn(
                                      "text-[10px] px-1.5 h-5",
                                      service.availability ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500"
                                    )}
                                  >
                                    {service.availability ? "Available" : "Booked"}
                                  </Badge>
                                </div>

                                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                  {service.name}
                                </h3>

                                <div className="flex items-center gap-2 mb-4">
                                  <span className="text-lg font-bold text-green-600">
                                    {getPriceDisplay(service.priceEnum)}
                                  </span>
                                  {service.totalRating !== undefined && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground border-l pl-2 ml-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span>{service.totalRating.toFixed(1)}</span>
                                      <span>({service.numberOfRatings})</span>
                                    </div>
                                  )}
                                </div>

                                <Button asChild size="sm" variant="outline" className="w-full">
                                  <Link href={`/services/${service.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Tag className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No services listed</h3>
                    <p className="text-muted-foreground">This vendor hasn't listed any services yet.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="animate-in fade-in-50 duration-300">
                <RatingsDisplay
                  vendorId={vendor.id}
                  title="Customer Reviews"
                  showAddRating={true}
                />
              </TabsContent>

              <TabsContent value="portfolio" className="animate-in fade-in-50 duration-300">
                {vendor.metadata?.serviceVendorDetails?.portfolio?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vendor.metadata.serviceVendorDetails.portfolio.map((img: string, i: number) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted relative group cursor-pointer">
                        <img
                          src={img}
                          alt={`Portfolio ${i + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Portfolio empty</h3>
                    <p className="text-muted-foreground">This vendor hasn't uploaded any portfolio images yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-md border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vendor.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-muted-foreground font-medium">Email</p>
                      <a href={`mailto:${vendor.email}`} className="text-sm font-medium hover:text-primary truncate block">
                        {vendor.email}
                      </a>
                    </div>
                  </div>
                )}

                {vendor.phoneNumber && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium">Phone</p>
                      <a href={`tel:${vendor.phoneNumber}`} className="text-sm font-medium hover:text-primary">
                        {vendor.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}

                {vendor.websiteUrl && vendor.websiteUrl.length > 0 && vendor.websiteUrl[0] && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-muted-foreground font-medium">Website</p>
                      <a
                        href={vendor.websiteUrl[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-primary truncate block"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                <Separator />

                {vendor.metadata?.additionalInfo?.socialMediaLinks && (
                  <div className="flex justify-center gap-4 pt-2">
                    {Object.entries(vendor.metadata.additionalInfo.socialMediaLinks).map(([platform, url]) => {
                      if (!url) return null;
                      const Icon = {
                        facebook: Facebook,
                        instagram: Instagram,
                        twitter: Twitter,
                        linkedin: Linkedin,
                        youtube: Youtube
                      }[platform.toLowerCase()] || Globe;

                      return (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200"
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Choose Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">Verified Professional</h4>
                    <p className="text-xs text-muted-foreground">Vetted by Planero team for quality assurance.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-blue-500 shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">Quick Response</h4>
                    <p className="text-xs text-muted-foreground">Usually responds within 24 hours.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-purple-500 shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">Secure Booking</h4>
                    <p className="text-xs text-muted-foreground">Payments are protected until service delivery.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

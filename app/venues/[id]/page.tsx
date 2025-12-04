"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { TransitionLink as Link } from "@/components/transition-link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  ShoppingCart,
  MapPin,
  Users,
  Star,
  Wifi,
  Car,
  Utensils,
  Camera,
  Share2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Music,
  ShieldCheck,
  Info,
  Maximize,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";
import { getPriceDisplay, PriceEnum, cn } from "@/lib/utils";

// Mock venue data - replace with actual API call
const getVenueById = (id: string) => {
  const venues = {
    "1": {
      id: "1",
      name: "Elegant Garden Venue",
      location: "Beverly Hills, CA",
      address: "123 Garden Lane, Beverly Hills, CA 90210",
      priceEnum: PriceEnum.LUXURY,
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519225468359-69df964e5663?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2069&auto=format&fit=crop",
      ],
      category: "Wedding Venues",
      capacity: 150,
      description:
        "Beautiful outdoor garden venue perfect for intimate weddings and special celebrations. Our stunning gardens provide the perfect backdrop for your special day.",
      longDescription:
        "Nestled in the heart of Beverly Hills, our Elegant Garden Venue offers a magical setting for your most important celebrations. With meticulously maintained gardens, charming gazebos, and elegant outdoor spaces, we provide the perfect canvas for creating unforgettable memories. Our venue combines natural beauty with sophisticated amenities to ensure your event is nothing short of spectacular.",
      rating: 4.8,
      reviews: 124,
      amenities: [
        { name: "Outdoor ceremony space", icon: Camera },
        { name: "Bridal suite", icon: Users },
        { name: "Catering kitchen", icon: Utensils },
        { name: "Parking for 100 cars", icon: Car },
        { name: "WiFi throughout", icon: Wifi },
        { name: "Sound system", icon: Music },
      ],
      features: [
        "Climate-controlled bridal suite",
        "Professional lighting system",
        "Backup power generator",
        "Wheelchair accessible",
        "Pet-friendly ceremony space",
        "On-site coordinator included",
      ],
      policies: [
        "Booking requires 50% deposit",
        "Cancellation policy: 30 days notice",
        "Setup begins 4 hours before event",
        "Music must end by 10 PM",
        "No smoking on premises",
        "Alcohol service requires licensed bartender",
      ],
      availability: {
        "2024-02-15": true,
        "2024-02-16": false,
        "2024-02-17": true,
        "2024-02-18": true,
      },
      contact: {
        phone: "(555) 123-4567",
        email: "info@elegantgarden.com",
        website: "www.elegantgarden.com",
      },
    },
    "2": {
      id: "2",
      name: "Modern Rooftop Space",
      location: "Manhattan, NY",
      address: "456 Sky Tower, Manhattan, NY 10001",
      priceEnum: PriceEnum.LUXURY,
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519225468359-69df964e5663?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
      ],
      category: "Corporate Events",
      capacity: 200,
      description:
        "Stunning rooftop venue with panoramic city views, perfect for corporate events and upscale celebrations.",
      longDescription:
        "Experience the ultimate in urban sophistication at our Modern Rooftop Space. Located in the heart of Manhattan, this contemporary venue offers breathtaking 360-degree views of the city skyline. With floor-to-ceiling windows, sleek modern design, and state-of-the-art amenities, it's the perfect setting for corporate events, product launches, and elegant celebrations.",
      rating: 4.9,
      reviews: 89,
      amenities: [
        { name: "360-degree city views", icon: Camera },
        { name: "Climate controlled", icon: Users },
        { name: "AV equipment included", icon: Music },
        { name: "Full bar service", icon: Utensils },
        { name: "Valet parking", icon: Car },
        { name: "High-speed WiFi", icon: Wifi },
      ],
      features: [
        "Floor-to-ceiling windows",
        "Professional sound system",
        "LED lighting system",
        "Outdoor terrace access",
        "Executive lounge",
        "Dedicated event coordinator",
      ],
      policies: [
        "Booking requires 60% deposit",
        "Cancellation policy: 45 days notice",
        "Setup begins 6 hours before event",
        "Events must end by 11 PM",
        "Security deposit required",
        "Professional catering required",
      ],
      availability: {
        "2024-02-15": true,
        "2024-02-16": true,
        "2024-02-17": false,
        "2024-02-18": true,
      },
      contact: {
        phone: "(555) 987-6543",
        email: "events@modernrooftop.com",
        website: "www.modernrooftop.com",
      },
    },
  };

  return venues[id as keyof typeof venues] || null;
};

export default function VenueDetailPage() {
  const params = useParams();
  const venue = getVenueById(params.id as string);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();

  if (!venue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Info className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Venue Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The venue you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/venues">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse All Venues
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: venue.id,
      name: venue.name,
      image: venue.images[0],
      type: "venue",
      quantity: 1,
    });
    toast.success("Added to cart!");
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("Please log in to add favorites");
      return;
    }

    if (isFavorite(venue.id)) {
      removeFromFavorites(venue.id);
      toast.success("Removed from favorites");
    } else {
      addToFavorites({
        id: venue.id,
        name: venue.name,
        image: venue.images[0],
        type: "venue",
      });
      toast.success("Added to favorites!");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + venue.images.length) % venue.images.length,
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const isFav = isFavorite(venue.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] bg-muted overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background z-10" />
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          src={venue.images[currentImageIndex]}
          alt={venue.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gallery Navigation */}
        <div className="absolute inset-0 z-20 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevImage}
            className="text-white hover:bg-black/40 hover:text-white rounded-full h-12 w-12"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextImage}
            className="text-white hover:bg-black/40 hover:text-white rounded-full h-12 w-12"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        <div className="container mx-auto px-4 h-full relative z-20 flex flex-col justify-between py-8">
          <div className="flex justify-between items-start">
            <Button
              variant="ghost"
              asChild
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/venues">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Venues
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
                  isFav ? "text-red-500 hover:text-red-400" : "text-white hover:text-white"
                )}
                onClick={handleToggleFavorite}
              >
                <Heart className={cn("h-5 w-5", isFav && "fill-current")} />
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
                <Badge className="mb-3 bg-primary/90 hover:bg-primary text-primary-foreground border-none">
                  {venue.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                  {venue.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/90">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {venue.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    Up to {venue.capacity} guests
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{venue.rating}</span>
                    <span className="opacity-75">({venue.reviews} reviews)</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex gap-2 mb-2">
              {venue.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    currentImageIndex === idx ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About this Venue</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {venue.longDescription}
              </p>
            </section>

            {/* Tabs for Additional Information */}
            <Tabs defaultValue="amenities" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6 mb-6">
                <TabsTrigger
                  value="amenities"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-base"
                >
                  Amenities
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-base"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="policies"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-base"
                >
                  Policies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="amenities" className="animate-in fade-in-50 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {venue.amenities.map((amenity, index) => {
                    const IconComponent = amenity.icon;
                    return (
                      <Card key={index} className="border-none shadow-sm bg-secondary/30">
                        <CardContent className="p-4 flex items-center space-x-3">
                          <div className="p-2 bg-background rounded-full shadow-sm">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium">{amenity.name}</span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="features" className="animate-in fade-in-50 duration-300">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                      {venue.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies" className="animate-in fade-in-50 duration-300">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    {venue.policies.map((policy, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{policy}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Location Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>{venue.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-118.4004,34.0736,14,0/800x400?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2xsZXh4aGUwMG9nMndwNjF4eW54eW54In0.7b-8-9-0')] bg-cover bg-center opacity-50" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <MapPin className="h-10 w-10 text-primary animate-bounce" />
                    <Button variant="secondary" size="sm">
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-lg border-t-4 border-t-primary overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">Starting from</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-primary">
                        {getPriceDisplay(venue.priceEnum)}
                      </span>
                      <span className="text-sm text-muted-foreground block">per event</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Select Date
                    </label>
                    <div className="border rounded-md p-2 bg-background">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md w-full flex justify-center"
                        disabled={(date) => {
                          const dateStr = date.toISOString().split("T")[0];
                          return (
                            (venue.availability as Record<string, boolean>)[
                            dateStr
                            ] === false
                          );
                        }}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button className="w-full h-12 text-base shadow-md" onClick={handleAddToCart}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        Request Quote
                      </Button>
                      <Button variant="outline" className="w-full">
                        Schedule Tour
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" />
                    Secure booking powered by Planero
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Venue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{venue.contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{venue.contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Website</p>
                      <p className="text-sm font-medium truncate max-w-[180px]">{venue.contact.website}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

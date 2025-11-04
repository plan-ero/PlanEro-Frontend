"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
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
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";
import Link from "next/link";
import { getPriceDisplay, PriceEnum } from "@/lib/utils";

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
        "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
        "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
        "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
        "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
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
        { name: "Sound system", icon: Users },
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
        "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
        "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
        "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
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
        { name: "AV equipment included", icon: Users },
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

  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();

  if (!venue) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Venue Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The venue you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/venues">Browse All Venues</Link>
          </Button>
        </div>
      </main>
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

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/venues" className="hover:text-primary">
            Venues
          </Link>
          <span>/</span>
          <span className="text-foreground">{venue.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <img
                src={venue.images[currentImageIndex] || "/placeholder.svg"}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              {venue.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {venue.images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-hidden">
                {venue.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${venue.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Venue Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {venue.category}
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {venue.address}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-current text-yellow-500 mr-1" />
                    <span className="font-medium">{venue.rating}</span>
                    <span className="text-muted-foreground ml-1">
                      ({venue.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    Up to {venue.capacity} guests
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleFavorite}
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite(venue.id) ? "fill-current text-red-500" : ""}`}
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              {venue.longDescription}
            </p>

            {/* Tabs for Additional Information */}
            <Tabs defaultValue="amenities" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
              </TabsList>

              <TabsContent value="amenities" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {venue.amenities.map((amenity, index) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <IconComponent className="h-5 w-5 text-primary" />
                        <span>{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {venue.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="policies" className="mt-6">
                <div className="space-y-3">
                  {venue.policies.map((policy, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2" />
                      <span className="text-sm">{policy}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="text-3xl font-bold mb-2">
                  {getPriceDisplay(venue.priceEnum)}
                  <span className="text-lg font-normal text-muted-foreground ml-2">
                    / event
                  </span>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
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

              {/* Contact Information */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {venue.contact.phone}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {venue.contact.email}
                  </div>
                  <div>
                    <span className="font-medium">Website:</span>{" "}
                    {venue.contact.website}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  Request Quote
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  Schedule Tour
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

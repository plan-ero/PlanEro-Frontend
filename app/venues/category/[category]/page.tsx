"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ShoppingCart,
  MapPin,
  Users,
  Star,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";
import Link from "next/link";
import { getPriceDisplay } from "@/lib/utils";

// Mock venues data organized by category
const venuesByCategory: Record<string, any[]> = {
  "wedding-venues": [
    {
      id: "1",
      name: "Elegant Garden Venue",
      location: "Beverly Hills, CA",
      price: 5000,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Wedding Venues",
      capacity: 150,
      rating: 4.8,
      description:
        "Beautiful outdoor garden venue perfect for intimate weddings",
    },
    {
      id: "3",
      name: "Historic Ballroom",
      location: "Chicago, IL",
      price: 6500,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Wedding Venues",
      capacity: 300,
      rating: 4.9,
      description: "Grand historic ballroom with vintage charm",
    },
    {
      id: "5",
      name: "Lakeside Pavilion",
      location: "Austin, TX",
      price: 4200,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Wedding Venues",
      capacity: 120,
      rating: 4.7,
      description: "Romantic lakeside venue with stunning sunset views",
    },
    {
      id: "6",
      name: "Mountain Resort",
      location: "Aspen, CO",
      price: 8900,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Wedding Venues",
      capacity: 200,
      rating: 4.9,
      description: "Luxury mountain resort perfect for destination weddings",
    },
  ],
  "corporate-events": [
    {
      id: "2",
      name: "Modern Rooftop Space",
      location: "Manhattan, NY",
      price: 8000,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Corporate Events",
      capacity: 200,
      rating: 4.6,
      description: "Stunning rooftop venue with panoramic city views",
    },
    {
      id: "7",
      name: "Tech Conference Center",
      location: "San Francisco, CA",
      price: 6800,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Corporate Events",
      capacity: 500,
      rating: 4.8,
      description: "State-of-the-art facility with cutting-edge technology",
    },
    {
      id: "8",
      name: "Executive Boardroom",
      location: "Seattle, WA",
      price: 3200,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Corporate Events",
      capacity: 50,
      rating: 4.7,
      description: "Intimate boardroom perfect for executive meetings",
    },
  ],
  "birthday-parties": [
    {
      id: "9",
      name: "Fun Zone Party Center",
      location: "Orlando, FL",
      price: 1200,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Birthday Parties",
      capacity: 80,
      rating: 4.5,
      description: "Kid-friendly venue with games and entertainment",
    },
    {
      id: "10",
      name: "Backyard Paradise",
      location: "Phoenix, AZ",
      price: 800,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Birthday Parties",
      capacity: 60,
      rating: 4.4,
      description: "Private backyard space perfect for outdoor celebrations",
    },
  ],
  "special-occasions": [
    {
      id: "11",
      name: "Grand Event Hall",
      location: "Las Vegas, NV",
      price: 5500,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Special Occasions",
      capacity: 250,
      rating: 4.8,
      description: "Elegant hall perfect for anniversaries and celebrations",
    },
  ],
  "social-gatherings": [
    {
      id: "12",
      name: "Community Center",
      location: "Portland, OR",
      price: 900,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Social Gatherings",
      capacity: 100,
      rating: 4.3,
      description: "Affordable space for family reunions and gatherings",
    },
  ],
  "formal-events": [
    {
      id: "13",
      name: "Luxury Hotel Ballroom",
      location: "New York, NY",
      price: 12000,
      image:
        "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
      category: "Formal Events",
      capacity: 400,
      rating: 4.9,
      description: "Opulent ballroom for the most sophisticated events",
    },
  ],
};

const categoryNames: Record<string, string> = {
  "wedding-venues": "Wedding Venues",
  "corporate-events": "Corporate Events",
  "birthday-parties": "Birthday Parties",
  "special-occasions": "Special Occasions",
  "social-gatherings": "Social Gatherings",
  "formal-events": "Formal Events",
};

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.category as string;
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();

  const venues = venuesByCategory[categoryId] || [];
  const categoryName = categoryNames[categoryId] || "Unknown Category";

  const handleAddToCart = (venue: any) => {
    addItem({
      id: venue.id,
      name: venue.name,
      price: venue.price,
      image: venue.image,
      type: "venue",
      quantity: 1,
    });
    toast.success("Added to cart!");
  };

  const handleToggleFavorite = (venue: any) => {
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
        price: venue.price,
        image: venue.image,
        type: "venue",
      });
      toast.success("Added to favorites!");
    }
  };

  if (venues.length === 0) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The category you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/">Go Back Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="py-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
            <p className="text-muted-foreground text-lg">
              {venues.length} venue{venues.length !== 1 ? "s" : ""} available
            </p>
          </motion.div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {venues.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                <div className="relative">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-3 right-3 bg-white/90 hover:bg-white ${
                      isFavorite(venue.id) ? "text-red-500" : "text-gray-600"
                    }`}
                    onClick={() => handleToggleFavorite(venue)}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite(venue.id) ? "fill-current" : ""}`}
                    />
                  </Button>

                  {/* Rating */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {venue.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      {venue.category}
                    </span>
                  </div>

                  <Link href={`/venues/${venue.id}`}>
                    <h3 className="font-bold text-xl mb-2 hover:text-primary transition-colors group-hover:text-primary">
                      {venue.name}
                    </h3>
                  </Link>

                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{venue.location}</span>
                  </div>

                  <div className="flex items-center text-muted-foreground mb-3">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      Up to {venue.capacity} guests
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {venue.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">
                        {venue.priceEnum ? getPriceDisplay(venue.priceEnum) : 
                         venue.price ? `₹${venue.price.toLocaleString()}` : "Price on request"}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        / event
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(venue)}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

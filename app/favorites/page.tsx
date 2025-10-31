"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (item: (typeof favorites)[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      type: item.type,
      quantity: 1,
    });
    toast.success("Added to cart!");
  };

  const handleRemoveFromFavorites = (id: string) => {
    removeFromFavorites(id);
    toast.success("Removed from favorites");
  };

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
          <p className="text-muted-foreground mb-8">
            You need to be logged in to view your favorites.
          </p>
          <Button asChild>
            <Link href="/auth/signin">Log In</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (favorites.length === 0) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Favorites Yet</h1>
          <p className="text-muted-foreground mb-8">
            Start adding venues and services to your favorites!
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/venues">Browse Venues</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/services">Browse Services</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Favorites</h1>
        <p className="text-lg text-muted-foreground">
          {favorites.length} item{favorites.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
                  onClick={() => handleRemoveFromFavorites(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {item.type}
                  </span>
                </div>
                <Link href={`/${item.type}s/${item.id}`}>
                  <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-lg font-bold">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      / event
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item)}
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
    </main>
  );
}

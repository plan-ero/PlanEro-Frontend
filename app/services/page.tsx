"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Filters, FilterState } from "@/components/filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, MapPin, Star } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import Link from "next/link"

// Mock data - replace with actual API calls
const services = [
  {
    id: "1",
    name: "Elite Wedding Photography",
    category: "photographers",
    location: "Los Angeles, CA",
    price: 2500,
    image: "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    description: "Award-winning wedding photography with artistic flair",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: "2",
    name: "Gourmet Catering Co.",
    category: "caterers",
    location: "San Francisco, CA",
    price: 85,
    priceUnit: "per person",
    image: "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    description: "Farm-to-table catering with seasonal menus",
    rating: 4.8,
    reviews: 203,
  },
]

const categories = [
  { value: "all", label: "All Services" },
  { value: "photographers", label: "Photographers" },
  { value: "caterers", label: "Caterers" },
  { value: "musicians", label: "Musicians & DJs" },
  { value: "florists", label: "Florists" },
  { value: "transportation", label: "Transportation" },
  { value: "bakers", label: "Bakers" },
]

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterCategory, setFilterCategory] = useState("all")

  const { addItem } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { user } = useAuth()

  const handleAddToCart = (service: (typeof services)[0]) => {
    addItem({
      id: service.id,
      name: service.name,
      price: service.price,
      image: service.image,
      type: "service",
      quantity: 1,
    })
    toast.success("Added to cart!")
  }

  const handleToggleFavorite = (service: (typeof services)[0]) => {
    if (!user) {
      toast.error("Please log in to add favorites")
      return
    }

    if (isFavorite(service.id)) {
      removeFromFavorites(service.id)
      toast.success("Removed from favorites")
    } else {
      addToFavorites({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image,
        type: "service",
      })
      toast.success("Added to favorites!")
    }
  }

  return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Professional Services</h1>
          <p className="text-lg text-muted-foreground">
            Connect with top-rated professionals to make your event perfect
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value || "All Categories"}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Clear Filters</Button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${
                      isFavorite(service.id) ? "text-red-500" : "text-gray-600"
                    }`}
                    onClick={() => handleToggleFavorite(service)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(service.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">{service.category}</span>
                  </div>
                  <Link href={`/services/${service.id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">{service.name}</h3>
                  </Link>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {service.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Star className="h-4 w-4 mr-1 fill-current text-yellow-500" />
                    {service.rating} ({service.reviews} reviews)
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">${service.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground ml-1">{service.priceUnit || "/ event"}</span>
                    </div>
                    <Button size="sm" onClick={() => handleAddToCart(service)} className="flex items-center gap-2">
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
  )
}

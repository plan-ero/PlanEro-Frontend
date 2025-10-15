"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Camera,
  Music,
  Mic,
  Palette,
  Car,
  ChefHat,
  Flower,
  Cake,
  MapPin,
  Wand2,
  Volume2,
  Crown,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Vendor categories with their details
const vendorCategories = [
  {
    id: "venues",
    name: "Venues",
    description: "Event spaces & locations",
    icon: MapPin,
    color: "from-blue-500/20 to-indigo-500/20",
    hoverColor: "from-blue-500 to-indigo-500",
  },
  {
    id: "magician",
    name: "Magician",
    description: "Entertainment & magic shows",
    icon: Wand2,
    color: "from-purple-500/20 to-violet-500/20",
    hoverColor: "from-purple-500 to-violet-500",
  },
  {
    id: "dj",
    name: "DJ",
    description: "Music & sound systems",
    icon: Volume2,
    color: "from-red-500/20 to-pink-500/20",
    hoverColor: "from-red-500 to-pink-500",
  },
  {
    id: "wedding-bands",
    name: "Wedding Bands",
    description: "Live music performances",
    icon: Music,
    color: "from-green-500/20 to-emerald-500/20",
    hoverColor: "from-green-500 to-emerald-500",
  },
  {
    id: "singer",
    name: "Singer",
    description: "Vocal performances",
    icon: Mic,
    color: "from-yellow-500/20 to-orange-500/20",
    hoverColor: "from-yellow-500 to-orange-500",
  },
  {
    id: "anchor",
    name: "Anchor",
    description: "Event hosting & MC services",
    icon: Crown,
    color: "from-amber-500/20 to-yellow-500/20",
    hoverColor: "from-amber-500 to-yellow-500",
  },
  {
    id: "photographer",
    name: "Photographer",
    description: "Professional photography",
    icon: Camera,
    color: "from-teal-500/20 to-cyan-500/20",
    hoverColor: "from-teal-500 to-cyan-500",
  },
  {
    id: "decorator",
    name: "Decorator",
    description: "Event decoration & styling",
    icon: Palette,
    color: "from-pink-500/20 to-rose-500/20",
    hoverColor: "from-pink-500 to-rose-500",
  },
  {
    id: "transportation",
    name: "Transportation",
    description: "Travel & logistics",
    icon: Car,
    color: "from-blue-600/20 to-blue-400/20",
    hoverColor: "from-blue-600 to-blue-400",
  },
  {
    id: "caterers",
    name: "Caterers",
    description: "Food & catering services",
    icon: ChefHat,
    color: "from-orange-500/20 to-red-500/20",
    hoverColor: "from-orange-500 to-red-500",
  },
  {
    id: "florists",
    name: "Florists",
    description: "Flowers & arrangements",
    icon: Flower,
    color: "from-green-400/20 to-pink-400/20",
    hoverColor: "from-green-400 to-pink-400",
  },
  {
    id: "bakers",
    name: "Bakers",
    description: "Cakes & desserts",
    icon: Cake,
    color: "from-amber-400/20 to-pink-400/20",
    hoverColor: "from-amber-400 to-pink-400",
  },
];

export function VendorsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary font-medium text-sm">
              VERIFIED PROFESSIONALS
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Find Trusted Vendors
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Connect with verified service providers across all categories. From
            photographers to caterers, find the perfect team for your event.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
          {vendorCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/services?category=${category.id}`}>
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer h-full border border-border shadow-lg bg-card hover:bg-muted/50">
                  <CardContent className="p-6 flex flex-col h-full text-center relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.hoverColor}`}
                      ></div>
                    </div>

                    {/* Icon Container */}
                    <div
                      className={`relative mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-current/20`}
                    >
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.hoverColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      ></div>
                      <category.icon className="h-8 w-8 text-foreground group-hover:text-white drop-shadow-sm relative z-10" />

                      {/* Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-xs line-clamp-2 group-hover:text-muted-foreground/80">
                      {category.description}
                    </p>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-2 hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href="/services">
                <Users className="h-5 w-5 mr-2" />
                Browse All Vendors
              </Link>
            </Button>

            <Button
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href="/vendor/onboarding">
                <Crown className="h-5 w-5 mr-2" />
                Become a Vendor
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

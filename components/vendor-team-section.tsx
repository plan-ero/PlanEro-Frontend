"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Camera,
  ChefHat,
  Flower,
  Car,
  Cake,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const vendorTeam = [
  {
    id: "photo-videographer",
    name: "Photo & Videographer",
    icon: Camera,
    description: "Professional photography and videography services",
    count: "300+ professionals",
    href: "/services/photo-videographer",
    image:
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "decorator",
    name: "Decorator",
    icon: Sparkles,
    description: "Event decoration and styling experts",
    count: "250+ decorators",
    href: "/services/decorator",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "florist",
    name: "Florist",
    icon: Flower,
    description: "Beautiful floral arrangements and designs",
    count: "180+ florists",
    href: "/services/florist",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "caterer",
    name: "Caterer",
    icon: ChefHat,
    description: "Culinary excellence for your special events",
    count: "220+ caterers",
    href: "/services/caterer",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-orange-500 to-red-600",
  },
  {
    id: "baker",
    name: "Baker",
    icon: Cake,
    description: "Custom cakes and dessert creations",
    count: "150+ bakers",
    href: "/services/baker",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: Car,
    description: "Luxury transportation and vehicle services",
    count: "120+ providers",
    href: "/services/transportation",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-slate-500 to-gray-600",
  },
];

export function VendorTeamSection() {
  return (
    <section className="py-20 bg-background">
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
              BUILD YOUR TEAM
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Build Your Vendor Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Assemble the perfect team of professionals for your event. From
            photographers to caterers, find all the vendors you need in one
            place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendorTeam.map((vendor, index) => {
            const IconComponent = vendor.icon;
            return (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 h-full shadow-lg bg-card/80 hover:bg-card/95 hover:backdrop-blur-xl overflow-hidden relative border border-border/50 hover:border-primary/30">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 group-hover:opacity-40 transition-all duration-500"
                    style={{ backgroundImage: `url(${vendor.image})` }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${vendor.color} opacity-0 group-hover:opacity-30 transition-all duration-500`}
                  />

                  {/* Backdrop Blur Overlay */}
                  <div className="absolute inset-0 bg-background/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <CardContent className="p-8 text-center relative z-10">
                    {/* Icon Container */}
                    <div className="mb-6 relative">
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg relative backdrop-blur-sm group-hover:backdrop-blur-xl">
                        <IconComponent className="h-10 w-10 text-primary group-hover:scale-110 transition-all duration-300" />

                        {/* Glow Effect */}
                        <div
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${vendor.color} opacity-0 group-hover:opacity-30 transition-all duration-500`}
                        />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {vendor.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed line-clamp-2">
                      {vendor.description}
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-3 py-1 mb-6 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <p className="text-sm text-primary font-semibold">
                        {vendor.count}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      asChild
                      className="w-full bg-transparent border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 py-3 font-semibold hover:backdrop-blur-xl"
                    >
                      <Link href={vendor.href}>
                        Find {vendor.name}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            asChild
            className="px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Link href="/services">
              Browse All Vendors
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

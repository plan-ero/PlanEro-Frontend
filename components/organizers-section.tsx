"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Briefcase,
  Trophy,
  ArrowRight,
  Star,
} from "lucide-react";

const organizers = [
  {
    id: "wedding-organizer",
    name: "Wedding Organizer",
    icon: Heart,
    description: "Complete wedding planning and coordination services",
    features: [
      "Full event planning",
      "Vendor coordination",
      "Timeline management",
    ],
    rating: 4.9,
    count: "150+ organizers",
    href: "/services/wedding-organizer",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "destination-organizer",
    name: "Destination Organizer",
    icon: MapPin,
    description: "Specialized in destination weddings and events",
    features: [
      "Location scouting",
      "Travel arrangements",
      "Local vendor network",
    ],
    rating: 4.8,
    count: "80+ organizers",
    href: "/services/destination-organizer",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "corporate-organizer",
    name: "Corporate Organizer",
    icon: Briefcase,
    description: "Professional corporate event planning",
    features: ["Business meetings", "Team building", "Conference planning"],
    rating: 4.7,
    count: "120+ organizers",
    href: "/services/corporate-organizer",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-slate-500 to-gray-600",
  },
  {
    id: "exhibition-organizer",
    name: "Exhibition Organizer",
    icon: Trophy,
    description: "Trade shows and exhibition management",
    features: ["Booth design", "Event logistics", "Attendee management"],
    rating: 4.6,
    count: "60+ organizers",
    href: "/services/exhibition-organizer",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-amber-500 to-orange-600",
  },
];

export function OrganizersSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
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
              EXPERT ORGANIZERS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Professional Event Organizers
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            Let our experienced event organizers handle every detail of your
            special occasion. From intimate weddings to large corporate events,
            we ensure perfection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {organizers.map((organizer, index) => {
            const IconComponent = organizer.icon;
            return (
              <motion.div
                key={organizer.id}
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
                    style={{ backgroundImage: `url(${organizer.image})` }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${organizer.color} opacity-0 group-hover:opacity-30 transition-all duration-500`}
                  />

                  {/* Backdrop Blur Overlay */}
                  <div className="absolute inset-0 bg-background/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      {/* Icon Container */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg relative backdrop-blur-sm group-hover:backdrop-blur-xl">
                          <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary group-hover:scale-110 transition-all duration-300" />

                          {/* Glow Effect */}
                          <div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${organizer.color} opacity-0 group-hover:opacity-30 transition-all duration-500`}
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold group-hover:text-primary transition-colors duration-300">
                            {organizer.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs sm:text-sm font-semibold">
                              {organizer.rating}
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2">
                          {organizer.description}
                        </p>

                        <div className="mb-4">
                          <ul className="space-y-1">
                            {organizer.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-center text-xs sm:text-sm text-muted-foreground"
                              >
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full mr-2"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-2 sm:px-3 py-1 backdrop-blur-sm">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"></div>
                            <p className="text-xs sm:text-sm text-primary font-semibold">
                              {organizer.count}
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            asChild
                            size="sm"
                            className="bg-transparent border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 font-semibold hover:backdrop-blur-xl text-xs sm:text-sm"
                          >
                            <Link href={organizer.href}>
                              Learn More
                              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            asChild
            className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Link href="/services/organizers">
              View All Organizers
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

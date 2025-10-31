"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import {
  Heart,
  MapPin,
  Briefcase,
  Trophy,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary font-medium text-sm">
              PROFESSIONAL EVENT PLANNERS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your Celebration, Perfectly Planned
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            Let our experienced event planners handle every detail of your
            special occasion. From intimate weddings to large corporate events,
            we ensure perfection.
          </p>
        </motion.div>

        {/* Horizontal Scrolling Container with Buttons */}
        <div className="relative flex items-center gap-4">
          {/* Left Navigation Button - Always Visible */}
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0 h-12 w-12 rounded-full bg-background/95 backdrop-blur-sm shadow-xl border-2 hover:bg-background hover:scale-110 transition-all z-20"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Card Strip Container - Reduced Width */}
          <div className="relative flex-1 overflow-hidden">
            <div 
              ref={scrollContainerRef} 
              className="overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              onWheel={(e) => e.preventDefault()}
              style={{ overscrollBehavior: 'contain' }}
            >
              <div className="flex gap-6 px-4">
              {organizers.map((organizer, index) => {
                const IconComponent = organizer.icon;
                return (
                  <motion.div
                    key={organizer.id}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-80"
                  >
                    <Card className="group/card hover:shadow-2xl transition-all duration-500 h-full shadow-lg overflow-hidden border border-border/50 hover:border-primary/50 cursor-pointer">
                      <Link href={organizer.href}>
                        {/* Image Card - Prominent Image Display */}
                        <div className="relative h-64 overflow-hidden">
                          <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 group-hover/card:scale-110"
                            style={{ backgroundImage: `url(${organizer.image})` }}
                          />
                          {/* Subtle gradient overlay for text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                          {/* Icon Badge on Image */}
                          <div className="absolute top-4 left-4 w-12 h-12 bg-card/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-all duration-300">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>

                          {/* Rating Badge */}
                          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold text-foreground">
                              {organizer.rating}
                            </span>
                          </div>
                        </div>

                        {/* Content Below Image */}
                        <CardContent className="p-6 bg-card">
                          <h3 className="text-xl font-bold mb-2 group-hover/card:text-primary transition-colors duration-300">
                            {organizer.name}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                            {organizer.description}
                          </p>

                          {/* Features */}
                          <div className="mb-4">
                            <ul className="space-y-1">
                              {organizer.features.map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center text-xs text-muted-foreground"
                                >
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Count Badge */}
                          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-3 py-1 mb-4 backdrop-blur-sm">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <p className="text-xs text-primary font-semibold">
                              {organizer.count}
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            className="w-full bg-transparent border-2 group-hover/card:bg-primary group-hover/card:text-primary-foreground group-hover/card:border-primary transition-all duration-300"
                          >
                            Learn More
                            <ArrowRight className="h-4 w-4 ml-2 group-hover/card:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </CardContent>
                      </Link>
                    </Card>
                  </motion.div>
                );
              })}
              </div>
            </div>
          </div>

          {/* Right Navigation Button - Always Visible */}
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0 h-12 w-12 rounded-full bg-background/95 backdrop-blur-sm shadow-xl border-2 hover:bg-background hover:scale-110 transition-all z-20"
            onClick={scrollRight}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <motion.div
          className="text-center mt-12"
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

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

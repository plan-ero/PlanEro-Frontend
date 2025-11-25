"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TransitionLink } from "@/components/transition-link";
import { useRef } from "react";
import { useReducedMotion, getMotionProps } from "@/hooks/use-reduced-motion";
import {
  TreePine,
  Building2,
  Sprout,
  Tractor,
  Briefcase,
  Heart,
  Cake,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const categories = [
  {
    id: "garden",
    name: "Garden",
    icon: TreePine,
    description: "Beautiful outdoor garden venues",
    count: "200+ venues",
    href: "/venues?category=garden",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "banquet-hall",
    name: "Banquet Hall",
    icon: Building2,
    description: "Elegant indoor banquet halls",
    count: "150+ venues",
    href: "/venues?category=banquet-hall",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "lawns",
    name: "Lawns",
    icon: Sprout,
    description: "Spacious lawn areas for events",
    count: "180+ venues",
    href: "/venues?category=lawns",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-lime-500 to-green-600",
  },
  {
    id: "farmhouse",
    name: "Farmhouse",
    icon: Tractor,
    description: "Charming farmhouse venues",
    count: "120+ venues",
    href: "/venues?category=farmhouse",
    image:
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "corporate",
    name: "Corporate Venues",
    icon: Briefcase,
    description: "Professional corporate venues",
    count: "90+ venues",
    href: "/venues?category=corporate",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-slate-500 to-gray-600",
  },
  {
    id: "engagement",
    name: "Engagement",
    icon: Heart,
    description: "Romantic venues for celebrations",
    count: "160+ venues",
    href: "/venues?category=engagement",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "birthday",
    name: "Birthday",
    icon: Cake,
    description: "Fun venues for birthday parties",
    count: "140+ venues",
    href: "/venues?category=birthday",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-purple-500 to-violet-600",
  },
];

export function CategoriesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

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
    <section className="py-10 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          {...getMotionProps(shouldReduceMotion, {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
            viewport: { once: true },
          })}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary font-medium text-sm">
              EVENT CATEGORIES
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Find Your Perfect Venue
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover venues tailored to your event type. From intimate garden
            settings to grand banquet halls, find the perfect backdrop for your
            special occasion.
          </p>
        </motion.div>

        {/* Horizontal Scrolling Container with Buttons */}
        <div className="relative flex items-center gap-4">
          {/* Left Navigation Button - Hidden on Mobile */}
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex flex-shrink-0 h-12 w-12 rounded-full bg-background/95 backdrop-blur-sm shadow-xl border-2 hover:bg-background hover:scale-110 transition-all z-20"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Card Strip Container - Mobile Scrollable */}
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              style={{
                overscrollBehavior: "contain auto",
                touchAction: "pan-x pan-y",
              }}
            >
              <div className="flex gap-6 px-4">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <motion.div
                      key={category.id}
                      {...getMotionProps(shouldReduceMotion, {
                        initial: { opacity: 0, x: 50 },
                        whileInView: { opacity: 1, x: 0 },
                        transition: { duration: 0.6, delay: index * 0.1 },
                        viewport: { once: true },
                      })}
                      className="flex-shrink-0 w-80"
                    >
                      <Card className="group/card hover:shadow-2xl transition-all duration-500 h-full shadow-lg overflow-hidden border border-border/50 hover:border-primary/50 cursor-pointer">
                        <TransitionLink href={category.href}>
                          {/* Image Card - Prominent Image Display */}
                          <div className="relative h-64 overflow-hidden">
                            <div
                              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 group-hover/card:scale-110"
                              style={{
                                backgroundImage: `url(${category.image})`,
                              }}
                            />
                            {/* Subtle gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                            {/* Icon Badge on Image */}
                            <div className="absolute top-4 left-4 w-12 h-12 bg-card/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-all duration-300">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>

                            {/* Count Badge */}
                            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                              <p className="text-xs font-semibold text-foreground">
                                {category.count}
                              </p>
                            </div>
                          </div>

                          {/* Content Below Image */}
                          <CardContent className="p-6 bg-card">
                            <h3 className="text-xl font-bold mb-2 group-hover/card:text-primary transition-colors duration-300">
                              {category.name}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                              {category.description}
                            </p>

                            <Button
                              variant="outline"
                              className="hidden md:flex w-full bg-transparent border-2 group-hover/card:bg-primary group-hover/card:text-primary-foreground group-hover/card:border-primary transition-all duration-300"
                            >
                              Explore {category.name}
                              <ArrowRight className="h-4 w-4 ml-2 group-hover/card:translate-x-1 transition-transform duration-300" />
                            </Button>
                          </CardContent>
                        </TransitionLink>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Navigation Button - Hidden on Mobile */}
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex flex-shrink-0 h-12 w-12 rounded-full bg-background/95 backdrop-blur-sm shadow-xl border-2 hover:bg-background hover:scale-110 transition-all z-20"
            onClick={scrollRight}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <motion.div
          className="text-center mt-12"
          {...getMotionProps(shouldReduceMotion, {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            transition: { delay: 0.5, duration: 0.8 },
            viewport: { once: true },
          })}
        >
          <Button
            size="lg"
            asChild
            className="px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <TransitionLink href="/venues">
              View All Venues
              <ArrowRight className="h-5 w-5 ml-2" />
            </TransitionLink>
          </Button>
        </motion.div>
      </div>


    </section>
  );
}

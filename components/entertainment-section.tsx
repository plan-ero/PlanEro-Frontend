"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Music, Disc, Mic, Mic2, Wand2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const entertainment = [
  {
    id: "wedding-band",
    name: "Wedding Band",
    icon: Music,
    description: "Live music bands for wedding ceremonies",
    count: "80+ bands",
    href: "/services/wedding-band",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "dj",
    name: "DJ",
    icon: Disc,
    description: "Professional DJs for all event types",
    count: "150+ DJs",
    href: "/services/dj",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "singer",
    name: "Singer",
    icon: Mic,
    description: "Solo singers and vocal performers",
    count: "120+ singers",
    href: "/services/singer",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "anchor",
    name: "Anchor",
    icon: Mic2,
    description: "Event hosts and emcees",
    count: "90+ anchors",
    href: "/services/anchor",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "magician",
    name: "Magician",
    icon: Wand2,
    description: "Magicians and illusionists",
    count: "60+ magicians",
    href: "/services/magician",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-amber-500 to-orange-600",
  },
];

export function EntertainmentSection() {
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
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
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
              ENTERTAINMENT
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Make Every Moment Unforgettable
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Add excitement and joy to your event with our talented entertainers.
            From live bands to magicians, create unforgettable moments.
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
              {entertainment.map((entertainer, index) => {
                const IconComponent = entertainer.icon;
                return (
                  <motion.div
                    key={entertainer.id}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-80"
                  >
                    <Card className="group/card hover:shadow-2xl transition-all duration-500 h-full shadow-lg overflow-hidden border border-border/50 hover:border-primary/50 cursor-pointer">
                      <Link href={entertainer.href}>
                        {/* Image Card - Prominent Image Display */}
                        <div className="relative h-64 overflow-hidden">
                          <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 group-hover/card:scale-110"
                            style={{ backgroundImage: `url(${entertainer.image})` }}
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
                              {entertainer.count}
                            </p>
                          </div>
                        </div>

                        {/* Content Below Image */}
                        <CardContent className="p-6 bg-card">
                          <h3 className="text-xl font-bold mb-2 group-hover/card:text-primary transition-colors duration-300">
                            {entertainer.name}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            {entertainer.description}
                          </p>

                          <Button
                            variant="outline"
                            className="w-full bg-transparent border-2 group-hover/card:bg-primary group-hover/card:text-primary-foreground group-hover/card:border-primary transition-all duration-300"
                          >
                            Book Now
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
            className="px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Link href="/services/entertainment">
              View All Entertainment
              <ArrowRight className="h-5 w-5 ml-2" />
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

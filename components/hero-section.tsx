"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    alt: "Elegant wedding celebration",
    topText: "discover",
    mainText: "DREAM VENUES",
    link: "/venues",
  },
  {
    src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    alt: "Beautiful event decoration",
    topText: "find",
    mainText: "PERFECT VENDORS",
    link: "/vendors",
  },
  {
    src: "https://images.unsplash.com/photo-1542332213-31f87348057f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    alt: "Romantic venue setup",
    topText: "explore",
    mainText: "STUNNING DECORATIONS",
    link: "/services?type=DECORATOR",
  },
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    alt: "Vibrant event entertainment",
    topText: "experience",
    mainText: "LIVE ENTERTAINMENT",
    link: "/services?type=DJ",
  },
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function HeroSection() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (href: string) => {
    if (!document.startViewTransition) {
      router.push(href);
      return;
    }
    document.startViewTransition(async () => {
      router.push(href);
      await sleep(50);
    });
  };

  return (
    <section className="relative -mt-16">
      {/* Rotating Background Images with Simple Fade Effect */}
      {/* Rotating Background Images with Cross-Fade Effect */}
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] bg-black overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              fill
              priority={currentImageIndex === 0}
              quality={90}
              className="object-cover brightness-110 contrast-105"
              sizes="100vw"
            />
            {/* Gradient overlay for better text contrast and premium feel */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </motion.div>
        </AnimatePresence>

        {/* Text Overlay on Image */}
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer group z-10 px-4"
          onClick={() => handleNavigation(heroImages[currentImageIndex].link)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center group-hover:scale-105 transition-transform duration-300 max-w-4xl mx-auto"
            >
              {/* Dynamic Top Text */}
              <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.3em] text-white/90 mb-2 sm:mb-4 font-medium uppercase drop-shadow-md">
                {heroImages[currentImageIndex].topText}
              </p>

              {/* Dynamic Main Heading */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-lg mb-2">
                {heroImages[currentImageIndex].mainText}
              </h1>

              {/* Click indicator */}
              <p className="text-xs text-white/80 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Click to explore
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Card - Positioned at boundary */}
      <div className="relative -mt-16 sm:-mt-24 z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="bg-card/95 backdrop-blur-md border border-border/50 text-center rounded-xl shadow-2xl p-5 sm:p-8">
            <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
              Plan Your Dream Event
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              Weddings, galas, birthdays, and more. Find venues, vendors, and
              ideas you can't find anywhere else.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="default"
                className="w-full sm:w-auto px-6 py-5 text-sm sm:text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105 shadow-lg shadow-primary/20"
                onClick={() => handleNavigation("/search")}
              >
                START PLANNING
              </Button>
              <Button
                size="default"
                variant="outline"
                className="w-full sm:w-auto px-6 py-5 text-sm sm:text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                onClick={() => handleNavigation("/vendor/quick-onboarding")}
              >
                JOIN AS VENDOR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

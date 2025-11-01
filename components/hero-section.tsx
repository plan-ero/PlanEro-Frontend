"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

const heroImages = [
  {
    src: "https://partyslate.imgix.net/photos/2704252/photo-1c8c8cd9-c588-42fe-8f92-89fc38ed3deb.jpg?ixlib=js-3.8.0&auto=compress%2Cformat&bg=fff&w=2400",
    alt: "Elegant wedding celebration",
    topText: "discover",
    mainText: "DREAM VENUES",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    alt: "Beautiful event decoration",
    topText: "find",
    mainText: "PERFECT VENDORS",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    alt: "Romantic venue setup",
    topText: "explore",
    mainText: "STUNNING DECORATIONS",
  },
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    alt: "Vibrant event entertainment",
    topText: "experience",
    mainText: "LIVE ENTERTAINMENT",
  },
];

export function HeroSection() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative -mt-16">
      {/* Rotating Background Images with Fade Effect */}
      <div className="relative h-[500px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              fill
              priority={currentImageIndex === 0}
              quality={90}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Text Overlay on Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {/* Dynamic Top Text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`top-${currentImageIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-xs sm:text-sm tracking-[0.3em] text-white mb-2 font-light uppercase drop-shadow-lg"
              >
                {heroImages[currentImageIndex].topText}
              </motion.p>
            </AnimatePresence>

            {/* Dynamic Main Heading */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`main-${currentImageIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-lg"
              >
                {heroImages[currentImageIndex].mainText}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal Card - Positioned at boundary */}
      <div className="relative -mt-24 z-10 w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-lg mx-auto"
        >
            <div className="bg-card border border-border text-center rounded-lg shadow-2xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                Plan Your Dream Event
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                Weddings, galas, birthdays, and more. Find venues, vendors, and ideas you can't find anywhere else.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="default"
                  className="px-6 py-5 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
                  onClick={() => router.push("/search")}
                >
                  START PLANNING
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="px-6 py-5 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                  onClick={() => router.push("/vendor")}
                >
                  JOIN AS VENDOR
                </Button>
              </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
}

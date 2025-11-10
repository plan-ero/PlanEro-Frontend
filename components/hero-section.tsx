"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

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
      {/* Rotating Background Images with Simple Fade Effect */}
      <div className="relative h-[500px] bg-black">
        <div className="absolute inset-0">
          <Image
            src={heroImages[currentImageIndex].src}
            alt={heroImages[currentImageIndex].alt}
            fill
            priority={currentImageIndex === 0}
            quality={90}
            className="object-cover brightness-110 contrast-105 transition-opacity duration-1000"
            sizes="100vw"
          />
        </div>

        {/* Light overlay for better text contrast */}
        <div className="absolute inset-0 bg-white/30"></div>

        {/* Text Overlay on Image */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
          onClick={() => router.push(heroImages[currentImageIndex].link)}
        >
          <div className="text-center group-hover:scale-105 transition-transform duration-300">
            {/* Dynamic Top Text */}
            <p
              key={`top-${currentImageIndex}`}
              className="text-xs sm:text-sm tracking-[0.3em] text-gray-800 mb-2 font-medium uppercase drop-shadow-sm transition-opacity duration-500"
            >
              {heroImages[currentImageIndex].topText}
            </p>

            {/* Dynamic Main Heading */}
            <h1
              key={`main-${currentImageIndex}`}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 drop-shadow-sm transition-opacity duration-500"
            >
              {heroImages[currentImageIndex].mainText}
            </h1>
            
            {/* Click indicator */}
            <p className="text-xs text-gray-700 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to explore
            </p>
          </div>
        </div>
      </div>

      {/* Modal Card - Positioned at boundary */}
      <div className="relative -mt-24 z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="bg-card border border-border text-center rounded-lg shadow-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              Plan Your Dream Event
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              Weddings, galas, birthdays, and more. Find venues, vendors, and
              ideas you can't find anywhere else.
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
                onClick={() => router.push("/vendor/quick-onboarding")}
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

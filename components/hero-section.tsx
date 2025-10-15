"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, MapPin, Users, Crown, Sparkles } from "lucide-react";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen sm:min-h-[90vh] lg:min-h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              y: "100vh",
              x: `${(i * 50) % 100}vw`,
              opacity: 0,
            }}
            animate={{
              y: "-100px",
              x: `${(i * 50 + 20) % 100}vw`,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 15 + (i % 10),
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 sm:mb-12"
        >
          <Badge
            variant="outline"
            className="mb-4 sm:mb-6 px-4 py-2 bg-background/80 backdrop-blur-sm border-primary/30"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            PLAN YOUR PERFECT WEDDING
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 tracking-tight leading-none text-white">
            Your Dream Wedding{" "}
            <motion.span
              className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Starts Here
            </motion.span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12">
            From intimate garden ceremonies to grand banquet celebrations, find
            everything you need to create your perfect wedding day with our
            comprehensive planning platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="max-w-5xl mx-auto mb-8 sm:mb-12"
        >
          {/* Enhanced Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-foreground/70" />
              <Input
                type="search"
                placeholder="Search venues, vendors, or services..."
                className="pl-10 sm:pl-12 h-12 sm:h-14 text-base sm:text-lg border-2 focus:border-primary bg-background/95 backdrop-blur-sm text-foreground placeholder:text-foreground/60"
              />
            </div>
            <Button
              size="lg"
              className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold"
              onClick={() => router.push("/search")}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              EXPLORE NOW
            </Button>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8 sm:mb-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 sm:h-14 text-base sm:text-lg bg-background/80 backdrop-blur-sm border-2 hover:bg-background hover:border-primary"
                onClick={() => router.push("/venues")}
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Browse Venues
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 sm:h-14 text-base sm:text-lg bg-background/80 backdrop-blur-sm border-2 hover:bg-background hover:border-primary"
                onClick={() => router.push("/services")}
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Find Vendors
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="sm:col-span-2 lg:col-span-1"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 sm:h-14 text-base sm:text-lg bg-background/80 backdrop-blur-sm border-2 hover:bg-background hover:border-primary"
                onClick={() => router.push("/vendor/onboarding")}
              >
                <Crown className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Join as Vendor
              </Button>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {[
              { number: "10K+", label: "Venues" },
              { number: "5K+", label: "Vendors" },
              { number: "50K+", label: "Events" },
              { number: "4.9★", label: "Rating" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-border/50"
              >
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-white/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

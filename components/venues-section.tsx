"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Users,
  Sparkles,
  Building2,
  Heart,
  Cake,
  GraduationCap,
  PartyPopper,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { TransitionLink } from "@/components/transition-link";
import { useReducedMotion, getMotionProps } from "@/hooks/use-reduced-motion";

// Venue categories with their details
const venueCategories = [
  {
    id: "wedding",
    name: "Wedding",
    description: "Dream venues for your special day",
    icon: Heart,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: "anniversary-engagement",
    name: "Anniversary/Engagement",
    description: "Celebrate love milestones",
    icon: Sparkles,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    color: "from-purple-500/20 to-violet-500/20",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional event spaces",
    icon: Building2,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    id: "college-fests",
    name: "College Fests",
    description: "Campus celebration venues",
    icon: GraduationCap,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "house-private-party",
    name: "House/Private Party",
    description: "Intimate gathering spaces",
    icon: Users,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    color: "from-yellow-500/20 to-orange-500/20",
  },
  {
    id: "farewell",
    name: "Farewell",
    description: "Memorable goodbye venues",
    icon: Calendar,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    color: "from-teal-500/20 to-cyan-500/20",
  },
  {
    id: "baby-shower",
    name: "Baby Shower",
    description: "Celebrate new arrivals",
    icon: Cake,
    image:
      "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    color: "from-pink-400/20 to-blue-400/20",
  },
];

export function VenuesSection() {
  const shouldReduceMotion = useReducedMotion();

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
          className="text-center mb-16"
        >
          <div className="inline-block p-2 bg-primary/10 rounded-full mb-6">
            <div className="w-4 h-4 bg-primary rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Browse by Venue Type
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find the perfect venue for your event from our curated collection of
            premium locations
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {venueCategories.map((category, index) => (
            <motion.div
              key={category.id}
              {...getMotionProps(shouldReduceMotion, {
                initial: { opacity: 0, y: 50 },
                whileInView: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: index * 0.1 },
                viewport: { once: true },
                whileHover: { y: -10 },
              })}
            >
              <TransitionLink href={`/venues/category/${category.id}`}>
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer h-full bg-card border border-border/50 shadow-lg hover:border-primary/20 relative">
                  <div className="relative overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10`}
                    />
                    <div className="overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-32 md:h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute top-3 left-3 z-20">
                      <div className="bg-background/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300 border border-border/20">
                        <category.icon className="h-4 w-4 text-primary group-hover:text-primary transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 z-20">
                      <div className="bg-background/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-border/20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
                        <ArrowRight className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  </div>

                  <CardContent className="p-4 md:p-6 relative z-20">
                    <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:text-primary transition-colors duration-300 text-center line-clamp-1">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm text-center line-clamp-2 group-hover:text-muted-foreground/80 transition-colors duration-300">
                      {category.description}
                    </p>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
                  </CardContent>
                </Card>
              </TransitionLink>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          {...getMotionProps(shouldReduceMotion, {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            transition: { delay: 0.5, duration: 0.8 },
            viewport: { once: true },
          })}
        >
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg font-semibold border-2 hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <TransitionLink href="/venues">
              <MapPin className="h-5 w-5 mr-2" />
              View All Venues
            </TransitionLink>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

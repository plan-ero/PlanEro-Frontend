"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  ChefHat,
  Music,
  Flower,
  Car,
  Cake,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { TransitionLink } from "@/components/transition-link";
import { useReducedMotion, getMotionProps } from "@/hooks/use-reduced-motion";

const services = [
  {
    id: "wedding-planner",
    name: "Wedding Planners",
    icon: Heart,
    description: "Complete wedding planning and coordination",
    count: "200+ planners",
    href: "/services/wedding-planners",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "photographers",
    name: "Photographers",
    icon: Camera,
    description: "Capture your special moments forever",
    count: "500+ professionals",
    href: "/services/photographers",
    image:
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "caterers",
    name: "Caterers",
    icon: ChefHat,
    description: "Delicious cuisine for your celebration",
    count: "300+ caterers",
    href: "/services/caterers",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-orange-500 to-red-600",
  },
  {
    id: "florists",
    name: "Florists",
    icon: Flower,
    description: "Beautiful floral arrangements",
    count: "150+ florists",
    href: "/services/florists",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "decorators",
    name: "Decorators",
    icon: Sparkles,
    description: "Stunning event decoration services",
    count: "180+ decorators",
    href: "/services/decorators",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "djs",
    name: "DJs & Entertainment",
    icon: Music,
    description: "Perfect music and entertainment",
    count: "250+ artists",
    href: "/services/djs",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-yellow-500 to-amber-600",
  },
];

export function ServicesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 bg-muted/30">
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
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary font-medium text-sm">
              WEDDING SERVICES
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Wedding Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need for your perfect wedding day. From planning to
            execution, connect with verified professionals who specialize in
            making dreams come true.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                {...getMotionProps(shouldReduceMotion, {
                  initial: { opacity: 0, y: 50, scale: 0.9 },
                  whileInView: { opacity: 1, y: 0, scale: 1 },
                  transition: { duration: 0.6, delay: index * 0.1 },
                  viewport: { once: true },
                  whileHover: { y: -8, scale: 1.02 },
                })}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 h-full shadow-lg bg-card/80 hover:bg-card/95 hover:backdrop-blur-xl overflow-hidden relative border border-border/50 hover:border-primary/30">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 group-hover:opacity-40 transition-all duration-500"
                    style={{ backgroundImage: `url(${service.image})` }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-30 transition-all duration-500`}
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
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-30 transition-all duration-500`}
                        />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-3 py-1 mb-6 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <p className="text-sm text-primary font-semibold">
                        {service.count}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      asChild
                      className="w-full bg-transparent border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 py-3 font-semibold hover:backdrop-blur-xl"
                    >
                      <TransitionLink href={service.href}>
                        Browse {service.name}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </TransitionLink>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-16"
          {...getMotionProps(shouldReduceMotion, {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            transition: { delay: 0.5, duration: 0.8 },
          })}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            asChild
            className="px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <TransitionLink href="/services">
              View All Services
              <ArrowRight className="h-5 w-5 ml-2" />
            </TransitionLink>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

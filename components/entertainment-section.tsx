"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Music, Disc, Mic, Mic2, Wand2, ArrowRight } from "lucide-react";

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
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
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
              ENTERTAINMENT
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Entertainment Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Add excitement and joy to your event with our talented entertainers.
            From live bands to magicians, create unforgettable moments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {entertainment.map((entertainer, index) => {
            const IconComponent = entertainer.icon;
            return (
              <motion.div
                key={entertainer.id}
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
                    style={{ backgroundImage: `url(${entertainer.image})` }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${entertainer.color} opacity-0 group-hover:opacity-30 transition-all duration-500`}
                  />

                  {/* Backdrop Blur Overlay */}
                  <div className="absolute inset-0 bg-background/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <CardContent className="p-6 text-center relative z-10">
                    {/* Icon Container */}
                    <div className="mb-4 relative">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg relative backdrop-blur-sm group-hover:backdrop-blur-xl">
                        <IconComponent className="h-8 w-8 text-primary group-hover:scale-110 transition-all duration-300" />

                        {/* Glow Effect */}
                        <div
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${entertainer.color} opacity-0 group-hover:opacity-30 transition-all duration-500`}
                        />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {entertainer.name}
                    </h3>
                    <p className="text-muted-foreground mb-3 text-sm leading-relaxed line-clamp-2">
                      {entertainer.description}
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-3 py-1 mb-4 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <p className="text-sm text-primary font-semibold">
                        {entertainer.count}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      asChild
                      className="w-full bg-transparent border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 py-2 text-sm font-semibold hover:backdrop-blur-xl"
                    >
                      <Link href={entertainer.href}>
                        Book Now
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-16"
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
    </section>
  );
}

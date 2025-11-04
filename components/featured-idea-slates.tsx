"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Users, Calendar, ArrowRight } from "lucide-react";

interface IdeaSlate {
  id: string;
  title: string;
  author: string;
  itemCount: number;
  images: string[];
  category: string;
  description: string;
  icon: any;
}

const featuredSlates: IdeaSlate[] = [
  {
    id: "1",
    title: "Elegant Winter Wedding Ideas",
    author: "Amanda",
    itemCount: 16,
    category: "Wedding",
    description:
      "Create magical moments with sophisticated winter décor and romantic settings",
    icon: Heart,
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "2",
    title: "Corporate Event Excellence",
    author: "Jessica",
    itemCount: 19,
    category: "Corporate",
    description:
      "Professional venues and services for impactful business gatherings",
    icon: Users,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "3",
    title: "Memorable Birthday Celebrations",
    author: "Amanda",
    itemCount: 12,
    category: "Birthday",
    description:
      "Make every birthday unforgettable with these creative party inspirations",
    icon: Calendar,
    images: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
    ],
  },
];

export function FeaturedIdeaSlates() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Featured Event Ideas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated collections to inspire your perfect event
          </p>
        </motion.div>

        {/* Slates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredSlates.map((slate, index) => (
            <motion.div
              key={slate.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm h-full">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Category Badge */}
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10">
                      <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                        <slate.icon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {slate.category}
                        </span>
                      </div>
                    </div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 gap-1 aspect-square">
                      {slate.images.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative overflow-hidden bg-muted"
                        >
                          <Image
                            src={image}
                            alt={`${slate.title} image ${imgIndex + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-semibold text-xl mb-3 leading-tight group-hover:text-primary transition-colors duration-200">
                      {slate.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                      {slate.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
                      <span className="font-medium">by {slate.author}</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        {slate.itemCount} items
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 px-8"
          >
            <Link href="/ideas">
              View All Featured Ideas
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  CheckCircle,
  Target,
  Sparkles,
  Briefcase,
  Search,
  Handshake,
  Rocket
} from "lucide-react";
import { TransitionLink } from "@/components/transition-link";
import Image from "next/image";
import { AboutSEO } from "@/components/seo/about-seo";

const founders = [
  {
    name: "Zaid",
    role: "Co-Founder",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    bio: "Visionary leader passionate about simplifying the event planning landscape through technology.",
  },
  {
    name: "Mark Andrew",
    role: "Co-Founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    bio: "Strategic thinker dedicated to building strong partnerships and driving platform growth.",
  },
  {
    name: "Mann",
    role: "Co-Founder",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    bio: "Creative force ensuring every user interaction is intuitive, beautiful, and inspiring.",
  },
];

export default function AboutPage() {
  const mission =
    "Our mission is to streamline the event planning process. We're replacing the stress and complexity of finding the right professionals with a seamless, inspiring, and efficient discovery experience.";

  return (
    <>
      <AboutSEO companyName="Planero" foundedYear={2024} mission={mission} />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              About <span className="text-primary">Planero</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We're here to take the "overwhelming" out of planning, so you can get back to the "exciting."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <Target className="h-10 w-10 text-primary mr-3" />
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {mission}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* For Clients */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-lg border border-border/50"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">For Those Planning an Event</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Planning a celebration, wedding, or corporate event? Planero is your single source of inspiration and connection.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Search className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Discover:</span>
                    <span className="text-muted-foreground ml-1">Browse stunning portfolios and real event galleries.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Handshake className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Connect:</span>
                    <span className="text-muted-foreground ml-1">Find and contact top-rated venues, caterers, photographers, florists, and more.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Plan:</span>
                    <span className="text-muted-foreground ml-1">Build your dream team with confidence, knowing every professional on our platform is vetted for quality.</span>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* For Vendors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-lg border border-border/50"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-secondary/10 text-secondary mr-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">For Our Vendor & Venue Partners</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Planero is your partner in growth. We showcase your incredible work to a highly engaged audience of clients who are actively planning their next event.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-secondary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Showcase Your Work:</span>
                    <span className="text-muted-foreground ml-1">Create a beautiful, content-rich profile that acts as your digital portfolio.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Rocket className="h-5 w-5 text-secondary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Get Discovered:</span>
                    <span className="text-muted-foreground ml-1">Be seen by qualified, pre-vetted clients.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-secondary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Build Your Network:</span>
                    <span className="text-muted-foreground ml-1">Connect with clients and other top-tier professionals in the industry.</span>
                  </div>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-border/50 text-center font-medium text-secondary">
                Join us in making every event a masterpiece.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative order-2 md:order-1"
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop"
                  alt="Our journey"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white max-w-xs">
                  <p className="font-medium text-lg italic">"We knew the joy of the celebration was being lost in the chaos of planning it."</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 space-y-6"
            >
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our story starts with a feeling we all know: the mix of excitement and stress that comes with planning an important event.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                For us, it was the chaos of planning a wedding—juggling caterers, florists, and venues, all while hoping they were reliable. It was the pressure of organizing a flawless corporate event at the office, where every detail mattered. It was even the challenge of finding a trusted pandit and the right vendors for a family ghar puja.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With every event, we were struck by the same problem. Why was it so hard to find and book great vendors? Why did we have to rely on random word-of-mouth and endless, scattered searches, never quite sure of the quality we’d get?
              </p>
              <p className="text-muted-foreground leading-relaxed font-medium text-foreground">
                That’s why we built Planero.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We created the platform we wished we had—a single, beautiful, and trusted place where anyone can discover and connect with top-rated venues and event professionals. We're here to take the "overwhelming" out of planning, so you can get back to the "exciting."
              </p>
              <p className="text-lg font-semibold text-primary">
                Your milestone, your vision, made effortless. That’s our promise.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Meet the Founders</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The visionaries behind Planero who are reshaping the event industry.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-card">
                  <CardContent className="pt-8 pb-8 px-6">
                    <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/10 shadow-inner">
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>
                    <h3 className="font-bold text-2xl mb-2">{founder.name}</h3>
                    <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-4">
                      {founder.role}
                    </p>
                    <div className="w-12 h-1 bg-primary/20 mx-auto mb-4 rounded-full"></div>
                    <p className="text-muted-foreground italic">
                      "{founder.bio}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Plan Your Event?
            </h2>
            <p className="text-primary-foreground/90 mb-8 text-lg">
              Join thousands of satisfied clients who trust Planero with their special moments. Let's create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary font-bold" asChild>
                <TransitionLink href="/auth/signup">Get Started</TransitionLink>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <TransitionLink href="/services">Browse Services</TransitionLink>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

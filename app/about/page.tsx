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
  Rocket,
  User
} from "lucide-react";
import { TransitionLink } from "@/components/transition-link";
import Image from "next/image";
import { AboutSEO } from "@/components/seo/about-seo";

const founders = [
  {
    name: "Zaid",
    role: "Founder & Business Development",
    image: null,
    bio: "Visionary leader passionate about simplifying the event planning landscape through technology.",
  },
  {
    name: "Mann",
    role: "Growth & Marketing Lead",
    image: null,
    bio: "Strategic thinker dedicated to building strong partnerships and driving platform growth.",
  },
  {
    name: "Naveen ul Ameen",
    role: "CTO",
    image: null,
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
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              About <span className="text-primary">Planero</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed font-light">
              Where planning feels as fun as scrolling Instagram — but actually gets things done.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Real Talk Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">

            {/* The Problem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Let’s be honest...</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Planning an event in India feels like a full-time job nobody signed up for.
                Running around to 12 venues in the heat? DMing 20 vendors only for them to “send rate card tomorrow”?
              </p>
              <div className="p-6 bg-destructive/5 rounded-2xl border border-destructive/10 inline-block">
                <p className="text-xl font-medium text-destructive/80 italic">
                  Google Sheets, screenshots, mom's opinions… pure chaos.
                </p>
              </div>
            </motion.div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"
                  alt="Celebration"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">We felt that.</h3>
                <p className="text-lg text-muted-foreground">
                  So we said: there has to be a better way. And boom — <span className="font-bold text-primary">PlanEro was born in 2025.</span>
                </p>
                <p className="text-lg text-muted-foreground">
                  Think of us as your event-planning bestie mixed with cool tech wizardry.
                  Basically, <span className="font-semibold text-foreground">Pinterest dreams + real-world execution.</span>
                </p>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-border/50"
            >
              <h3 className="text-2xl font-bold mb-8 text-center">With PlanEro, you can:</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Search, text: "Explore venues in 360°/VR" },
                  { icon: CheckCircle, text: "Find verified vendors who actually respond" },
                  { icon: Target, text: "Compare everything in one place" },
                  { icon: Rocket, text: "Send one single enquiry instead of 500 WhatsApp messages" },
                  { icon: Handshake, text: "Plan your celebration together — minus the drama" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-primary/5 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* The Vibe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-3xl font-bold">Your event isn’t just a day.</h3>
                <div className="flex flex-col gap-2 text-xl md:text-2xl font-light text-muted-foreground">
                  <p>It’s an aesthetic.</p>
                  <p>It’s a vibe.</p>
                  <p>It’s a core memory loading…</p>
                </div>
              </div>

              <p className="text-lg max-w-2xl mx-auto">
                That’s why we made PlanEro cute, smart, and stress-proof — just like your relationship (hopefully).
              </p>

              <div className="p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl">
                <p className="text-lg md:text-xl leading-relaxed">
                  Today, couples all over India use PlanEro to bring dream events to life without losing their sanity (or their weekends).
                  Whether you’re going for <span className="font-semibold text-primary">fairy lights + pastels</span>, <span className="font-semibold text-primary">retro Bollywood</span>, <span className="font-semibold text-primary">beachy minimalism</span>, or full <span className="font-semibold text-primary">big-fat-desi-wedding energy</span> — we’ve got you.
                </p>
              </div>
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

          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-full sm:w-60 md:w-80"
              >
                <Card className="h-full text-center overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-card">
                  <CardContent className="pt-8 pb-8 px-6">
                    <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/10 shadow-inner">
                      {founder.image ? (
                        <Image
                          src={founder.image}
                          alt={founder.name}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                      ) : (
                        <div className="inset-3 absolute flex items-center justify-center bg-primary/10 rounded-full">
                          <User className="w-24 h-24 mx-auto" />
                        </div>
                      )}
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

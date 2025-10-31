"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Award, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";

const features = [
  {
    icon: Heart,
    title: "Passionate About Events",
    description:
      "We're dedicated to making every event memorable and stress-free for our clients.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Our team of event professionals brings years of experience and creativity to every project.",
  },
  {
    icon: Award,
    title: "Award-Winning Service",
    description:
      "Recognized for excellence in event planning and customer satisfaction.",
  },
  {
    icon: Clock,
    title: "Always On Time",
    description:
      "We pride ourselves on punctuality and delivering events exactly as planned.",
  },
];

const stats = [
  { number: "1000+", label: "Events Planned" },
  { number: "500+", label: "Happy Clients" },
  { number: "50+", label: "Partner Vendors" },
  { number: "5", label: "Years Experience" },
];

const values = [
  "Excellence in every detail",
  "Transparent and honest communication",
  "Creative and innovative solutions",
  "Personalized service for each client",
  "Sustainable and eco-friendly practices",
  "Building lasting relationships",
];

export default function AboutPage() {
  return (
    <>
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-primary">PlanEro</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're passionate about creating unforgettable events that bring
              people together. From intimate gatherings to grand celebrations,
              we make your vision come to life.
            </p>
            <Button size="lg" asChild>
              <Link href="/services">Start Planning Today</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-6">
                Founded in 2019, PlanEro started with a simple mission: to make
                event planning accessible, enjoyable, and stress-free for
                everyone. What began as a small team of passionate event
                enthusiasts has grown into a comprehensive platform connecting
                event hosts with the best vendors and venues.
              </p>
              <p className="text-muted-foreground mb-6">
                We believe that every event, no matter the size or budget,
                deserves careful attention and creative execution. Our platform
                brings together the best vendors, venues, and services to ensure
                your event is exactly what you envision.
              </p>
              <p className="text-muted-foreground">
                Today, we're proud to serve thousands of clients across the
                country, helping them create memories that last a lifetime.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://media.istockphoto.com/id/590034882/photo/restaurant-table-with-food.jpg?s=612x612&w=0&k=20&c=ZgVIAKS1s10FiQBLvmmgHXSwoLvMHWa7K4Tla8JZcmI="
                alt="Our team at work"
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose PlanEro?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine expertise, technology, and passion to deliver
              exceptional event experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center p-6">
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-4xl font-bold text-primary mb-2"
                >
                  {stat.number}
                </motion.div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and every decision we
              make.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {values.map((value, index) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{value}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Eligibility</h2>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">For Clients</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>You must be at least 18 years old or have reached the age of majority in your jurisdiction to use PlanEro's services</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>You must provide accurate and complete information when creating your account</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>You agree to comply with all applicable laws and regulations when using our platform</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">For Vendors</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>You must be at least 18 years old and legally authorized to operate a business in your jurisdiction</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>You must possess all necessary licenses, permits, insurance, and certifications required for your services</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>You must provide accurate information about your services, pricing, and availability</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>You agree to maintain professional standards and honor all bookings made through the platform</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>You must comply with all local, state, and national laws and regulations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-6">
              For more detailed information, please review our{" "}
              <Link href="/terms-and-conditions" className="text-primary hover:underline">
                Terms and Conditions
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Plan Your Event?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of satisfied clients who trust PlanEro with their
              special moments. Let's create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

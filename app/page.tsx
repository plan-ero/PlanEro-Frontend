"use cache";
import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
import { FeaturedIdeaSlates } from "@/components/featured-idea-slates";
import { OrganizersSection } from "@/components/organizers-section";
import { VendorTeamSection } from "@/components/vendor-team-section";
import { SEOComponent } from "@/components/seo-component";
import { HomeSEO } from "@/components/seo/home-seo";

export const metadata: Metadata = {
  title: "Find Your Perfect Venue - Event Planning Made Easy",
  description: "Discover unique venues, vendors, and services for your special event. From dreamy weddings to epic parties — find spaces designed to impress.",
  openGraph: {
    title: "Find Your Perfect Venue - Event Planning Made Easy",
    description: "Discover unique venues, vendors, and services for your special event.",
  },
};

const categories = [
  { name: "Venues", description: "Beautiful event spaces for any occasion" },
  { name: "Catering", description: "Delicious food and beverage services" },
  { name: "Photography", description: "Professional event photography" },
  { name: "Entertainment", description: "DJs, musicians, and performers" },
  { name: "Decoration", description: "Event styling and decoration services" },
  { name: "Transportation", description: "Event logistics and travel" },
];

export default async function HomePage() {
  return (
    <>
      <SEOComponent pageType="home" />
      <HomeSEO categories={categories} />
      <main>
        <HeroSection />
        <CategoriesSection />
        <VendorTeamSection />
        <OrganizersSection />
        <FeaturedIdeaSlates />
      </main>
    </>
  );
}

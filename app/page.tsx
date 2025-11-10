"use cache";
import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
import { FeaturedIdeaSlates } from "@/components/featured-idea-slates";
import { OrganizersSection } from "@/components/organizers-section";
import { VendorTeamSection } from "@/components/vendor-team-section";
import { SEOComponent } from "@/components/seo-component";

export const metadata: Metadata = {
  title: "Find Your Perfect Venue - Event Planning Made Easy",
  description: "Discover unique venues, vendors, and services for your special event. From dreamy weddings to epic parties — find spaces designed to impress.",
  openGraph: {
    title: "Find Your Perfect Venue - Event Planning Made Easy",
    description: "Discover unique venues, vendors, and services for your special event.",
  },
};

export default async function HomePage() {
  return (
    <>
      <SEOComponent pageType="home" />
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

"use cache";
import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
import { FeaturedIdeaSlates } from "@/components/featured-idea-slates";
import { OrganizersSection } from "@/components/organizers-section";
import { VendorTeamSection } from "@/components/vendor-team-section";

export const metadata: Metadata = {
  title: "Find Your Perfect Venue",
  description:
    "Discover unique venues, vendors, and services for your special event. From dreamy weddings to epic parties — find spaces designed to impress.",
  openGraph: {
    title: "PlanEro - Find Your Perfect Venue",
    description:
      "Discover unique venues, vendors, and services for your special event. From dreamy weddings to epic parties.",
    type: "website",
  },
};

// Force static generation for better performance
// export const dynamic = 'force-static';
// export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <VendorTeamSection />
      <OrganizersSection />
      <FeaturedIdeaSlates />
    </main>
  );
}

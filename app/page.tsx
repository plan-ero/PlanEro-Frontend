import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
import { ServicesSection } from "@/components/services-section";
import { OrganizersSection } from "@/components/organizers-section";
import { VendorTeamSection } from "@/components/vendor-team-section";
import { EntertainmentSection } from "@/components/entertainment-section";
import { Footer } from "@/components/footer";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <ServicesSection />
      <OrganizersSection />
      <VendorTeamSection />
      <EntertainmentSection />
    </main>
  );
}

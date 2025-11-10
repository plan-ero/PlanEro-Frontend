import type { Metadata } from "next";
import { SEOComponent } from "@/components/seo-component";

export const metadata: Metadata = {
  title: "Venues",
  description: "Find and book the perfect venue for your wedding, party, or corporate event.",
};

export default function VenuesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Venues', url: '/venues' }
  ];

  return (
    <>
      <SEOComponent pageType="venues" breadcrumbs={breadcrumbs} />
      {children}
    </>
  );
}
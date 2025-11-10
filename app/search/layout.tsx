import type { Metadata } from "next";
import { SEOComponent } from "@/components/seo-component";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for venues, vendors, and services for your special event.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Search', url: '/search' }
  ];

  return (
    <>
      <SEOComponent pageType="search" breadcrumbs={breadcrumbs} />
      {children}
    </>
  );
}
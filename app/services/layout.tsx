import type { Metadata } from "next";
import { SEOComponent } from "@/components/seo-component";

export const metadata: Metadata = {
  title: "Services",
  description: "Browse event services and vendors to make your event perfect.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' }
  ];

  return (
    <>
      <SEOComponent pageType="services" breadcrumbs={breadcrumbs} />
      {children}
    </>
  );
}
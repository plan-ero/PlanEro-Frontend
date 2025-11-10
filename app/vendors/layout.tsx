import type { Metadata } from "next";
import { SEOComponent } from "@/components/seo-component";

export const metadata: Metadata = {
  title: "Vendors",
  description: "Discover trusted event vendors and service providers for your special occasion.",
};

export default function VendorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Vendors', url: '/vendors' }
  ];

  return (
    <>
      <SEOComponent pageType="vendors" breadcrumbs={breadcrumbs} />
      {children}
    </>
  );
}
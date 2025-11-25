import type { Metadata } from "next";
import { SEOComponent } from "@/components/seo-component";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Planero - your trusted event planning platform for finding perfect venues, vendors, and services.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ];

  return (
    <>
      <SEOComponent pageType="about" breadcrumbs={breadcrumbs} />
      {children}
    </>
  );
}

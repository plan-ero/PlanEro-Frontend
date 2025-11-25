import type { Metadata } from "next";
import { SEOComponent } from "@/components/seo-component";

// Mock function to get service data - replace with actual API call
async function getServiceData(id: string) {
  // This would normally fetch from your API
  return {
    id,
    name: `Service ${id}`,
    description:
      "Professional event service with competitive pricing and excellent quality.",
    images: ["/service-placeholder.jpg"],
    category: "Catering",
    price: 5000,
    vendor: {
      id: "vendor-1",
      name: "Professional Caterers",
      location: "Mumbai, India",
    },
  };
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Get service data for metadata
  const service = await getServiceData(id);

  return {
    title: `${service.name} - Event Services`,
    description: service.description,
  };
}

interface ServiceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailLayout({
  children,
  params,
}: ServiceLayoutProps) {
  const { id } = await params;
  const service = await getServiceData(id);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: service.name, url: `/services/${id}` },
  ];

  return (
    <>
      <SEOComponent
        pageType="service-detail"
        data={{ service }}
        breadcrumbs={breadcrumbs}
      />
      {children}
    </>
  );
}

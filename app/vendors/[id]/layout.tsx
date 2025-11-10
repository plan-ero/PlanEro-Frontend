import type { Metadata } from "next";
import { SEOComponent } from "@/components/seo-component";

// Mock function to get vendor data - replace with actual API call
async function getVendorData(id: string) {
  // This would normally fetch from your API
  return {
    id,
    name: `Vendor ${id}`,
    description: "Professional event vendor providing quality services with years of experience.",
    location: "Mumbai, India",
    images: ["/vendor-placeholder.jpg"],
    category: "Photography",
    rating: 4.8
  };
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // Get vendor data for metadata
  const vendor = await getVendorData(id);
  
  return {
    title: `${vendor.name} - Event Vendors`,
    description: vendor.description,
  };
}

interface VendorLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function VendorDetailLayout({ children, params }: VendorLayoutProps) {
  const { id } = await params;
  const vendor = await getVendorData(id);
  
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Vendors', url: '/vendors' },
    { name: vendor.name, url: `/vendors/${id}` }
  ];

  return (
    <>
      <SEOComponent 
        pageType="vendor-detail" 
        data={{ vendor }} 
        breadcrumbs={breadcrumbs} 
      />
      {children}
    </>
  );
}
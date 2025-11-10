import type { Metadata } from "next";
import { SEOComponent } from "@/components/seo-component";

// Mock function to get venue data - replace with actual API call
async function getVenueData(id: string) {
  // This would normally fetch from your API
  return {
    id,
    name: `Venue ${id}`,
    description: "Beautiful event venue with modern amenities and stunning views.",
    location: "Mumbai, India",
    images: ["/venue-placeholder.jpg"],
    capacity: 200,
    priceRange: "$$",
    category: "Wedding Venue"
  };
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const venue = await getVenueData(id);
  
  return {
    title: venue.name,
    description: venue.description,
  };
}

interface VenueLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function VenueDetailLayout({ children, params }: VenueLayoutProps) {
  const { id } = await params;
  const venue = await getVenueData(id);
  
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Venues', url: '/venues' },
    { name: venue.name, url: `/venues/${id}` }
  ];

  return (
    <>
      <SEOComponent 
        pageType="venue-detail" 
        data={{ venue }} 
        breadcrumbs={breadcrumbs} 
      />
      {children}
    </>
  );
}
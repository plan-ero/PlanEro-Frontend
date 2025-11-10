import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

// Mock data - replace with actual data fetching from your API
async function getVendors() {
  // This would normally fetch from your API with pagination
  return Array.from({ length: 500 }, (_, i) => ({
    id: `vendor-${i + 1}`,
    lastModified: new Date('2024-01-15'),
    category: ['photography', 'catering', 'decoration', 'music'][i % 4],
    location: ['mumbai', 'delhi', 'bangalore', 'hyderabad'][i % 4],
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vendors = await getVendors();

  return vendors.map((vendor) => ({
    url: `${siteConfig.url}/vendors/${vendor.id}`,
    lastModified: vendor.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
}
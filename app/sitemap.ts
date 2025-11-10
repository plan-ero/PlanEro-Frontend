import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

// Mock data - replace with actual data fetching from your API
async function getVenues() {
  // This would normally fetch from your API
  return Array.from({ length: 100 }, (_, i) => ({
    id: `venue-${i + 1}`,
    lastModified: new Date('2024-01-15'),
  }));
}

async function getVendors() {
  // This would normally fetch from your API
  return Array.from({ length: 50 }, (_, i) => ({
    id: `vendor-${i + 1}`,
    lastModified: new Date('2024-01-15'),
  }));
}

async function getServices() {
  // This would normally fetch from your API
  return Array.from({ length: 200 }, (_, i) => ({
    id: `service-${i + 1}`,
    lastModified: new Date('2024-01-15'),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [venues, vendors, services] = await Promise.all([
    getVenues(),
    getVendors(),
    getServices(),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/venues`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/vendors`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic venue pages
  const venuePages: MetadataRoute.Sitemap = venues.map((venue) => ({
    url: `${siteConfig.url}/venues/${venue.id}`,
    lastModified: venue.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic vendor pages
  const vendorPages: MetadataRoute.Sitemap = vendors.map((vendor) => ({
    url: `${siteConfig.url}/vendors/${vendor.id}`,
    lastModified: vendor.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic service pages
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${siteConfig.url}/services/${service.id}`,
    lastModified: service.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...venuePages, ...vendorPages, ...servicePages];
}

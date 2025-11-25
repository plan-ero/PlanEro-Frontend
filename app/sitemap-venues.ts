import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

// Mock data - replace with actual data fetching from your API
async function getVenues() {
  // This would normally fetch from your API with pagination
  return Array.from({ length: 1000 }, (_, i) => ({
    id: `venue-${i + 1}`,
    lastModified: new Date("2024-01-15"),
    category: ["wedding", "corporate", "private-party"][i % 3],
    location: ["mumbai", "delhi", "bangalore"][i % 3],
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const venues = await getVenues();

  return venues.map((venue) => ({
    url: `${siteConfig.url}/venues/${venue.id}`,
    lastModified: venue.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}

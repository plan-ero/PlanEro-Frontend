import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

// Mock data - replace with actual data fetching from your API
async function getServices() {
  // This would normally fetch from your API with pagination
  return Array.from({ length: 2000 }, (_, i) => ({
    id: `service-${i + 1}`,
    lastModified: new Date("2024-01-15"),
    category: [
      "photography",
      "catering",
      "decoration",
      "music",
      "entertainment",
      "transport",
    ][i % 6],
    vendorId: `vendor-${Math.floor(i / 4) + 1}`,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getServices();

  return services.map((service) => ({
    url: `${siteConfig.url}/services/${service.id}`,
    lastModified: service.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}

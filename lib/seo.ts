import { Metadata } from "next";

// Common SEO configuration
export const siteConfig = {
  name: "Planero",
  description: "Your ultimate event planning platform - Find venues, vendors, and services for unforgettable events",
  url: "https://planero.com",
  ogImage: "https://planero.com/og-image.jpg",
  twitterCard: "summary_large_image",
  locale: "en_US",
  type: "website",
  keywords: [
    "event planning",
    "wedding venues",
    "party venues", 
    "event venues",
    "wedding planners",
    "catering services",
    "event management",
    "venue booking",
    "event services",
    "party planning",
    "corporate events",
    "event coordination"
  ]
};

// Bot detection utility
export function detectBot(userAgent: string): string | null {
  const botPatterns = {
    googlebot: /googlebot/i,
    bingbot: /bingbot/i,
    yandexbot: /yandexbot/i,
    duckduckbot: /duckduckbot/i,
    facebookbot: /facebookexternalhit/i,
    twitterbot: /twitterbot/i,
    linkedinbot: /linkedinbot/i,
    whatsapp: /whatsapp/i,
    telegram: /telegrambot/i,
    slackbot: /slackbot/i,
    discordbot: /discordbot/i,
    semrushbot: /semrushbot/i,
    ahrefsbot: /ahrefsbot/i,
    mj12bot: /mj12bot/i,
    dotbot: /dotbot/i
  };

  for (const [botName, pattern] of Object.entries(botPatterns)) {
    if (pattern.test(userAgent)) {
      return botName;
    }
  }
  
  return null;
}

// Generate SEO-optimized metadata for different bots
export function generateBotSpecificMetadata(
  page: string,
  data?: any,
  bot?: string
): Metadata {
  const baseMetadata = getBaseMetadata(page, data);
  
  if (!bot) return baseMetadata;

  // Bot-specific optimizations
  switch (bot) {
    case 'googlebot':
      return {
        ...baseMetadata,
        robots: {
          index: true,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large',
          'max-video-preview': -1,
        },
        alternates: {
          canonical: `${siteConfig.url}${page === 'home' ? '' : `/${page}`}`,
        },
      };

    case 'bingbot':
      return {
        ...baseMetadata,
        robots: {
          index: true,
          follow: true,
        },
        other: {
          'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
        },
      };

    case 'facebookbot':
      return {
        ...baseMetadata,
        openGraph: {
          ...baseMetadata.openGraph,
          type: 'website' as const,
          locale: 'en_US',
          siteName: siteConfig.name,
        },
      };

    case 'twitterbot':
      return {
        ...baseMetadata,
        twitter: {
          ...baseMetadata.twitter,
          card: 'summary_large_image' as const,
          site: '@planero',
          creator: '@planero',
        },
      };

    case 'linkedinbot':
      return {
        ...baseMetadata,
        openGraph: {
          ...baseMetadata.openGraph,
          type: 'article' as const,
          siteName: siteConfig.name,
        },
      };

    default:
      return baseMetadata;
  }
}

// Base metadata generation for different pages
function getBaseMetadata(page: string, data?: any): Metadata {
  switch (page) {
    case 'home':
      return {
        title: `${siteConfig.name} - ${siteConfig.description}`,
        description: siteConfig.description,
        keywords: siteConfig.keywords,
        openGraph: {
          title: `${siteConfig.name} - Ultimate Event Planning Platform`,
          description: siteConfig.description,
          url: siteConfig.url,
          images: [
            {
              url: siteConfig.ogImage,
              width: 1200,
              height: 630,
              alt: `${siteConfig.name} - Event Planning Platform`,
            },
          ],
          locale: siteConfig.locale,
          type: 'website' as const,
        },
        twitter: {
          card: 'summary_large_image' as const,
          title: `${siteConfig.name} - Ultimate Event Planning Platform`,
          description: siteConfig.description,
          images: [siteConfig.ogImage],
        },
        alternates: {
          canonical: siteConfig.url,
        },
      };

    case 'venues':
      return {
        title: `Event Venues - Find Perfect Venues | ${siteConfig.name}`,
        description: "Discover amazing event venues for weddings, parties, corporate events and more. Browse hundreds of verified venues with photos, pricing, and availability.",
        keywords: [
          "event venues",
          "wedding venues", 
          "party venues",
          "corporate event venues",
          "venue booking",
          "event spaces",
          "banquet halls",
          "outdoor venues"
        ],
        openGraph: {
          title: "Event Venues - Find Perfect Venues",
          description: "Discover amazing event venues for all occasions",
          url: `${siteConfig.url}/venues`,
          images: [
            {
              url: `${siteConfig.url}/og-venues.jpg`,
              width: 1200,
              height: 630,
              alt: "Event Venues on Planero",
            },
          ],
        },
        twitter: {
          card: 'summary_large_image' as const,
          title: "Event Venues - Find Perfect Venues",
          description: "Discover amazing event venues for all occasions",
          images: [`${siteConfig.url}/og-venues.jpg`],
        },
        alternates: {
          canonical: `${siteConfig.url}/venues`,
        },
      };

    case 'vendors':
      return {
        title: `Event Vendors & Service Providers | ${siteConfig.name}`,
        description: "Connect with top-rated event vendors including photographers, caterers, decorators, DJs, and more. Read reviews and get quotes instantly.",
        keywords: [
          "event vendors",
          "wedding vendors",
          "event service providers",
          "photographers",
          "caterers",
          "decorators",
          "DJs",
          "event professionals"
        ],
        openGraph: {
          title: "Event Vendors & Service Providers",
          description: "Connect with top-rated event professionals",
          url: `${siteConfig.url}/vendors`,
          images: [
            {
              url: `${siteConfig.url}/og-vendors.jpg`,
              width: 1200,
              height: 630,
              alt: "Event Vendors on Planero",
            },
          ],
        },
        twitter: {
          card: 'summary_large_image' as const,
          title: "Event Vendors & Service Providers",
          description: "Connect with top-rated event professionals",
          images: [`${siteConfig.url}/og-vendors.jpg`],
        },
        alternates: {
          canonical: `${siteConfig.url}/vendors`,
        },
      };

    case 'services':
      return {
        title: `Event Services - Everything for Your Event | ${siteConfig.name}`,
        description: "Browse comprehensive event services including catering, photography, decoration, entertainment, transportation, and more. Compare prices and book online.",
        keywords: [
          "event services",
          "wedding services",
          "catering services",
          "photography services",
          "decoration services",
          "entertainment services",
          "event planning services"
        ],
        openGraph: {
          title: "Event Services - Everything for Your Event",
          description: "Browse comprehensive event services and book online",
          url: `${siteConfig.url}/services`,
          images: [
            {
              url: `${siteConfig.url}/og-services.jpg`,
              width: 1200,
              height: 630,
              alt: "Event Services on Planero",
            },
          ],
        },
        twitter: {
          card: 'summary_large_image' as const,
          title: "Event Services - Everything for Your Event",
          description: "Browse comprehensive event services and book online",
          images: [`${siteConfig.url}/og-services.jpg`],
        },
        alternates: {
          canonical: `${siteConfig.url}/services`,
        },
      };

    case 'search':
      return {
        title: `Search Events, Venues & Services | ${siteConfig.name}`,
        description: "Search and filter through thousands of venues, vendors, and services. Find exactly what you need for your perfect event.",
        keywords: [
          "event search",
          "venue search",
          "vendor search",
          "service search",
          "event planning search",
          "find venues",
          "find vendors"
        ],
        openGraph: {
          title: "Search Events, Venues & Services",
          description: "Find exactly what you need for your perfect event",
          url: `${siteConfig.url}/search`,
          images: [
            {
              url: `${siteConfig.url}/og-search.jpg`,
              width: 1200,
              height: 630,
              alt: "Search on Planero",
            },
          ],
        },
        twitter: {
          card: 'summary_large_image' as const,
          title: "Search Events, Venues & Services",
          description: "Find exactly what you need for your perfect event",
          images: [`${siteConfig.url}/og-search.jpg`],
        },
        alternates: {
          canonical: `${siteConfig.url}/search`,
        },
      };

    case 'about':
      return {
        title: `About Us - ${siteConfig.name} Story & Mission`,
        description: "Learn about Planero's mission to simplify event planning. Discover our story, values, and commitment to making every event unforgettable.",
        keywords: [
          "about planero",
          "event planning company",
          "our mission",
          "event planning platform",
          "company story"
        ],
        openGraph: {
          title: `About Us - ${siteConfig.name} Story & Mission`,
          description: "Learn about our mission to simplify event planning",
          url: `${siteConfig.url}/about`,
          images: [
            {
              url: `${siteConfig.url}/og-about.jpg`,
              width: 1200,
              height: 630,
              alt: "About Planero",
            },
          ],
        },
        twitter: {
          card: 'summary_large_image' as const,
          title: `About Us - ${siteConfig.name} Story & Mission`,
          description: "Learn about our mission to simplify event planning",
          images: [`${siteConfig.url}/og-about.jpg`],
        },
        alternates: {
          canonical: `${siteConfig.url}/about`,
        },
      };

    case 'venue-detail':
      const venue = data?.venue;
      return {
        title: venue?.name ? `${venue.name} - Event Venue | ${siteConfig.name}` : `Venue Details | ${siteConfig.name}`,
        description: venue?.description || "Explore this amazing venue for your next event. View photos, amenities, pricing, and availability.",
        keywords: [
          venue?.name || "event venue",
          "venue booking",
          "event space",
          venue?.location || "venue location",
          venue?.category || "venue type"
        ],
        openGraph: {
          title: venue?.name || "Event Venue",
          description: venue?.description || "Explore this amazing venue for your next event",
          url: `${siteConfig.url}/venues/${venue?.id || ''}`,
          images: venue?.images?.length ? [
            {
              url: venue.images[0],
              width: 1200,
              height: 630,
              alt: `${venue.name} - Event Venue`,
            },
          ] : [
            {
              url: `${siteConfig.url}/og-venues.jpg`,
              width: 1200,
              height: 630,
              alt: "Event Venue",
            },
          ],
          type: 'article' as const,
        },
        twitter: {
          card: 'summary_large_image' as const,
          title: venue?.name || "Event Venue",
          description: venue?.description || "Explore this amazing venue for your next event",
          images: venue?.images?.length ? [venue.images[0]] : [`${siteConfig.url}/og-venues.jpg`],
        },
        alternates: {
          canonical: `${siteConfig.url}/venues/${venue?.id || ''}`,
        },
      };

    case 'vendor-detail':
      const vendor = data?.vendor;
      return {
        title: vendor?.name ? `${vendor.name} - Event Vendor | ${siteConfig.name}` : `Vendor Profile | ${siteConfig.name}`,
        description: vendor?.description || "Professional event vendor providing quality services. View portfolio, reviews, and get instant quotes.",
        keywords: [
          vendor?.name || "event vendor",
          vendor?.category || "event service",
          "event professional",
          vendor?.location || "vendor location",
          "vendor booking"
        ],
        openGraph: {
          title: vendor?.name || "Event Vendor",
          description: vendor?.description || "Professional event vendor providing quality services",
          url: `${siteConfig.url}/vendors/${vendor?.id || ''}`,
          images: vendor?.images?.length ? [
            {
              url: vendor.images[0],
              width: 1200,
              height: 630,
              alt: `${vendor.name} - Event Vendor`,
            },
          ] : [
            {
              url: `${siteConfig.url}/og-vendors.jpg`,
              width: 1200,
              height: 630,
              alt: "Event Vendor",
            },
          ],
          type: 'article' as const,
        },
        twitter: {
          card: 'summary_large_image' as const,
          title: vendor?.name || "Event Vendor",
          description: vendor?.description || "Professional event vendor providing quality services",
          images: vendor?.images?.length ? [vendor.images[0]] : [`${siteConfig.url}/og-vendors.jpg`],
        },
        alternates: {
          canonical: `${siteConfig.url}/vendors/${vendor?.id || ''}`,
        },
      };

    case 'service-detail':
      const service = data?.service;
      return {
        title: service?.name ? `${service.name} - Event Service | ${siteConfig.name}` : `Service Details | ${siteConfig.name}`,
        description: service?.description || "Professional event service with competitive pricing. View details, photos, and book instantly.",
        keywords: [
          service?.name || "event service",
          service?.category || "service type",
          "event booking",
          service?.vendor?.location || "service location",
          "professional service"
        ],
        openGraph: {
          title: service?.name || "Event Service",
          description: service?.description || "Professional event service with competitive pricing",
          url: `${siteConfig.url}/services/${service?.id || ''}`,
          images: service?.images?.length ? [
            {
              url: service.images[0],
              width: 1200,
              height: 630,
              alt: `${service.name} - Event Service`,
            },
          ] : [
            {
              url: `${siteConfig.url}/og-services.jpg`,
              width: 1200,
              height: 630,
              alt: "Event Service",
            },
          ],
          type: 'article' as const,
        },
        twitter: {
          card: 'summary_large_image' as const,
          title: service?.name || "Event Service",
          description: service?.description || "Professional event service with competitive pricing",
          images: service?.images?.length ? [service.images[0]] : [`${siteConfig.url}/og-services.jpg`],
        },
        alternates: {
          canonical: `${siteConfig.url}/services/${service?.id || ''}`,
        },
      };

    default:
      return {
        title: siteConfig.name,
        description: siteConfig.description,
        alternates: {
          canonical: siteConfig.url,
        },
      };
  }
}

// Schema.org structured data generators
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.name,
    "description": siteConfig.description,
    "url": siteConfig.url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteConfig.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://facebook.com/planero",
      "https://twitter.com/planero",
      "https://instagram.com/planero",
      "https://linkedin.com/company/planero"
    ]
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "description": siteConfig.description,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-PLANERO",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://facebook.com/planero",
      "https://twitter.com/planero",
      "https://instagram.com/planero",
      "https://linkedin.com/company/planero"
    ]
  };
}

export function generateVenueSchema(venue: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": venue.name,
    "description": venue.description,
    "url": `${siteConfig.url}/venues/${venue.id}`,
    "image": venue.images?.length ? venue.images : [`${siteConfig.url}/og-venues.jpg`],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": venue.address,
      "addressLocality": venue.city,
      "addressRegion": venue.state,
      "postalCode": venue.zipCode,
      "addressCountry": venue.country || "US"
    },
    "geo": venue.latitude && venue.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": venue.latitude,
      "longitude": venue.longitude
    } : undefined,
    "amenityFeature": venue.amenities?.map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "maximumAttendeeCapacity": venue.capacity,
    "priceRange": venue.priceRange || "$$"
  };
}

export function generateServiceSchema(service: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "url": `${siteConfig.url}/services/${service.id}`,
    "image": service.images?.length ? service.images : [`${siteConfig.url}/og-services.jpg`],
    "provider": service.vendor ? {
      "@type": "Organization",
      "name": service.vendor.name,
      "url": `${siteConfig.url}/vendors/${service.vendor.id}`
    } : undefined,
    "serviceType": service.category,
    "areaServed": service.serviceArea || "Local Area",
    "offers": service.price ? {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    } : undefined
  };
}

export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}
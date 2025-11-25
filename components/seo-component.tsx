"use client";

import { StaticStructuredData } from "./structured-data";
import {
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateVenueSchema,
  generateServiceSchema,
  generateBreadcrumbSchema,
} from "../lib/seo";

interface SEOComponentProps {
  pageType?:
    | "home"
    | "venues"
    | "vendors"
    | "services"
    | "search"
    | "about"
    | "venue-detail"
    | "vendor-detail"
    | "service-detail";
  data?: any;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function SEOComponent({
  pageType = "home",
  data,
  breadcrumbs,
}: SEOComponentProps) {
  const schemas = [];

  // Always include website and organization schemas
  schemas.push(generateWebsiteSchema());
  schemas.push(generateOrganizationSchema());

  // Add page-specific schemas
  switch (pageType) {
    case "venue-detail":
      if (data?.venue) {
        schemas.push(generateVenueSchema(data.venue));
      }
      break;

    case "service-detail":
      if (data?.service) {
        schemas.push(generateServiceSchema(data.service));
      }
      break;

    default:
      // No additional schemas for list pages
      break;
  }

  // Add breadcrumb schema if provided
  if (breadcrumbs && breadcrumbs.length > 1) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <StaticStructuredData
          key={index}
          data={schema}
          id={`structured-data-${index}`}
        />
      ))}
    </>
  );
}

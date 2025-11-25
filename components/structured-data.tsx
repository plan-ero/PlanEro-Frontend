"use client";

import { useEffect } from "react";

interface StructuredDataProps {
  data: any;
  id?: string;
}

export function StructuredData({
  data,
  id = "structured-data",
}: StructuredDataProps) {
  useEffect(() => {
    // Only run on client side to avoid hydration issues
    if (typeof window !== "undefined") {
      // Remove existing structured data if it exists
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(data, null, 2);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (typeof window !== "undefined") {
        const script = document.getElementById(id);
        if (script) {
          script.remove();
        }
      }
    };
  }, [data, id]);

  return null; // This component doesn't render anything visible
}

// Static variant for server-side rendering
export function StaticStructuredData({
  data,
  id = "structured-data",
}: StructuredDataProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

"use client";

import { detectBot } from "@/lib/seo";
import { useEffect } from "react";

interface BotAnalyticsProps {
  page: string;
}

export function BotAnalytics({ page }: BotAnalyticsProps) {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent;
      const bot = detectBot(userAgent);

      if (bot) {
        // Track bot visits - you can replace this with your analytics service
        console.log(`Bot visit detected: ${bot} on page: ${page}`);

        // Example: Send to analytics
        if (typeof window !== "undefined" && "gtag" in window) {
          (window as any).gtag("event", "bot_visit", {
            event_category: "SEO",
            event_label: bot,
            custom_parameter_page: page,
          });
        }

        // Example: Send to custom analytics endpoint
        fetch("/api/analytics/bot-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bot,
            page,
            userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href,
          }),
        }).catch((error) => {
          // Silently handle errors to avoid affecting user experience
          console.error("Bot analytics error:", error);
        });
      }
    }
  }, [page]);

  return null; // This component doesn't render anything
}

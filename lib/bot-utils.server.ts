// Server-side bot detection and handling utilities
import { detectBot } from "@/lib/seo";

// Server-side bot detection for middleware
export function getBotFromHeaders(headers: Headers): string | null {
  const userAgent = headers.get("user-agent") || "";
  return detectBot(userAgent);
}

// Bot-specific response headers
export function getBotHeaders(bot: string | null): Record<string, string> {
  const headers: Record<string, string> = {};

  if (bot) {
    switch (bot) {
      case "googlebot":
        headers["X-Robots-Tag"] =
          "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
        break;

      case "bingbot":
        headers["X-Robots-Tag"] = "index, follow";
        break;

      case "facebookbot":
      case "twitterbot":
      case "linkedinbot":
        headers["Cache-Control"] = "public, max-age=86400"; // 24 hours for social media bots
        break;

      case "semrushbot":
      case "ahrefsbot":
      case "mj12bot":
        headers["X-Robots-Tag"] = "noindex, nofollow";
        headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        break;

      default:
        headers["X-Robots-Tag"] = "index, follow";
        break;
    }
  }

  return headers;
}

// Middleware helper for bot-specific handling
export function handleBotRequest(request: Request): Response | null {
  const userAgent = request.headers.get("user-agent") || "";
  const bot = detectBot(userAgent);

  if (bot) {
    // Log bot visit
    console.log(`Bot detected: ${bot} accessing ${request.url}`);

    // Handle specific bot behaviors
    switch (bot) {
      case "semrushbot":
      case "ahrefsbot":
      case "mj12bot":
      case "dotbot":
        // Rate limit SEO crawlers
        return new Response("Too Many Requests", {
          status: 429,
          headers: {
            "Retry-After": "3600", // 1 hour
            "X-Robots-Tag": "noindex, nofollow",
          },
        });

      default:
        // Allow other bots with appropriate headers
        break;
    }
  }

  return null; // Continue with normal processing
}

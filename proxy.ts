import { NextRequest, NextResponse } from "next/server";
import {
  getBotFromHeaders,
  getBotHeaders,
  handleBotRequest,
} from "@/lib/bot-utils.server";

export default function proxy(request: NextRequest) {
  // Handle bot-specific requests
  const botResponse = handleBotRequest(request);
  if (botResponse) {
    return botResponse;
  }

  // Detect bot and set appropriate headers
  const bot = getBotFromHeaders(request.headers);
  const response = NextResponse.next();

  // Add bot-specific headers
  const botHeaders = getBotHeaders(bot);
  Object.entries(botHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add security headers for all requests
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Bot-specific optimizations
  if (bot) {
    // Add cache headers for social media bots
    if (
      ["facebookbot", "twitterbot", "linkedinbot", "whatsapp"].includes(bot)
    ) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=86400, stale-while-revalidate=43200",
      );
    }

    // Add special headers for search engine bots
    if (["googlebot", "bingbot", "yandexbot", "duckduckbot"].includes(bot)) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=3600, stale-while-revalidate=1800",
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap|sw.js|manifest).*)",
  ],
};

import type React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/components/query-provider";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";
// import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { Footer } from "@/components/footer";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Suspense } from "react";
import { Header } from "@/components/header";

// Optimized font loading with display swap for better performance
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: true,
  fallback: ['Georgia', 'serif'],
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800'],
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "PlanEro - Find Your Perfect Venue",
    template: "%s | PlanEro",
  },
  description:
    "Discover unique venues, vendors, and services for your special event. From dreamy weddings to epic parties — find spaces designed to impress.",
  keywords: [
    "event venue",
    "wedding venue",
    "party venue",
    "event planning",
    "venue booking",
    "event vendors",
    "wedding planning",
    "corporate events",
    "banquet halls",
    "event organizers",
  ],
  authors: [{ name: "PlanEro" }],
  creator: "PlanEro",
  publisher: "PlanEro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "PlanEro - Find Your Perfect Venue",
    description:
      "Discover unique venues, vendors, and services for your special event. From dreamy weddings to epic parties.",
    siteName: "PlanEro",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanEro - Find Your Perfect Venue",
    description:
      "Discover unique venues, vendors, and services for your special event.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              <CartProvider>
                {/* <SmoothScrollProvider> */}
                  <div className="min-h-screen flex flex-col justify-between">
                    <Header />
                    <Suspense fallback={<LoadingSpinner />}>
                      {children}
                    </Suspense>
                    <Footer />
                  </div>
                  <Toaster position="top-right" />
                {/* </SmoothScrollProvider> */}
              </CartProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

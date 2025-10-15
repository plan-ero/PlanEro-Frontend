import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/components/query-provider";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { Footer } from "@/components/footer";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Suspense } from "react";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlanEro - Find Your Perfect Venue",
  description:
    "Discover unique venues, vendors, and services for your special event",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              <CartProvider>
                <SmoothScrollProvider>
                  <div className="min-h-screen flex flex-col justify-between">
                    <Header />
                    <Suspense fallback={<LoadingSpinner />}>
                      {children}
                    </Suspense>
                    <Footer />
                  </div>
                  <Toaster position="top-right" />
                </SmoothScrollProvider>
              </CartProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Building2,
  Settings,
  Image,
  TrendingUp,
  Package,
  Home,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const navigation = [
  {
    name: "Dashboard",
    href: "/vendor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    href: "/vendor/profile",
    icon: Building2,
  },
  {
    name: "Services",
    href: "/vendor/services",
    icon: Package,
  },
  {
    name: "Gallery",
    href: "/vendor/gallery",
    icon: Image,
  },
  {
    name: "Analytics",
    href: "/vendor/analytics",
    icon: TrendingUp,
  },
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          <Separator />

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          <Separator />

          {/* Footer */}
          <div className="p-4 space-y-2">
            <Link href="/">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Site
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>

            {session?.user && (
              <div className="pt-2 text-xs text-muted-foreground">
                <p className="truncate">{session.user.name}</p>
                <p className="truncate">{session.user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

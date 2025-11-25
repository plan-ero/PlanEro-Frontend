"use client";

import { TransitionLink } from "@/components/transition-link";
import { usePathname } from "next/navigation";
import { Home, Users, Gift, Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";

export function BottomAppBar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

    // Check if app is installed (PWA mode)
    if (typeof window !== "undefined") {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as any).standalone === true;
      setIsInstalled(standalone);
    }
  }, []);

  // Don't render during SSR
  if (!isMounted) {
    return null;
  }

  // Only show in installed PWA mode
  if (!isInstalled) {
    return null;
  }

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/vendors", label: "Vendors", icon: Users },
    { href: "/services", label: "Services", icon: Gift },
    { href: "/search", label: "Search", icon: Search },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav
      aria-label="App bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-4xl mx-auto px-2 flex items-center justify-between h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active =
            pathname === tab.href ||
            (tab.href !== "/" && pathname?.startsWith(tab.href));
          return (
            <TransitionLink
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 text-xs ${active ? "text-primary" : "text-muted-foreground"
                }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="truncate">{tab.label}</span>
            </TransitionLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomAppBar;

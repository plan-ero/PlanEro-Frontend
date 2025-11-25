"use client";

import { useState } from "react";
import { TransitionLink } from "@/components/transition-link";
import { ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SubCategory {
  name: string;
  href: string;
  count?: string;
}

interface MegaMenuItem {
  label: string;
  href: string;
  subcategories: SubCategory[];
}

const megaMenuData: MegaMenuItem[] = [
  {
    label: "Venues",
    href: "/venues",
    subcategories: [
      { name: "Hotel Venues", href: "/venues?category=hotel", count: "250+" },
      {
        name: "Outdoor Venues",
        href: "/venues?category=outdoor",
        count: "180+",
      },
      {
        name: "Restaurant Venues",
        href: "/venues?category=restaurant",
        count: "120+",
      },
      {
        name: "Intimate Venues",
        href: "/venues?category=intimate",
        count: "90+",
      },
      { name: "Barn Venues", href: "/venues?category=barn", count: "75+" },
      {
        name: "Rooftop Venues",
        href: "/venues?category=rooftop",
        count: "60+",
      },
      { name: "Museum Venues", href: "/venues?category=museum", count: "45+" },
      { name: "Winery Venues", href: "/venues?category=winery", count: "55+" },
      {
        name: "Wedding Shower Venues",
        href: "/venues?category=shower",
        count: "100+",
      },
      {
        name: "Rehearsal Dinner Venues",
        href: "/venues?category=rehearsal",
        count: "85+",
      },
      { name: "All Venues", href: "/venues", count: "1000+" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    subcategories: [
      {
        name: "Photo & Videographer",
        href: "/services?type=PHOTOGRAPHER",
        count: "200+",
      },
      { name: "Decorator", href: "/services?type=DECORATOR", count: "150+" },
      { name: "Florist", href: "/services?type=FLORIST", count: "180+" },
      { name: "Caterer", href: "/services?type=CATERS", count: "220+" },
      { name: "Baker", href: "/services?type=BAKERS", count: "140+" },
      {
        name: "Transportation",
        href: "/services?type=TRANSPORTATION",
        count: "90+",
      },
      {
        name: "Wedding Band",
        href: "/services?type=WEDDING_BAND",
        count: "80+",
      },
      { name: "DJ", href: "/services?type=DJ", count: "150+" },
      { name: "Singer", href: "/services?type=SINGER", count: "120+" },
      { name: "Anchor", href: "/services?type=ANCHOR", count: "90+" },
      { name: "Magician", href: "/services?type=MAGICIAN", count: "60+" },
    ],
  },
  {
    label: "Vendors",
    href: "/vendors",
    subcategories: [
      { name: "All Vendors", href: "/vendors", count: "500+" },
      {
        name: "Wedding Vendors",
        href: "/vendors?category=wedding",
        count: "300+",
      },
      {
        name: "Corporate Event Vendors",
        href: "/vendors?category=corporate",
        count: "150+",
      },
      {
        name: "Birthday Party Vendors",
        href: "/vendors?category=birthday",
        count: "120+",
      },
      {
        name: "Verified Vendors",
        href: "/vendors?verified=true",
        count: "250+",
      },
      {
        name: "Top Rated Vendors",
        href: "/vendors?sort=rating",
        count: "200+",
      },
    ],
  },
];

interface MegaMenuProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function MegaMenu({ isMobile = false, onClose }: MegaMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  if (isMobile) {
    return (
      <div className="w-screen bg-background border-t border-border overflow-y-auto max-h-[calc(100vh-4rem)]">
        <nav className="container mx-auto px-4 py-4">
          {megaMenuData.map((item) => (
            <div key={item.label} className="mb-4">
              <button
                onClick={() =>
                  setExpandedMobile(
                    expandedMobile === item.label ? null : item.label,
                  )
                }
                className="w-full flex items-center justify-between py-3 px-4 text-base font-semibold text-foreground hover:bg-muted/50 rounded-lg transition-all"
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${expandedMobile === item.label ? "rotate-180" : ""
                    }`}
                />
              </button>

              <AnimatePresence>
                {expandedMobile === item.label && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 pr-2 py-2 space-y-1">
                      {item.subcategories.map((sub) => (
                        <TransitionLink
                          key={sub.name}
                          href={sub.href}
                          onClick={onClose}
                          className="flex items-center justify-between py-2.5 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all group"
                        >
                          <span>{sub.name}</span>
                          {/* {sub.count && (
                            <span className="text-xs text-muted-foreground/60 group-hover:text-muted-foreground">
                              {sub.count}
                            </span>
                          )} */}
                        </TransitionLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>
    );
  }

  // Desktop version
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {megaMenuData.map((item) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => setHoveredItem(item.label)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <TransitionLink
            href={item.href}
            className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
          >
            {item.label}
            <ChevronDown className="ml-1 h-3 w-3" />
          </TransitionLink>

          <AnimatePresence>
            {hoveredItem === item.label && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4">
                  <div className="mb-3 pb-3 border-b border-border">
                    <h3 className="text-base font-bold text-foreground">
                      {item.label}
                    </h3>
                  </div>
                  <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {item.subcategories.map((sub) => (
                      <TransitionLink
                        key={sub.name}
                        href={sub.href}
                        className="flex items-center justify-between py-2.5 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all group"
                      >
                        <span className="flex-1">{sub.name}</span>
                        {/* {sub.count && (
                          <span className="text-xs text-muted-foreground/60 group-hover:text-muted-foreground ml-2">
                            {sub.count}
                          </span>
                        )} */}
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                      </TransitionLink>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
}

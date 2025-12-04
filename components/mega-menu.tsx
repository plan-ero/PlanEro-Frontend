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

interface MegaMenuGroup {
  title: string;
  items: SubCategory[];
}

interface MegaMenuItem {
  label: string;
  href: string;
  groups: MegaMenuGroup[];
}

const megaMenuData: MegaMenuItem[] = [
  {
    label: "Venues",
    href: "/venues",
    groups: [
      {
        title: "By Type",
        items: [
          { name: "Hotel Venues", href: "/venues?category=hotel", count: "250+" },
          { name: "Outdoor Venues", href: "/venues?category=outdoor", count: "180+" },
          { name: "Restaurant Venues", href: "/venues?category=restaurant", count: "120+" },
          { name: "Rooftop Venues", href: "/venues?category=rooftop", count: "60+" },
          { name: "Barn Venues", href: "/venues?category=barn", count: "75+" },
        ]
      },
      {
        title: "By Event",
        items: [
          { name: "Wedding Shower", href: "/venues?category=shower", count: "100+" },
          { name: "Rehearsal Dinner", href: "/venues?category=rehearsal", count: "85+" },
          { name: "Intimate Events", href: "/venues?category=intimate", count: "90+" },
        ]
      },
      {
        title: "More",
        items: [
          { name: "Museum Venues", href: "/venues?category=museum", count: "45+" },
          { name: "Winery Venues", href: "/venues?category=winery", count: "55+" },
          { name: "All Venues", href: "/venues", count: "1000+" },
        ]
      }
    ],
  },
  {
    label: "Services",
    href: "/services",
    groups: [
      {
        title: "Main Services",
        items: [
          { name: "Photo & Video", href: "/services?type=PHOTOGRAPHER", count: "200+" },
          { name: "Decorator", href: "/services?type=DECORATOR", count: "150+" },
          { name: "Caterer", href: "/services?type=CATERS", count: "220+" },
        ]
      },
      {
        title: "Entertainment",
        items: [
          { name: "DJ", href: "/services?type=DJ", count: "150+" },
          { name: "Live Band", href: "/services?type=WEDDING_BAND", count: "80+" },
          { name: "Singer", href: "/services?type=SINGER", count: "120+" },
          { name: "Magician", href: "/services?type=MAGICIAN", count: "60+" },
        ]
      },
      {
        title: "Other",
        items: [
          { name: "Florist", href: "/services?type=FLORIST", count: "180+" },
          { name: "Baker", href: "/services?type=BAKERS", count: "140+" },
          { name: "Transportation", href: "/services?type=TRANSPORTATION", count: "90+" },
        ]
      }
    ],
  },
  {
    label: "Vendors",
    href: "/vendors",
    groups: [
      {
        title: "Categories",
        items: [
          { name: "Wedding Vendors", href: "/vendors?category=wedding", count: "300+" },
          { name: "Corporate Vendors", href: "/vendors?category=corporate", count: "150+" },
          { name: "Birthday Vendors", href: "/vendors?category=birthday", count: "120+" },
        ]
      },
      {
        title: "Discover",
        items: [
          { name: "Verified Vendors", href: "/vendors?verified=true", count: "250+" },
          { name: "Top Rated", href: "/vendors?sort=rating", count: "200+" },
          { name: "All Vendors", href: "/vendors", count: "500+" },
        ]
      }
    ],
  },
  {
    label: "Ideas",
    href: "/ideas",
    groups: [
      {
        title: "Inspiration",
        items: [
          { name: "Wedding Ideas", href: "/ideas?category=wedding", count: "400+" },
          { name: "Party Themes", href: "/ideas?category=themes", count: "300+" },
        ]
      },
      {
        title: "Real Events",
        items: [
          { name: "Decor Inspiration", href: "/ideas?category=decor", count: "500+" },
          { name: "Real Weddings", href: "/ideas?category=real-events", count: "200+" },
        ]
      }
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
      <div className="w-full bg-background overflow-y-auto">
        <nav className="container mx-auto px-4 py-4">
          {megaMenuData.map((item) => (
            <div key={item.label} className="mb-2 border-b border-border/50 last:border-0 pb-2">
              <button
                onClick={() =>
                  setExpandedMobile(
                    expandedMobile === item.label ? null : item.label,
                  )
                }
                className="w-full flex items-center justify-between py-3 px-2 text-lg font-medium text-foreground hover:bg-muted/30 rounded-lg transition-all"
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${expandedMobile === item.label ? "rotate-180" : ""
                    }`}
                />
              </button>

              {expandedMobile === item.label && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 pr-2 py-2 space-y-4">
                    {item.groups.map((group) => (
                      <div key={group.title}>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                          {group.title}
                        </h4>
                        <div className="space-y-1">
                          {group.items.map((sub) => (
                            <TransitionLink
                              key={sub.name}
                              href={sub.href}
                              onClick={onClose}
                              className="block py-2 text-base text-foreground hover:text-primary transition-colors"
                            >
                              {sub.name}
                            </TransitionLink>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </nav>
      </div>
    );
  }

  // Desktop version
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {megaMenuData.map((item) => (
        <div
          key={item.label}
          className="relative group"
          onMouseEnter={() => setHoveredItem(item.label)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <TransitionLink
            href={item.href}
            className="flex items-center py-4 text-sm font-bold uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary"
          >
            {item.label}
          </TransitionLink>

          <AnimatePresence>
            {hoveredItem === item.label && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-full w-[800px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="flex">
                  {/* Sidebar-like Group Headers */}
                  <div className="w-1/4 bg-muted/30 border-r border-border p-6 space-y-4">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {item.label}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {item.groups.map((group) => (
                        <div key={group.title} className="text-sm font-medium text-muted-foreground">
                          {group.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 p-8 grid grid-cols-3 gap-8">
                    {item.groups.map((group) => (
                      <div key={group.title} className="space-y-4">
                        <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border/50 pb-2">
                          {group.title}
                        </h4>
                        <ul className="space-y-2">
                          {group.items.map((sub) => (
                            <li key={sub.name}>
                              <TransitionLink
                                href={sub.href}
                                className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-all block py-1"
                              >
                                {sub.name}
                              </TransitionLink>
                            </li>
                          ))}
                        </ul>
                      </div>
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

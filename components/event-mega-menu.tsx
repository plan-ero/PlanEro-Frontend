"use client";

import { useState } from "react";
import { TransitionLink } from "@/components/transition-link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SubCategory {
    name: string;
    href: string;
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

const eventMegaMenuData: MegaMenuItem[] = [
    {
        label: "Weddings",
        href: "/venues?type=wedding",
        groups: [
            {
                title: "Wedding Venues",
                items: [
                    { name: "Hotel Weddings", href: "/venues?type=wedding&category=hotel" },
                    { name: "Outdoor Weddings", href: "/venues?type=wedding&category=outdoor" },
                    { name: "Barn Weddings", href: "/venues?type=wedding&category=barn" },
                    { name: "Restaurant Weddings", href: "/venues?type=wedding&category=restaurant" },
                    { name: "Rooftop Weddings", href: "/venues?type=wedding&category=rooftop" },
                    { name: "Winery Weddings", href: "/venues?type=wedding&category=winery" },
                ]
            },
            {
                title: "Wedding Vendors",
                items: [
                    { name: "Wedding Planners", href: "/vendors?type=planner" },
                    { name: "Photographers", href: "/vendors?type=photographer" },
                    { name: "Caterers", href: "/vendors?type=caterer" },
                    { name: "Florists", href: "/vendors?type=florist" },
                    { name: "DJs & Bands", href: "/vendors?type=music" },
                ]
            },
            {
                title: "Wedding Ideas",
                items: [
                    { name: "Real Weddings", href: "/ideas?category=real-weddings" },
                    { name: "Decor Ideas", href: "/ideas?category=decor" },
                    { name: "Themes & Trends", href: "/ideas?category=trends" },
                ]
            }
        ],
    },
    {
        label: "Corporate Events",
        href: "/venues?type=corporate",
        groups: [
            {
                title: "Corporate Venues",
                items: [
                    { name: "Conference Centers", href: "/venues?category=conference" },
                    { name: "Meeting Spaces", href: "/venues?category=meeting" },
                    { name: "Banquet Halls", href: "/venues?category=banquet" },
                    { name: "Coworking Spaces", href: "/venues?category=coworking" },
                ]
            },
            {
                title: "Corporate Services",
                items: [
                    { name: "Corporate Catering", href: "/vendors?type=catering&event=corporate" },
                    { name: "AV Rentals", href: "/vendors?type=av" },
                    { name: "Event Planners", href: "/vendors?type=planner&event=corporate" },
                ]
            }
        ],
    },
    {
        label: "Birthdays",
        href: "/venues?type=birthday",
        groups: [
            {
                title: "Birthday Venues",
                items: [
                    { name: "Party Halls", href: "/venues?category=hall" },
                    { name: "Restaurants", href: "/venues?category=restaurant" },
                    { name: "Rooftops", href: "/venues?category=rooftop" },
                    { name: "Bars & Clubs", href: "/venues?category=club" },
                ]
            },
            {
                title: "Party Vendors",
                items: [
                    { name: "DJs", href: "/vendors?type=dj" },
                    { name: "Decorators", href: "/vendors?type=decorator" },
                    { name: "Bakeries", href: "/vendors?type=bakery" },
                    { name: "Entertainers", href: "/vendors?type=entertainment" },
                ]
            }
        ],
    },
    {
        label: "Baby Showers",
        href: "/venues?type=baby-shower",
        groups: [
            {
                title: "Shower Venues",
                items: [
                    { name: "Tea Rooms", href: "/venues?category=tea-room" },
                    { name: "Gardens", href: "/venues?category=garden" },
                    { name: "Private Dining", href: "/venues?category=private-dining" },
                ]
            },
            {
                title: "Shower Ideas",
                items: [
                    { name: "Themes", href: "/ideas?category=baby-shower" },
                    { name: "Games", href: "/ideas?category=games" },
                    { name: "Favors", href: "/ideas?category=favors" },
                ]
            }
        ],
    },
    {
        label: "Fundraisers",
        href: "/venues?type=fundraiser",
        groups: [
            {
                title: "Gala Venues",
                items: [
                    { name: "Ballrooms", href: "/venues?category=ballroom" },
                    { name: "Museums", href: "/venues?category=museum" },
                    { name: "Historic Venues", href: "/venues?category=historic" },
                ]
            },
            {
                title: "Event Services",
                items: [
                    { name: "Auctioneers", href: "/vendors?type=auctioneer" },
                    { name: "Production", href: "/vendors?type=production" },
                ]
            }
        ],
    },
    {
        label: "More Celebrations",
        href: "/venues",
        groups: [
            {
                title: "Other Events",
                items: [
                    { name: "Anniversaries", href: "/venues?type=anniversary" },
                    { name: "Bar/Bat Mitzvahs", href: "/venues?type=mitzvah" },
                    { name: "Graduations", href: "/venues?type=graduation" },
                    { name: "Holiday Parties", href: "/venues?type=holiday" },
                    { name: "Engagement Parties", href: "/venues?type=engagement" },
                ]
            }
        ],
    },
];

export function EventMegaMenu() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);

    return (
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
            {eventMegaMenuData.map((item) => (
                <div
                    key={item.label}
                    className="relative group h-full flex items-center"
                    onMouseEnter={() => {
                        setHoveredItem(item.label);
                        setActiveGroupIndex(0);
                    }}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <TransitionLink
                        href={item.href}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-3 border-b-2 border-transparent hover:border-foreground"
                    >
                        {item.label}
                    </TransitionLink>

                    <AnimatePresence>
                        {hoveredItem === item.label && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 top-full w-[800px] bg-background border border-border/50 shadow-xl z-50 flex"
                                style={{ marginTop: "1px" }} // Slight offset
                            >
                                {/* Sidebar */}
                                <div className="w-64 bg-muted/10 border-r border-border/50 py-4">
                                    {item.groups.map((group, index) => (
                                        <button
                                            key={group.title}
                                            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors flex items-center justify-between ${activeGroupIndex === index
                                                    ? "text-foreground bg-muted/30 border-l-2 border-primary"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20 border-l-2 border-transparent"
                                                }`}
                                            onMouseEnter={() => setActiveGroupIndex(index)}
                                        >
                                            {group.title}
                                            {activeGroupIndex === index && (
                                                <ChevronRight className="h-4 w-4 text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6 bg-background">
                                    <h4 className="text-lg font-semibold mb-4 text-foreground">
                                        {item.groups[activeGroupIndex].title}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                        {item.groups[activeGroupIndex].items.map((sub) => (
                                            <TransitionLink
                                                key={sub.name}
                                                href={sub.href}
                                                className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors block py-1"
                                            >
                                                {sub.name}
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

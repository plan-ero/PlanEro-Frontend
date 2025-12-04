"use client";

import { useState, useEffect, useRef } from "react";
import { TransitionLink } from "@/components/transition-link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Menu,
  User,
  Heart,
  ShoppingCart,
  Bell,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Calendar,
  Filter,
  Sun,
  Moon,
  Monitor,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/hooks/use-cart";
import { MegaMenu } from "@/components/mega-menu";
import { EventMegaMenu } from "@/components/event-mega-menu";

export function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll direction logic
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      lastScrollY.current = currentScrollY;
      setIsScrolled(currentScrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAdvancedSearch = () => {
    router.push("/search/advanced");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
        : "bg-background"
        }`}
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="w-full px-4 md:px-6 border-b border-border/40 bg-background z-20 relative">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left Side: Logo & Main Nav */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Logo */}
            <TransitionLink
              href="/"
              className="flex items-center font-extrabold text-2xl text-foreground shrink-0"
            >
              <span className="font-medium">Plan</span>
              <span className="text-primary">Ero</span>
            </TransitionLink>

            {/* Main Navigation (Desktop) */}
            <div className="hidden lg:flex items-center gap-6">
              <MegaMenu />
            </div>
          </div>

          {/* Right Side: Search & Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Enhanced Search Bar - Desktop (Restored Style) */}
            <div className="hidden xl:block w-80">
              <form onSubmit={handleSearch} className="relative group">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 h-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all rounded-full"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleAdvancedSearch}
                    className="absolute right-1 h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Favorites */}
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex hover:text-primary">
              <TransitionLink href="/favorites">
                <Heart className="h-5 w-5" />
              </TransitionLink>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative hidden sm:flex hover:text-primary" asChild>
              <TransitionLink href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] border-2 border-background"
                  >
                    {items.length}
                  </Badge>
                )}
              </TransitionLink>
            </Button>

            {/* Notifications - Removed as per PartySlate layout */}
            {/* {session && (
              <Button variant="ghost" size="icon" className="relative hidden sm:flex rounded-full hover:bg-primary/10 hover:text-primary">
                <Bell className="h-5 w-5" />
                <div className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full border-2 border-background" />
              </Button>
            )} */}

            {/* Authentication Buttons */}
            {!session ? (
              <div className="hidden lg:flex items-center gap-3">
                <Button variant="outline" size="sm" className="font-semibold uppercase tracking-wide text-xs h-9 px-4 rounded-sm" asChild>
                  <TransitionLink href="/auth/signup">
                    Sign Up
                  </TransitionLink>
                </Button>
                <Button size="sm" className="font-semibold uppercase tracking-wide text-xs h-9 px-4 rounded-sm" onClick={() => signIn()}>
                  Log In
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
                  >
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage
                        src={session.user?.image || "/placeholder-user.jpg"}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                  <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg mb-2">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage
                        src={session.user?.image || "/placeholder-user.jpg"}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5 overflow-hidden">
                      <p className="font-semibold truncate">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-1">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <TransitionLink href="/dashboard">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </TransitionLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <TransitionLink href="/dashboard/bookings">
                        <Calendar className="mr-2 h-4 w-4" />
                        My Bookings
                      </TransitionLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <TransitionLink href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </TransitionLink>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="my-2" />

                  {/* Theme Toggle */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <Monitor className="mr-2 h-4 w-4" />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                        <Monitor className="mr-2 h-4 w-4" />
                        System
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full sm:w-96 p-0 overflow-y-auto"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="px-4 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
                    <span className="text-xl font-bold">
                      <span className="font-medium">Plan</span>
                      <span className="text-primary">Ero</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Search */}
                  <div className="p-4 border-b border-border">
                    <form
                      onSubmit={handleSearch}
                      className="flex flex-col gap-3"
                    >
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search..."
                          className="pl-10 w-full bg-muted/50"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Search
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAdvancedSearch}
                        >
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </div>

                  {/* Mobile Navigation with Mega Menu */}
                  <div className="flex-1 overflow-y-auto">
                    <MegaMenu isMobile onClose={() => setIsMenuOpen(false)} />

                    {/* Additional Mobile Links */}
                    <div className="px-4 py-2 border-t border-border mt-2">
                      <TransitionLink
                        href="/about"
                        className="flex items-center py-3 px-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        About
                      </TransitionLink>
                      <TransitionLink
                        href="/pwa"
                        className="flex items-center py-3 px-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get App
                      </TransitionLink>
                    </div>

                    {/* Mobile Actions */}
                    <div className="px-4 py-4 border-t border-border space-y-2">
                      {session && (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <TransitionLink href="/favorites">
                              <Heart className="mr-2 h-4 w-4" />
                              Favorites
                            </TransitionLink>
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <TransitionLink href="/cart">
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Cart ({items.length})
                            </TransitionLink>
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <TransitionLink href="/dashboard">
                              <User className="mr-2 h-4 w-4" />
                              Dashboard
                            </TransitionLink>
                          </Button>
                        </>
                      )}

                      {/* Theme Toggle */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between px-2 py-2">
                          <span className="text-sm font-medium">Theme</span>
                          <div className="flex gap-1">
                            <Button
                              variant={theme === "light" ? "secondary" : "ghost"}
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setTheme("light")}
                            >
                              <Sun className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={theme === "dark" ? "secondary" : "ghost"}
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setTheme("dark")}
                            >
                              <Moon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={theme === "system" ? "secondary" : "ghost"}
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setTheme("system")}
                            >
                              <Monitor className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Authentication for Mobile */}
                      {!session ? (
                        <div className="grid grid-cols-2 gap-3 pt-4">
                          <Button variant="outline" onClick={() => signIn()}>
                            Log In
                          </Button>
                          <Button asChild>
                            <TransitionLink
                              href="/auth/signup"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Sign Up
                            </TransitionLink>
                          </Button>
                        </div>
                      ) : (
                        <div className="pt-4">
                          <Button
                            variant="destructive"
                            className="w-full justify-start bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                            onClick={() => {
                              signOut();
                              setIsMenuOpen(false);
                            }}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Bottom Row: Event Types (Collapsible on Scroll) */}
      <div
        className={`hidden lg:block border-b border-border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/20 transition-all duration-300 ease-in-out ${scrollDirection === "down" ? "h-0 opacity-0 overflow-hidden" : "h-12 opacity-100 overflow-visible"
          }`}
      >
        <div className="w-full px-4 md:px-6 h-full">
          <div className="flex items-center justify-between h-full">
            <EventMegaMenu />
            <TransitionLink
              href="/auth/signup?role=vendor"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Are you a venue or vendor?
            </TransitionLink>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

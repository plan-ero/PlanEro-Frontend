"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

export function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm"
          : "bg-background border-b"
      }`}
    >
      <div className="container mx-auto px-2 sm:px-3 md:px-4">
        <div className="flex h-12 sm:h-14 md:h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center font-extrabold md:text-2xl text-foreground mr-2 sm:mr-4 md:mr-7"
          >
            <span className="font-medium">Plan</span>
            <span className="text-primary">Ero.</span>
          </Link>

          {/* Desktop Navigation with Mega Menu */}
          <MegaMenu />

          {/* Additional Links */}
          <nav className="hidden lg:flex items-center space-x-4 lg:space-x-6 ml-2">
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/pwa"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Get App
            </Link>
          </nav>

          {/* Enhanced Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-lg mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search venues, services, vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-20 h-10 bg-muted/50 border-input focus:bg-background transition-colors"
                />
                <div className="absolute right-2 flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAdvancedSearch}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    Advanced
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile Search */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Search className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto p-4 sm:p-6">
                <SheetTitle className="sr-only">Search</SheetTitle>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Search</h3>
                  <form onSubmit={handleSearch} className="space-y-3">
                    <Input
                      type="search"
                      placeholder="Search venues, services, vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAdvancedSearch}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Advanced
                      </Button>
                    </div>
                  </form>
                </div>
              </SheetContent>
            </Sheet>

            {/* Favorites */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/favorites">
                <Heart className="h-4 w-4" />
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4" />
                {items.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {items.length}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Notifications - Only show when authenticated */}
            {session && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>
            )}

            {/* Authentication & User Menu */}
            {status === "loading" ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
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
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {session.user?.name || "User"}
                      </p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/bookings">
                      <Calendar className="mr-2 h-4 w-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {/* Theme Toggle */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Monitor className="mr-2 h-4 w-4" />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        <Monitor className="mr-2 h-4 w-4" />
                        System
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => signIn()}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-96 p-0 overflow-y-auto">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <h1 className="px-4 py-4 text-xl border-t border-border">
                    <span className="font-medium">Plan</span>
                    <span className="text-primary">Ero.</span>
                  </h1>
                  {/* Mobile Navigation with Mega Menu */}
                  <div className="flex-1 overflow-y-auto">
                    <MegaMenu isMobile onClose={() => setIsMenuOpen(false)} />

                    {/* Additional Mobile Links */}
                    <div className="px-4 py-4 border-t border-border">
                      <Link
                        href="/about"
                        className="block py-3 px-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        About
                      </Link>
                      <Link
                        href="/pwa"
                        className="block py-3 px-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get App
                      </Link>
                    </div>

                    {/* Mobile Actions */}
                    <div className="px-4 py-4 border-t border-border space-y-4">
                      {session && (
                        <>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            asChild
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Link href="/favorites">
                              <Heart className="mr-2 h-4 w-4" />
                              Favorites
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            asChild
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Link href="/cart">
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Cart ({items.length})
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            asChild
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Link href="/dashboard">
                              <User className="mr-2 h-4 w-4" />
                              Dashboard
                            </Link>
                          </Button>
                        </>
                      )}

                      {/* Theme Toggle */}
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2">Theme</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={theme === "light" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("light")}
                          >
                            <Sun className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("dark")}
                          >
                            <Moon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={theme === "system" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("system")}
                          >
                            <Monitor className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Authentication for Mobile */}
                      {!session ? (
                        <div className="space-y-2 pt-4">
                          <Button className="w-full" onClick={() => signIn()}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                          </Button>
                          <Button variant="outline" className="w-full" asChild>
                            <Link
                              href="/auth/signup"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Sign Up
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-4 pb-safe">
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={session.user?.image || "/placeholder-user.jpg"}
                                alt={session.user?.name || "User"}
                              />
                              <AvatarFallback>
                                {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {session.user?.name || "User"}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {session.user?.email}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
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
    </header>
  );
}

export default Header;

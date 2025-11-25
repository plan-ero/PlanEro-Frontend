"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { TransitionLink } from "@/components/transition-link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MegaMenu } from "@/components/mega-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { items } = useCart();
  const { user, signOut } = useAuth();
  const router = useRouter();

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
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50"
          : "bg-background/80 backdrop-blur-sm border-b border-border/30"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <TransitionLink href="/" className="flex items-center space-x-2 z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PLANERO
              </span>
            </motion.div>
          </TransitionLink>

          {/* Desktop Navigation with Mega Menu */}
          <MegaMenu />

          {/* Additional Links */}
          <nav className="hidden md:flex items-center space-x-1 ml-2">
            {[{ href: "/about", label: "About" }].map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
              >
                {item.label}
              </TransitionLink>
            ))}
          </nav>

          {/* Enhanced Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <motion.form
              onSubmit={handleSearch}
              className="relative w-full group"
              animate={{ scale: isSearchFocused ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`relative transition-all duration-300 ${isSearchFocused ? "shadow-lg" : "shadow-sm"
                  }`}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors" />
                <Input
                  type="search"
                  placeholder="Search venues, services, vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-11 pr-12 h-11 bg-muted/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-200 rounded-full"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/search/advanced")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full hover:bg-primary/10"
                >
                  <Filter className="h-3 w-3" />
                </Button>
              </div>
            </motion.form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex w-9 h-9 rounded-full hover:bg-muted/80"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:flex w-9 h-9 rounded-full hover:bg-muted/80 relative"
            >
              <TransitionLink href="/favorites">
                <Heart className="h-4 w-4" />
              </TransitionLink>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="w-9 h-9 rounded-full hover:bg-muted/80 relative"
            >
              <TransitionLink href="/cart">
                <ShoppingCart className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground border-2 border-background">
                    {cartItemsCount}
                  </Badge>
                )}
              </TransitionLink>
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center space-x-2 h-9 px-3 rounded-full hover:bg-muted/80"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.avatar || undefined} />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate max-w-20">
                      {user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-destructive"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/auth/signin")}
                  className="h-9 px-4 rounded-full hover:bg-muted/80"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/auth/signup")}
                  className="h-9 px-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9 rounded-full hover:bg-muted/80"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {!isMenuOpen && (
            <div className="md:hidden pb-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search venues, services, vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-12 h-11 bg-muted/50 border-border/50 rounded-full"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/search/advanced")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full"
                >
                  <Filter className="h-3 w-3" />
                </Button>
              </form>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side="left"
          className="w-full sm:max-w-md p-0 overflow-y-auto"
        >
          <SheetHeader className="px-6 py-4 border-b border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PLANERO
              </span>
            </SheetTitle>
          </SheetHeader>

          {/* Only render content when menu is open for better performance */}
          {isMenuOpen && (
            <div className="min-h-full">
              {/* Mobile Navigation with Mega Menu */}
              <MegaMenu isMobile onClose={() => setIsMenuOpen(false)} />

              {/* Additional Mobile Links */}
              <div className="px-4 py-4 border-t border-border">
                <TransitionLink
                  href="/about"
                  className="block py-3 px-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </TransitionLink>
              </div>

              {/* Mobile Actions */}
              <div className="px-4 flex flex-col space-y-4 py-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Settings
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="w-9 h-9 rounded-full"
                    >
                      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="w-9 h-9 rounded-full"
                    >
                      <TransitionLink href="/favorites">
                        <Heart className="h-4 w-4" />
                      </TransitionLink>
                    </Button>
                  </div>
                </div>

                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || undefined} />
                        <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                          {user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push("/dashboard");
                          setIsMenuOpen(false);
                        }}
                        className="justify-start"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="justify-start text-destructive hover:text-destructive"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        router.push("/auth/signin");
                        setIsMenuOpen(false);
                      }}
                      className="h-11"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        router.push("/auth/signup");
                        setIsMenuOpen(false);
                      }}
                      className="h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
}

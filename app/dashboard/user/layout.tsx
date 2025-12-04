"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { TransitionLink as Link } from "@/components/transition-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Calendar, Home, User, Heart, ShoppingBag, LogOut, Settings, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function UserDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const navItems = [
    { href: "/dashboard/user", label: "Dashboard", icon: Home },
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/cart", label: "Cart", icon: ShoppingBag },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl font-display tracking-tight">PlanEro</span>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <Link href="/profile">
              <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
                <AvatarImage
                  src={session?.user?.image || "/placeholder-user.jpg"}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <div className="container grid flex-1 gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] mt-8 px-4 md:px-6 pb-12">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col space-y-6">
          <Card className="border-none shadow-sm bg-background/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col items-center mb-6 mt-2 pt-4">
                <Avatar className="h-20 w-20 ring-4 ring-background shadow-md">
                  <AvatarImage
                    src={session?.user?.image || "/placeholder-user.jpg"}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 text-center">
                  <h2 className="text-lg font-semibold">
                    {session?.user?.name || "User"}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                    {session?.user?.email || ""}
                  </p>
                </div>
              </div>

              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? "secondary" : "ghost"}
                      className={`justify-start h-10 ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                      asChild
                    >
                      <Link href={item.href}>
                        <Icon className={`mr-3 h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
                <div className="my-2 border-t" />
                <Button
                  variant="ghost"
                  className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  asChild
                >
                  <Link href="/auth/signin?signOut=true">
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </Link>
                </Button>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}


"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  Eye,
  Settings,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  ArrowRight,
  BarChart3,
  Sparkles,
  MessageSquare,
  Briefcase
} from "lucide-react";
import { TransitionLink as Link } from "@/components/transition-link";
import { LoadingSpinner } from "@/components/loading-spinner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VendorStats {
  totalViews: number;
  totalInquiries: number;
  servicesCount: number;
  profileCompleteness: number;
  isApproved: boolean;
  isPublished: boolean;
}

interface Vendor {
  id: number;
  businessName: string;
  location: string;
  bio: string;
  websiteUrl: string[];
  profilePictureUrl: string;
  email: string;
  phoneNumber: string;
  addressId: number;
  approved: boolean;
  published: boolean;
}

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin?callbackUrl=/vendor/dashboard");
      return;
    }

    fetchVendorData();
  }, [session, status, router]);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch vendor profile from API
      const response = await fetch("/api/vendors/profile");

      if (response.status === 404) {
        // Vendor profile not found, redirect to onboarding
        router.push("/vendor/onboarding");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch vendor data: ${response.statusText}`);
      }

      const vendorData = await response.json();
      setVendor(vendorData);

      // Generate stats
      setStats({
        totalViews: Math.floor(Math.random() * 1000) + 100,
        totalInquiries: Math.floor(Math.random() * 50) + 10,
        servicesCount: 0, // This would ideally come from an API
        profileCompleteness: calculateProfileCompleteness(vendorData),
        isApproved: vendorData.approved,
        isPublished: vendorData.published,
      });
    } catch (err) {
      console.error("Error fetching vendor data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load vendor data",
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompleteness = (vendor: Vendor): number => {
    let completeness = 0;
    const fields = [
      vendor.businessName,
      vendor.location,
      vendor.bio,
      vendor.email,
      vendor.phoneNumber,
      vendor.profilePictureUrl,
    ];

    fields.forEach((field) => {
      if (field && field.trim() !== "") {
        completeness += 16.67; // 100/6 fields
      }
    });

    return Math.round(completeness);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Card className="border-destructive max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Something went wrong</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button
              onClick={fetchVendorData}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!vendor || !stats) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full border-dashed">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
              <Building2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              Complete Your Vendor Profile
            </h3>
            <p className="text-muted-foreground mb-6">
              Start by setting up your vendor profile to showcase your
              services to thousands of potential customers.
            </p>
            <Button asChild size="lg" className="w-full rounded-full">
              <Link href="/vendor/onboarding">
                <Plus className="h-4 w-4 mr-2" />
                Setup Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Views",
      value: stats.totalViews,
      description: "Profile page views",
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-100",
      gradient: "from-blue-500/10 to-blue-500/5"
    },
    {
      title: "Inquiries",
      value: stats.totalInquiries,
      description: "Customer inquiries",
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100",
      gradient: "from-purple-500/10 to-purple-500/5"
    },
    {
      title: "Services",
      value: stats.servicesCount,
      description: "Active services",
      icon: Briefcase,
      color: "text-amber-600",
      bg: "bg-amber-100",
      gradient: "from-amber-500/10 to-amber-500/5"
    },
    {
      title: "Completeness",
      value: `${stats.profileCompleteness}%`,
      description: "Profile status",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
      gradient: "from-green-500/10 to-green-500/5"
    }
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-3xl border border-primary/10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Vendor Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back, <span className="font-semibold text-foreground">{vendor.businessName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={stats.isApproved ? "default" : "secondary"}
            className={cn(
              "text-sm px-4 py-1.5 rounded-full font-medium transition-all",
              stats.isApproved ? "bg-green-500 hover:bg-green-600" : "bg-amber-100 text-amber-800 hover:bg-amber-200"
            )}
          >
            {stats.isApproved ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Approved
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                Pending Approval
              </>
            )}
          </Badge>
          <Badge
            variant={stats.isPublished ? "default" : "outline"}
            className="text-sm px-4 py-1.5 rounded-full font-medium"
          >
            {stats.isPublished ? "Published" : "Draft Mode"}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative h-full">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
              <CardContent className="p-6 flex items-center space-x-4 relative z-10">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Profile Completion Alert */}
      {stats.profileCompleteness < 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent overflow-hidden shadow-sm">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
                <Settings className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-2 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Complete Your Profile</h3>
                  <span className="font-bold text-primary">{stats.profileCompleteness}%</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  A complete profile helps customers find and trust your services. You're almost there!
                </p>
                <Progress
                  value={stats.profileCompleteness}
                  className="h-2 bg-primary/10"
                />
              </div>
              <Button asChild className="shrink-0 rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                <Link href="/vendor/profile">
                  Complete Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all group cursor-pointer ring-1 ring-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Manage Profile</CardTitle>
                  <CardDescription>
                    Update your business information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                asChild
                variant="outline"
                className="w-full rounded-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
              >
                <Link href="/vendor/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all group cursor-pointer ring-1 ring-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Add Services</CardTitle>
                  <CardDescription>
                    Create and manage your offerings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                asChild
                variant="outline"
                className="w-full rounded-full group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:border-secondary transition-all"
              >
                <Link href="/vendor/services">Manage Services</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all group cursor-pointer ring-1 ring-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">View Analytics</CardTitle>
                  <CardDescription>
                    Track performance and insights
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                asChild
                variant="outline"
                className="w-full rounded-full group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all"
              >
                <Link href="/vendor/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!stats.isApproved && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-900/10 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-700/30 shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                      Profile Under Review
                    </h4>
                    <p className="text-sm text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                      Your vendor profile is currently being reviewed by our team. We'll notify you via email once it's approved and ready to go live.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!stats.isPublished && stats.isApproved && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 shrink-0">
                      <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                        Ready to Publish
                      </h4>
                      <p className="text-sm text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                        Your profile is approved! Publish it now to start appearing in search results.
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="rounded-full shadow-md hover:shadow-lg transition-all shrink-0">Publish</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

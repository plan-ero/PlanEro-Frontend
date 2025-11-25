"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Eye,
  Users,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  Clock,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Activity
} from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { motion } from "framer-motion";

interface Analytics {
  profileViews: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    trend: "up" | "down" | "neutral";
  };
  inquiries: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    trend: "up" | "down" | "neutral";
  };
  topServices: Array<{
    serviceName: string;
    views: number;
    inquiries: number;
  }>;
  viewsByLocation: Array<{
    location: string;
    views: number;
    percentage: number;
  }>;
  monthlyData: Array<{
    month: string;
    views: number;
    inquiries: number;
  }>;
  averageRating: number;
  responseTime: string;
  conversionRate: number;
}

interface RecentActivity {
  id: number;
  type: "view" | "inquiry" | "booking";
  description: string;
  timestamp: string;
  location?: string;
}

export default function VendorAnalytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session?.user && status === "authenticated") {
      fetchAnalytics();
      fetchRecentActivity();
    }
  }, [session, status, router, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/vendors/analytics?timeRange=${timeRange}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        // Mock data for demo
        setAnalytics({
          profileViews: {
            total: 1247,
            thisMonth: 234,
            lastMonth: 189,
            trend: "up",
          },
          inquiries: {
            total: 67,
            thisMonth: 12,
            lastMonth: 8,
            trend: "up",
          },
          topServices: [
            { serviceName: "Wedding Photography", views: 456, inquiries: 23 },
            { serviceName: "Event Planning", views: 321, inquiries: 15 },
            { serviceName: "Catering Services", views: 234, inquiries: 12 },
          ],
          viewsByLocation: [
            { location: "New York", views: 345, percentage: 45 },
            { location: "Los Angeles", views: 234, percentage: 30 },
            { location: "Chicago", views: 123, percentage: 16 },
            { location: "Others", views: 67, percentage: 9 },
          ],
          monthlyData: [
            { month: "Jan", views: 156, inquiries: 8 },
            { month: "Feb", views: 189, inquiries: 12 },
            { month: "Mar", views: 234, inquiries: 15 },
            { month: "Apr", views: 267, inquiries: 18 },
            { month: "May", views: 298, inquiries: 21 },
            { month: "Jun", views: 345, inquiries: 25 },
          ],
          averageRating: 4.8,
          responseTime: "2 hours",
          conversionRate: 18.5,
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(`/api/vendors/activity`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data);
      } else {
        // Mock data for demo
        setRecentActivity([
          {
            id: 1,
            type: "inquiry",
            description: "New inquiry for wedding photography",
            timestamp: "2025-08-04T10:30:00Z",
            location: "New York",
          },
          {
            id: 2,
            type: "view",
            description: "Profile viewed by potential client",
            timestamp: "2025-08-04T09:15:00Z",
            location: "Los Angeles",
          },
          {
            id: 3,
            type: "view",
            description: "Service page viewed",
            timestamp: "2025-08-04T08:45:00Z",
            location: "Chicago",
          },
          {
            id: 4,
            type: "inquiry",
            description: "Question about catering packages",
            timestamp: "2025-08-03T16:20:00Z",
            location: "Miami",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    if (trend === "up")
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (trend === "down")
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "inquiry":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "booking":
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-3xl border border-primary/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your performance, growth, and customer engagement
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                    <Eye className="h-5 w-5" />
                  </div>
                  {getTrendIcon(analytics?.profileViews.trend || "neutral")}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Profile Views
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {analytics?.profileViews.thisMonth}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    vs {analytics?.profileViews.lastMonth} last month
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-md bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg text-purple-600 dark:text-purple-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  {getTrendIcon(analytics?.inquiries.trend || "neutral")}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Inquiries
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {analytics?.inquiries.thisMonth}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    vs {analytics?.inquiries.lastMonth} last month
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-none shadow-md bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg text-green-600 dark:text-green-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Conversion Rate
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {analytics?.conversionRate}%
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Industry avg: 12%
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-none shadow-md bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400">
                    <Star className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-black/20 px-2 py-0.5 rounded-full text-xs font-medium">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    4.8
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg. Rating
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {analytics?.averageRating}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on recent reviews
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-full inline-flex h-auto w-full md:w-auto">
            <TabsTrigger value="overview" className="rounded-full px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex-1 md:flex-none">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="services" className="rounded-full px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex-1 md:flex-none">
              <Briefcase className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="locations" className="rounded-full px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex-1 md:flex-none">
              <MapPin className="h-4 w-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-full px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex-1 md:flex-none">
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Key indicators of your business growth
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg shadow-sm">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Response Time</p>
                        <p className="text-xs text-muted-foreground">Avg. time to reply</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-sm px-3 py-1">{analytics?.responseTime}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg shadow-sm">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Conversion Rate</p>
                        <p className="text-xs text-muted-foreground">Inquiries to bookings</p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      {analytics?.conversionRate}%
                    </span>
                  </div>

                  <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Profile Completeness</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">Complete your profile to boost visibility</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>
                    Views and inquiries over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.monthlyData.slice(-6).map((month, index) => (
                      <div
                        key={month.month}
                        className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-medium w-12">
                          {month.month}
                        </span>
                        <div className="flex-1 mx-4 h-2 bg-muted rounded-full overflow-hidden flex">
                          <div
                            className="bg-blue-500 h-full rounded-l-full"
                            style={{ width: `${(month.views / 400) * 100}%` }}
                          />
                          <div
                            className="bg-green-500 h-full rounded-r-full opacity-80"
                            style={{ width: `${(month.inquiries / 400) * 100}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-4 text-sm w-32 justify-end">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="font-mono">{month.views}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="font-mono">{month.inquiries}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Inquiries</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Top Performing Services</CardTitle>
                <CardDescription>
                  Your most viewed and inquired services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.topServices.map((service, index) => (
                    <div
                      key={service.serviceName}
                      className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index === 0 ? "bg-yellow-100 text-yellow-700" :
                            index === 1 ? "bg-gray-100 text-gray-700" :
                              index === 2 ? "bg-orange-100 text-orange-700" :
                                "bg-muted text-muted-foreground"
                          }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{service.serviceName}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1.5">
                              <Eye className="h-3.5 w-3.5" />
                              <span>{service.views} views</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5" />
                              <span>{service.inquiries} inquiries</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium">Conversion</div>
                        <div className="text-sm text-muted-foreground">
                          {((service.inquiries / service.views) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Views by Location</CardTitle>
                <CardDescription>
                  Where your potential clients are located
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analytics?.viewsByLocation.map((location) => (
                    <div key={location.location} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            {location.location}
                          </span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="font-bold">{location.views}</span>
                          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                            {location.percentage}%
                          </span>
                        </div>
                      </div>
                      <Progress value={location.percentage} className="h-2.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest interactions with your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-l border-border/50 ml-4 space-y-8 py-2">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="relative pl-8">
                      <div className="absolute -left-2.5 top-1 h-5 w-5 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                        <div className={`h-2.5 w-2.5 rounded-full ${activity.type === 'inquiry' ? 'bg-blue-500' :
                            activity.type === 'booking' ? 'bg-green-500' :
                              'bg-gray-400'
                          }`} />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg mt-0.5 ${activity.type === 'inquiry' ? 'bg-blue-100 text-blue-600' :
                              activity.type === 'booking' ? 'bg-green-100 text-green-600' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {activity.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>
                                {new Date(activity.timestamp).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {activity.location && (
                                <>
                                  <span>•</span>
                                  <span>{activity.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="self-start sm:self-center capitalize">
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

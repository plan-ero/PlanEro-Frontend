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
} from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";

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
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "down")
      return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    return <TrendingUp className="h-4 w-4 text-gray-500" />;
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
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Track your performance and growth
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
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
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Profile Views
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics?.profileViews.thisMonth}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(analytics?.profileViews.trend || "neutral")}
                    <span className="text-xs text-muted-foreground">
                      vs last month
                    </span>
                  </div>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Inquiries
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics?.inquiries.thisMonth}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(analytics?.inquiries.trend || "neutral")}
                    <span className="text-xs text-muted-foreground">
                      vs last month
                    </span>
                  </div>
                </div>
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics?.conversionRate}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">
                      Industry avg: 12%
                    </span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg. Rating
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold">
                      {analytics?.averageRating}
                    </p>
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">
                      Based on reviews
                    </span>
                  </div>
                </div>
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Key indicators of your business growth
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Response Time</span>
                    </div>
                    <Badge variant="outline">{analytics?.responseTime}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Conversion Rate</span>
                    </div>
                    <span className="font-medium">
                      {analytics?.conversionRate}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile Completeness</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>
                    Views and inquiries over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.monthlyData.slice(-6).map((month) => (
                      <div
                        key={month.month}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">
                          {month.month}
                        </span>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-blue-500" />
                            <span>{month.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-green-500" />
                            <span>{month.inquiries}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
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
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{service.serviceName}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{service.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{service.inquiries} inquiries</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Views by Location</CardTitle>
                <CardDescription>
                  Where your potential clients are located
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.viewsByLocation.map((location) => (
                    <div key={location.location} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {location.location}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{location.views}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({location.percentage}%)
                          </span>
                        </div>
                      </div>
                      <Progress value={location.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest interactions with your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>
                            {new Date(activity.timestamp).toLocaleDateString()}
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

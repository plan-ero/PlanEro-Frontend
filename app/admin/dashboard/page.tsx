"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  BarChart3,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";
import { TransitionLink as Link } from "@/components/transition-link";

// Mock data - replace with actual API calls
const dashboardStats = {
  totalUsers: 156,
  totalVendors: 42,
  pendingVendors: 8,
  approvedVendors: 34,
  totalServices: 89,
  monthlyRevenue: 45678,
};

const recentVendors = [
  {
    id: "1",
    businessName: "Elite Catering Co.",
    ownerName: "Sarah Johnson",
    email: "sarah@elitecatering.com",
    status: "pending",
    createdAt: "2024-08-10",
  },
  {
    id: "2",
    businessName: "Perfect Flowers",
    ownerName: "Mike Chen",
    email: "mike@perfectflowers.com",
    status: "pending",
    createdAt: "2024-08-09",
  },
  {
    id: "3",
    businessName: "Sound & Light Pro",
    ownerName: "David Wilson",
    email: "david@soundlight.com",
    status: "approved",
    createdAt: "2024-08-08",
  },
];

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(dashboardStats);
  const [vendors, setVendors] = useState(recentVendors);

  return (
    <div className="min-h-screen bg-background/70">
      {/* Header */}
      <header className="bg-background shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-secondary">
                Welcome back, {session?.user?.name || "Admin"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <Shield className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Vendors
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVendors}</div>
                <p className="text-xs text-muted-foreground">
                  +8 new this month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approvals
                </CardTitle>
                <XCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.pendingVendors}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.monthlyRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +23% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                Vendor Management
              </CardTitle>
              <CardDescription>
                Manage vendor applications and approvals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/admin/vendors">View All Vendors</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/vendors/pending">
                  Review Pending ({stats.pendingVendors})
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/admin/users">View All Users</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/users/roles">Manage Roles</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Analytics
              </CardTitle>
              <CardDescription>
                View platform analytics and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/admin/analytics">View Analytics</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/reports">Generate Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Vendor Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Vendor Applications</CardTitle>
            <CardDescription>
              Latest vendor registration requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendors.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-semibold">{vendor.businessName}</p>
                        <p className="text-sm text-gray-600">
                          {vendor.ownerName} • {vendor.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          Applied on {vendor.createdAt}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        vendor.status === "approved" ? "default" : "secondary"
                      }
                      className={
                        vendor.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {vendor.status === "approved" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {vendor.status}
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/vendors/${vendor.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/admin/vendors">View All Vendors</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

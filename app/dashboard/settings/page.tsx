"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell, Shield, Save, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile, security, and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-background border p-1 h-auto">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary py-2">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary py-2">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary py-2">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and public profile</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        defaultValue={session?.user?.name || ""}
                        placeholder="Your name"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        defaultValue={session?.user?.email || ""}
                        disabled
                        className="bg-muted h-10"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, Country"
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={loading} className="min-w-[120px]">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" className="h-10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" className="h-10" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="outline">Update Password</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-primary" />
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-0.5">
                      <div className="font-medium">Secure your account</div>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what you want to be notified about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your account activity and bookings
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features, promotions, and tips
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Booking Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when a vendor accepts or updates your booking
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


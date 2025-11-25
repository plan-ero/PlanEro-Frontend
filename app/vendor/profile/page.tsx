"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Building2,
  Globe,
  Camera,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  Mail,
  ShieldCheck,
  MapPin,
  Phone,
  Sparkles
} from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import ImageUpload from "@/components/image-upload";
import EmailVerification from "@/components/email-verification";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(1000, "Bio must be less than 1000 characters"),
  websiteUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  profilePictureUrl: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const accountSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

const settingsSchema = z.object({
  isPublished: z.boolean(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
});

type ProfileForm = z.infer<typeof profileSchema>;
type AccountForm = z.infer<typeof accountSchema>;
type SettingsForm = z.infer<typeof settingsSchema>;

interface Vendor {
  id: number;
  businessName: string;
  location: string;
  bio: string;
  websiteUrl?: string[]; // Backend has List<String>
  profilePictureUrl?: string;
  email: string;
  phoneNumber?: string;
  isApproved: boolean;
  isPublished: boolean;
  emailVerified: boolean;
  addressId?: number;
  priceEnum?: string;
  totalRating?: number;
  numberOfRatings?: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: string;
}

export default function VendorProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authIssue, setAuthIssue] = useState(false);
  const [dataFetched, setDataFetched] = useState(false); // Prevent unnecessary re-fetching
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0); // Track last submission time
  const submissionInProgress = useRef(false); // More reliable submission tracking
  const preventFetch = useRef(false); // Prevent fetchData after successful submissions
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  // emailVerified state is now derived from vendor data

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const accountForm = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
  });

  const settingsForm = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (
      session?.user &&
      status === "authenticated" &&
      !dataFetched &&
      !preventFetch.current
    ) {
      fetchData();
    }
  }, [session, status, router, dataFetched]); // Keep session dependency but add preventFetch check

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch vendor profile
      const vendorResponse = await fetch(`/api/vendors/profile`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (vendorResponse.ok) {
        const vendorData = await vendorResponse.json();
        console.log("✅ Vendor data received:", vendorData);
        setVendor(vendorData);

        const formData = {
          businessName: vendorData.businessName || "",
          location: vendorData.location || "",
          bio: vendorData.bio || "",
          websiteUrl: vendorData.websiteUrl?.[0] || "", // Take first URL from array
          profilePictureUrl: vendorData.profilePictureUrl || "",
          phoneNumber: vendorData.phoneNumber || "",
        };
        console.log("🔧 Resetting form with data:", formData);
        profileForm.reset(formData);

        settingsForm.reset({
          isPublished: vendorData.isPublished,
          emailNotifications: true,
          smsNotifications: false,
        });

        // Verify form was updated correctly
        setTimeout(() => {
          console.log("✅ Form values after reset:", profileForm.getValues());
        }, 100);
      } else if (vendorResponse.status === 404) {
        // Vendor profile doesn't exist yet - this is ok, we'll show creation form
        const errorData = await vendorResponse.json().catch(() => ({}));
        setVendor(null);
        if (errorData.needsCreation) {
          toast.success(
            "Welcome! Please create your vendor profile to get started",
          );
        } else {
          console.error("Vendor profile not found:", errorData);
          toast.error(
            errorData.error ||
            "Vendor profile not found. Please create one to continue.",
          );
        }
      } else {
        const errorData = await vendorResponse
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("Vendor profile fetch error:", errorData);

        // Check if this is likely an authentication token mismatch
        if (
          errorData.error &&
          errorData.error.includes("email") &&
          vendorResponse.status === 404
        ) {
          setAuthIssue(true);
          toast.error(
            "Authentication session mismatch detected. Please sign out and sign back in to refresh your session.",
          );
        } else {
          toast.error(
            `Failed to load vendor profile: ${errorData.error || "Unknown error"}`,
          );
        }
        setVendor(null);
      }

      // Fetch user account info
      const userResponse = await fetch(`/api/users/profile`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        accountForm.reset({
          username: userData.username || "",
          email: userData.email || "",
        });
      } else {
        const errorData = await userResponse
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("User profile fetch error:", errorData);
        toast.error(
          `Failed to load user profile: ${errorData.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(
        "Network error: Failed to load profile data. Please check your connection.",
      );
    } finally {
      setLoading(false);
      setDataFetched(true); // Mark data as fetched
    }
  };

  const handleImageUploaded = async (url: string) => {
    console.log("=== VendorProfile.handleImageUploaded START ===");
    console.log("Uploaded URL:", url);

    profileForm.setValue("profilePictureUrl", url);

    // Also update in backend immediately
    if (vendor) {
      console.log("Updating vendor profile in backend...");
      try {
        const response = await fetch(`/api/vendors/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...vendor,
            profilePictureUrl: url, // Update the profile picture
            websiteUrl: vendor.websiteUrl || [],
          }),
        });

        console.log("Backend response status:", response.status);

        if (response.ok) {
          const updatedVendor = await response.json();
          console.log("Backend response data:", updatedVendor);
          setVendor(updatedVendor);
          toast.success("Profile picture uploaded and saved successfully!");
          console.log(
            "=== VendorProfile.handleImageUploaded END (SUCCESS) ===",
          );
        } else {
          const errorData = await response.json();
          console.error("Backend error:", errorData);
          toast.error(
            "Failed to update profile. Please save your changes manually.",
          );
          console.log("=== VendorProfile.handleImageUploaded END (FAILED) ===");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Network error. Please save your changes manually.");
        console.log(
          "=== VendorProfile.handleImageUploaded END (EXCEPTION) ===",
        );
      }
    } else {
      console.log("No vendor data available, only updated form");
      toast.success("Profile picture uploaded successfully!");
      console.log("=== VendorProfile.handleImageUploaded END (NO VENDOR) ===");
    }
  };

  const handleImageDeleted = async () => {
    console.log("=== VendorProfile.handleImageDeleted START ===");

    // Set form value to empty
    profileForm.setValue("profilePictureUrl", "");

    // Also update in backend immediately
    if (vendor) {
      console.log("Updating vendor profile in backend to remove picture...");
      try {
        const response = await fetch(`/api/vendors/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...vendor,
            profilePictureUrl: "", // Clear the profile picture
            websiteUrl: vendor.websiteUrl || [],
          }),
        });

        console.log("Backend response status:", response.status);

        if (response.ok) {
          const updatedVendor = await response.json();
          console.log("Backend response data:", updatedVendor);
          setVendor(updatedVendor);
          toast.success("Profile picture removed successfully!");
          console.log("=== VendorProfile.handleImageDeleted END (SUCCESS) ===");
        } else {
          const errorData = await response.json();
          console.error("Backend error:", errorData);
          toast.error(
            "Failed to update profile. Please save your changes manually.",
          );
          console.log("=== VendorProfile.handleImageDeleted END (FAILED) ===");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Network error. Please save your changes manually.");
        console.log("=== VendorProfile.handleImageDeleted END (EXCEPTION) ===");
      }
    } else {
      console.log("No vendor data available, only updated form");
      toast.success("Profile picture removed!");
      console.log("=== VendorProfile.handleImageDeleted END (NO VENDOR) ===");
    }
  };

  const onProfileSubmit = async (data: ProfileForm) => {
    const now = Date.now();
    const timeDiff = now - lastSubmitTime;

    // Multiple layers of protection against double submission
    if (submissionInProgress.current || saving || timeDiff < 2000) {
      toast.error(
        "Please wait, your previous submission is still processing...",
      );
      return;
    }

    try {
      // Set all protection flags immediately
      submissionInProgress.current = true;
      setSaving(true);
      setLastSubmitTime(now);

      // Validate required fields
      const requiredFields = ["businessName", "location", "bio"] as const;
      const missingFields = requiredFields.filter((field) => {
        const value = data[field];
        return !value || value.trim() === "";
      });

      if (missingFields.length > 0) {
        toast.error(
          `Please fill in required fields: ${missingFields.join(", ")}`,
        );
        console.error("❌ Missing required fields:", missingFields);
        return;
      }

      // Validate bio length
      if (data.bio && data.bio.length < 50) {
        toast.error("Bio must be at least 10 characters long");
        console.error("❌ Bio too short:", data.bio.length);
        return;
      }

      // Convert websiteUrl string to array for backend
      const profileData = {
        ...data,
        websiteUrl: data.websiteUrl ? [data.websiteUrl] : [],
      };

      // Always try PUT first to update existing vendor
      let response = await fetch(`/api/vendors/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      // If PUT fails with 404 (vendor not found), try POST to create new vendor
      if (response.status === 404) {
        response = await fetch(`/api/vendors/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        });
      }

      if (response.ok) {
        const responseData = await response.json();
        toast.success(
          vendor
            ? "Profile updated successfully!"
            : "Profile created successfully!",
        );

        // Update local state with the saved data instead of fetching
        setVendor(responseData);

        // Prevent any subsequent fetchData calls that might reset the form
        preventFetch.current = true;
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error occurred" }));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `Failed to save profile (${response.status})`;
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Network error: Please check your connection and try again.");
    } finally {
      setSaving(false);
      submissionInProgress.current = false;
    }
  };

  const onSettingsSubmit = async (data: SettingsForm) => {
    try {
      setSaving(true);

      const response = await fetch(`/api/vendors/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        setVendor((prev) =>
          prev ? { ...prev, ...responseData } : responseData,
        ); // Update vendor state directly
        toast.success("Settings updated successfully!");
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error occurred" }));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `Failed to update settings (${response.status})`;
        console.error("Settings update error:", errorData);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Network error: Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleVerificationComplete = (token: string) => {
    // Update the vendor state to reflect verified email
    setVendor((prev) => (prev ? { ...prev, emailVerified: true } : null));
    setShowVerificationDialog(false);
    toast.success("Email verified successfully! Your account is now verified.");
  };

  const openVerificationDialog = () => {
    if (!vendor?.email) {
      toast.error("Email address not found");
      return;
    }
    setShowVerificationDialog(true);
  };

  const getStatusInfo = () => {
    if (!vendor)
      return {
        icon: AlertCircle,
        text: "No Profile",
        variant: "secondary" as const,
      };

    if (!vendor.isApproved) {
      return {
        icon: AlertCircle,
        text: "Pending Approval",
        variant: "secondary" as const,
        description: "Your profile is under review",
      };
    }
    if (!vendor.isPublished) {
      return {
        icon: EyeOff,
        text: "Not Published",
        variant: "outline" as const,
        description: "Your profile is approved but not visible to the public",
      };
    }
    return {
      icon: CheckCircle,
      text: "Live",
      variant: "default" as const,
      description: "Your profile is live and visible to customers",
    };
  };

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="container mx-auto py-8 max-w-5xl px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-3xl border border-primary/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Profile Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your vendor profile and account settings
            </p>
          </div>
          <Badge
            variant={statusInfo.variant}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
          >
            <StatusIcon className="h-4 w-4" />
            {statusInfo.text}
          </Badge>
        </div>

        {/* Authentication Issue Alert */}
        {authIssue && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Authentication Session Issue Detected
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Your authentication token appears to be outdated. Please sign out and sign back in to refresh your session.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out & Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-none shadow-md overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
            <CardContent className="relative pt-0 px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={vendor?.profilePictureUrl} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Building2 className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 mb-2">
                  <h3 className="text-2xl font-bold">
                    {vendor?.businessName || "No Business Name"}
                  </h3>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    {vendor?.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {vendor.location}
                      </div>
                    )}
                    {vendor?.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {vendor.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm">
                    <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                    {statusInfo.description}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-full inline-flex h-auto w-full md:w-auto">
            <TabsTrigger value="profile" className="rounded-full px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex-1 md:flex-none">
              <Building2 className="h-4 w-4 mr-2" />
              Business Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="rounded-full px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex-1 md:flex-none">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-full px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex-1 md:flex-none">
              <Eye className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Business Details
                </CardTitle>
                <CardDescription>
                  Update your business information that customers will see
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className={`space-y-6 ${saving ? "opacity-75 pointer-events-none" : ""}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="businessName"
                          disabled={saving}
                          {...profileForm.register("businessName")}
                          className={`pl-9 ${profileForm.formState.errors.businessName
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                            }`}
                          placeholder="e.g. Elegant Events Co."
                        />
                      </div>
                      {profileForm.formState.errors.businessName && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.businessName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          disabled={saving}
                          {...profileForm.register("location")}
                          className={`pl-9 ${profileForm.formState.errors.location
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                            }`}
                          placeholder="e.g. New York, NY"
                        />
                      </div>
                      {profileForm.formState.errors.location && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="websiteUrl"
                          type="url"
                          placeholder="https://yourwebsite.com"
                          disabled={saving}
                          {...profileForm.register("websiteUrl")}
                          className={`pl-9 ${profileForm.formState.errors.websiteUrl
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                            }`}
                        />
                      </div>
                      {profileForm.formState.errors.websiteUrl && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.websiteUrl.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          disabled={saving}
                          {...profileForm.register("phoneNumber")}
                          className={`pl-9 ${profileForm.formState.errors.phoneNumber
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                            }`}
                        />
                      </div>
                      {profileForm.formState.errors.phoneNumber && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <ImageUpload
                      label="Profile Picture"
                      currentImageUrl={profileForm.watch("profilePictureUrl")}
                      onImageUploaded={handleImageUploaded}
                      onImageDeleted={handleImageDeleted}
                      folder="profile-pictures"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Business Description *</Label>
                    <Textarea
                      id="bio"
                      placeholder="Describe your business, services, and what makes you unique..."
                      className="min-h-32 resize-y"
                      disabled={saving}
                      {...profileForm.register("bio")}
                    />
                    {profileForm.formState.errors.bio && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.bio.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground text-right">
                      {profileForm.watch("bio")?.length || 0}/1000 characters
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      size="lg"
                      className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                      disabled={saving || submissionInProgress.current}
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!submissionInProgress.current && !saving) {
                          const formData = profileForm.getValues();
                          const isValid = await profileForm.trigger();
                          if (isValid) {
                            await onProfileSubmit(formData);
                          } else {
                            toast.error("Please fix form errors before submitting");
                          }
                        } else {
                          toast.error("Please wait, submission in progress...");
                        }
                      }}
                    >
                      {saving ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Saving Changes...
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
          </TabsContent>

          <TabsContent value="account" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Manage your personal account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      disabled={true}
                      {...accountForm.register("username")}
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Username cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        disabled={true}
                        {...accountForm.register("email")}
                        className="bg-muted/50"
                      />
                      {vendor?.emailVerified ? (
                        <div className="flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 rounded-md border border-green-200 shrink-0" title="Email Verified">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={openVerificationDialog}
                          className="shrink-0 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/30 p-4 border border-border/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Security
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    To change your password or update sensitive account information, please contact support.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:support@planero.com">Contact Support</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Visibility & Notifications
                </CardTitle>
                <CardDescription>
                  Control how your profile appears and how we contact you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile Visibility</h3>
                    <div className="flex items-center justify-between rounded-xl border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <Label className="text-base">Publish Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to customers on the platform
                        </p>
                      </div>
                      <Switch
                        checked={settingsForm.watch("isPublished")}
                        onCheckedChange={(checked) =>
                          settingsForm.setValue("isPublished", checked)
                        }
                        disabled={saving || !vendor?.isApproved}
                      />
                    </div>
                    {!vendor?.isApproved && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <AlertCircle className="h-4 w-4" />
                        <span>You must be approved before you can publish your profile.</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <div className="flex items-center justify-between rounded-xl border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new inquiries and bookings
                        </p>
                      </div>
                      <Switch
                        checked={settingsForm.watch("emailNotifications")}
                        onCheckedChange={(checked) =>
                          settingsForm.setValue("emailNotifications", checked)
                        }
                        disabled={saving}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive text messages for urgent updates
                        </p>
                      </div>
                      <Switch
                        checked={settingsForm.watch("smsNotifications")}
                        onCheckedChange={(checked) =>
                          settingsForm.setValue("smsNotifications", checked)
                        }
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      size="lg"
                      className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                    >
                      {saving ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Email Address</DialogTitle>
            <DialogDescription>
              We'll send a verification code to {vendor?.email}
            </DialogDescription>
          </DialogHeader>
          {vendor?.email && (
            <EmailVerification
              email={vendor.email}
              onVerificationComplete={handleVerificationComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

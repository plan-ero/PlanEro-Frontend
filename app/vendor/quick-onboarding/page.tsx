"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  User,
  Building2,
  Package,
  Loader2,
  Camera,
  Music,
  Utensils,
  Palette,
  Car,
  Gift,
  Mic,
  Sparkles,
  Cake,
  Crown,
  Check,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import ImageUpload from "@/components/image-upload";
import MultiImageUpload from "@/components/multi-image-upload";

// Service Types Enum
enum ServiceType {
  PHOTOGRAPHER = "PHOTOGRAPHER",
  PHOTO_VIDEOGRAPHER = "PHOTO_VIDEOGRAPHER",
  DECORATOR = "DECORATOR",
  FLORIST = "FLORIST",
  CATERS = "CATERS",
  BAKERS = "BAKERS",
  TRANSPORTATION = "TRANSPORTATION",
  BRIDE_GROOMING = "BRIDE_GROOMING",
  WEDDING_BAND = "WEDDING_BAND",
  DJ = "DJ",
  SINGER = "SINGER",
  ANCHOR = "ANCHOR",
  MAGICIAN = "MAGICIAN",
  VENUE = "VENUE",
}

// Event Types Enum
enum EventType {
  WEDDING = "WEDDING",
  BIRTHDAY = "BIRTHDAY",
  ANNIVERSARY = "ANNIVERSARY",
  CORPORATE = "CORPORATE",
  ENGAGEMENT = "ENGAGEMENT",
  BABY_SHOWER = "BABY_SHOWER",
  GRADUATION = "GRADUATION",
  HOLIDAY_PARTY = "HOLIDAY_PARTY",
  CONFERENCE = "CONFERENCE",
  EXHIBITION = "EXHIBITION",
}

// Price Enum
enum PriceEnum {
  INEXPENSIVE = "INEXPENSIVE",
  AFFORDABLE = "AFFORDABLE",
  MODERATE = "MODERATE",
  LUXURY = "LUXURY",
}

const serviceTypeIcons: { [key: string]: any } = {
  PHOTOGRAPHER: Camera,
  PHOTO_VIDEOGRAPHER: Camera,
  DECORATOR: Palette,
  FLORIST: Gift,
  CATERS: Utensils,
  BAKERS: Cake,
  TRANSPORTATION: Car,
  BRIDE_GROOMING: Crown,
  WEDDING_BAND: Music,
  DJ: Music,
  SINGER: Mic,
  ANCHOR: Mic,
  MAGICIAN: Sparkles,
  VENUE: Building2,
};

// Main form schema - Comprehensive onboarding fields
const quickOnboardingSchema = z
  .object({
    // === Basic Information (Common for all) ===
    name: z
      .string()
      .min(1, "Full name is required")
      .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one digit",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    businessName: z
      .string()
      .min(2, "Business name must be at least 2 characters"),
    location: z.string().min(2, "Location is required"),
    bio: z
      .string()
      .min(1, "Bio is required")
      .max(1000, "Bio must be less than 1000 characters"),
    phone: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),

    // Vendor type selection
    vendorType: z.enum(["venue", "vendor"]),
    selectedServiceTypes: z
      .array(z.nativeEnum(ServiceType))
      .min(1, "Select at least one service type"),

    // === Venue-specific Details (if vendorType === "venue") ===
    capacity: z.number().optional(),
    venuePricePerEvent: z.number().optional(),
    amenities: z.array(z.string()).optional(),
    accessibility: z.string().optional(),
    venueDescription: z.string().optional(),
    parkingAvailable: z.boolean().optional(),
    cateringAvailable: z.boolean().optional(),
    outdoorSpace: z.boolean().optional(),

    // === Service Vendor Details (if vendorType === "vendor") ===
    yearsOfExperience: z.number().optional(),
    portfolio: z.array(z.string()).optional(), // URLs
    certifications: z.array(z.string()).optional(),
    teamSize: z.number().optional(),
    servicesOffered: z.array(z.string()).optional(),
    workingHours: z.string().optional(),

    // === Legal & Payment (Common) ===
    businessRegistrationNumber: z.string().optional(),
    taxId: z.string().optional(),
    insuranceDetails: z.string().optional(),
    paymentMethods: z.array(z.string()).optional(),
    cancellationPolicy: z.string().optional(),
    refundPolicy: z.string().optional(),
    termsAndConditions: z.string().optional(),

    // === Optional Add-ons (Common) ===
    socialMediaLinks: z
      .object({
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
      })
      .optional(),
    videoLinks: z.array(z.string()).optional(),
    awards: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    emergencyContact: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type QuickOnboardingForm = z.infer<typeof quickOnboardingSchema>;

interface ServiceConfig {
  name: string;
  serviceType: ServiceType;
  eventType: EventType;
  priceEnum: PriceEnum;
  cost: number;
  images: string[]; // Add images array
}

export default function QuickOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<
    ServiceType[]
  >([]);
  const [servicesConfig, setServicesConfig] = useState<{
    [key: string]: ServiceConfig;
  }>({});
  const [allowSubmit, setAllowSubmit] = useState(false);

  const form = useForm<QuickOnboardingForm>({
    resolver: zodResolver(quickOnboardingSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      businessName: "",
      location: "",
      bio: "",
      phone: "",
      website: "",
      vendorType: "vendor",
      selectedServiceTypes: [],
      capacity: undefined,
      venuePricePerEvent: undefined,
      amenities: [],
      accessibility: "",
      venueDescription: "",
      parkingAvailable: false,
      cateringAvailable: false,
      outdoorSpace: false,
      yearsOfExperience: undefined,
      portfolio: [],
      certifications: [],
      teamSize: undefined,
      servicesOffered: [],
      workingHours: "",
      businessRegistrationNumber: "",
      taxId: "",
      insuranceDetails: "",
      paymentMethods: [],
      cancellationPolicy: "",
      refundPolicy: "",
      termsAndConditions: "",
      socialMediaLinks: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
      },
      videoLinks: [],
      awards: [],
      languages: [],
      emergencyContact: "",
    },
    mode: "onChange",
  });

  const vendorType = form.watch("vendorType");
  const totalSteps = vendorType === "venue" ? 7 : 7; // Same steps for both
  const progress = (step / totalSteps) * 100;

  // Handle service type selection
  const handleServiceTypeToggle = (serviceType: ServiceType) => {
    const updated = selectedServiceTypes.includes(serviceType)
      ? selectedServiceTypes.filter((t) => t !== serviceType)
      : [...selectedServiceTypes, serviceType];

    setSelectedServiceTypes(updated);
    form.setValue("selectedServiceTypes", updated);

    // Initialize service config if newly added
    if (!selectedServiceTypes.includes(serviceType)) {
      setServicesConfig((prev) => ({
        ...prev,
        [serviceType]: {
          name: "",
          serviceType: serviceType,
          eventType: EventType.WEDDING,
          priceEnum: PriceEnum.MODERATE,
          cost: 0,
          images: [], // Initialize empty images array
        },
      }));
    }
  };

  // Update service configuration
  const updateServiceConfig = (
    serviceType: ServiceType,
    field: keyof ServiceConfig,
    value: any,
  ) => {
    setServicesConfig((prev) => ({
      ...prev,
      [serviceType]: {
        ...prev[serviceType],
        [field]: value,
      },
    }));
  };

  // Validate current step
  const validateStep = async () => {
    switch (step) {
      case 1: // Account credentials
        const userFields = [
          "name",
          "email",
          "username",
          "password",
          "confirmPassword",
        ];
        return await form.trigger(
          userFields as Array<keyof QuickOnboardingForm>,
        );

      case 2: // Basic info + vendor type selection
        const basicFields = ["businessName", "location", "bio", "vendorType"];
        return await form.trigger(
          basicFields as Array<keyof QuickOnboardingForm>,
        );

      case 3: // Venue or Vendor specific details
        return true; // All fields optional in this step

      case 4: // Service types selection
        if (selectedServiceTypes.length === 0) {
          toast.error("Please select at least one service type");
          return false;
        }
        return true;

      case 5: // Service configuration
        for (const serviceType of selectedServiceTypes) {
          const config = servicesConfig[serviceType];
          if (!config || !config.name || config.cost <= 0) {
            toast.error(
              `Please complete all required fields for ${serviceType.replace(/_/g, " ")}`,
            );
            return false;
          }
        }
        return true;

      case 6: // Legal & Payment
        return true; // All fields optional

      case 7: // Optional add-ons
        return true; // All fields optional

      default:
        return true;
    }
  };

  // Navigation
  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Prevent form submission on Enter key unless on final step
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLElement;

      // Allow Enter in textarea for line breaks
      if (target.tagName === "TEXTAREA") {
        return;
      }

      // Allow Enter in select/combobox for selecting options
      if (
        target.getAttribute("role") === "combobox" ||
        target.tagName === "SELECT"
      ) {
        return;
      }

      // ALWAYS prevent Enter from submitting the form
      // User must click the submit button explicitly
      e.preventDefault();
      e.stopPropagation();

      // If not on final step, advance to next step
      if (step < totalSteps) {
        nextStep();
      }

      return false;
    }
  };

  // Handle form submission with strict validation
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Only allow submission if explicitly permitted via submit button click
    if (!allowSubmit) {
      return false;
    }

    // Prevent submission if not on final step
    if (step !== totalSteps) {
      setAllowSubmit(false);
      return false;
    }

    // Validate final step before submitting
    const isValid = await validateStep();
    if (!isValid) {
      setAllowSubmit(false);
      return false;
    }

    // Get form data and call onSubmit directly
    const formData = form.getValues();
    await onSubmit(formData);

    // Reset flag after submission
    setAllowSubmit(false);
  };

  // Main atomic submission
  const onSubmit = async (data: QuickOnboardingForm) => {
    // Prevent submission if not on final step
    if (step !== totalSteps) {
      return;
    }

    setLoading(true);

    try {
      // Prepare services array with images
      const services = selectedServiceTypes.map((serviceType) => ({
        name: servicesConfig[serviceType].name,
        serviceType: servicesConfig[serviceType].serviceType,
        eventType: servicesConfig[serviceType].eventType,
        priceEnum: servicesConfig[serviceType].priceEnum,
        cost: servicesConfig[serviceType].cost,
        images: servicesConfig[serviceType].images || [],
      }));

      // Prepare comprehensive metadata for vendor
      const vendorMetadata = {
        vendorType: data.vendorType,
        phone: data.phone,
        website: data.website,
        // Venue-specific
        ...(data.vendorType === "venue" && {
          venueDetails: {
            capacity: data.capacity,
            venuePricePerEvent: data.venuePricePerEvent,
            amenities: data.amenities,
            accessibility: data.accessibility,
            venueDescription: data.venueDescription,
            parkingAvailable: data.parkingAvailable,
            cateringAvailable: data.cateringAvailable,
            outdoorSpace: data.outdoorSpace,
          },
        }),
        // Service vendor specific
        ...(data.vendorType === "vendor" && {
          serviceVendorDetails: {
            yearsOfExperience: data.yearsOfExperience,
            portfolio: data.portfolio,
            certifications: data.certifications,
            teamSize: data.teamSize,
            servicesOffered: data.servicesOffered,
            workingHours: data.workingHours,
          },
        }),
        // Legal & Payment
        legalAndPayment: {
          businessRegistrationNumber: data.businessRegistrationNumber,
          taxId: data.taxId,
          insuranceDetails: data.insuranceDetails,
          paymentMethods: data.paymentMethods,
          cancellationPolicy: data.cancellationPolicy,
          refundPolicy: data.refundPolicy,
          termsAndConditions: data.termsAndConditions,
        },
        // Optional add-ons
        additionalInfo: {
          socialMediaLinks: data.socialMediaLinks,
          videoLinks: data.videoLinks,
          awards: data.awards,
          languages: data.languages,
          emergencyContact: data.emergencyContact,
        },
      };

      // Single atomic API call
      const response = await fetch("/api/vendors/quick-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
          businessName: data.businessName,
          location: data.location,
          bio: data.bio,
          profilePicture: profilePicture || undefined,
          metadata: JSON.stringify(vendorMetadata),
          services: services,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Onboarding failed");
      }

      const result = await response.json();

      toast.success(
        `Onboarding completed! ${result.servicesCreated} service(s) created.`,
      );

      // Store the token
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
        localStorage.setItem("username", data.username);

        toast.loading("Signing you in...", { id: "auto-login" });

        // Sign in with NextAuth using the credentials (use username, not email)
        const signInResult = await signIn("credentials", {
          username: data.username,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          toast.error(
            "Account created but auto-login failed. Please sign in manually.",
            { id: "auto-login" },
          );
          setTimeout(() => {
            router.push("/auth/signin");
          }, 2000);
        } else {
          toast.success("Successfully logged in!", { id: "auto-login" });

          // Fetch profile to confirm login and redirect
          const profileResponse = await fetch("/api/users/profile");
          if (profileResponse.ok) {
            router.replace("/vendor/dashboard");
          } else {
            router.replace("/");
          }
        }
      } else {
        toast.success("You can now sign in with your credentials");
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error.message || "Onboarding failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-6 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Vendor Onboarding
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 px-2">
            Complete your profile in {totalSteps} easy steps - Only essential
            information required
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 md:mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs md:text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Step {step} of {totalSteps}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          {/* Step 1: Account Credentials */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-6 w-6 text-purple-600" />
                  <CardTitle>Account Credentials</CardTitle>
                </div>
                <CardDescription>Create your login credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="John Doe"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="john@example.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    {...form.register("username")}
                    placeholder="johndoe"
                  />
                  {form.formState.errors.username && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    placeholder="••••••••"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Must contain uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register("confirmPassword")}
                    placeholder="••••••••"
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Basic Business Information */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-purple-600" />
                  <CardTitle>Business Information</CardTitle>
                </div>
                <CardDescription>Essential business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vendorType">Business Type *</Label>
                  <Select
                    value={form.watch("vendorType")}
                    onValueChange={(value) =>
                      form.setValue("vendorType", value as "venue" | "vendor")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venue">Venue</SelectItem>
                      <SelectItem value="vendor">Service Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    {...form.register("businessName")}
                    placeholder="Elegant Events Co."
                  />
                  {form.formState.errors.businessName && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.businessName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    {...form.register("location")}
                    placeholder="New York, NY"
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.location.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    {...form.register("website")}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Business Bio *</Label>
                  <Textarea
                    id="bio"
                    {...form.register("bio")}
                    placeholder="Tell us about your business, experience, and what makes you unique..."
                    rows={5}
                  />
                  {form.formState.errors.bio && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.bio.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {form.watch("bio")?.length || 0}/1000 characters
                  </p>
                </div>

                <div>
                  <ImageUpload
                    label="Profile Picture"
                    currentImageUrl={profilePicture}
                    onImageUploaded={(url) => setProfilePicture(url)}
                    onImageDeleted={() => setProfilePicture("")}
                    folder="profile-pictures"
                    className="mt-4"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Venue or Vendor Specific Details */}
          {step === 3 && vendorType === "venue" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-purple-600" />
                  <CardTitle>Venue Details</CardTitle>
                </div>
                <CardDescription>Venue-specific information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacity (guests)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      {...form.register("capacity", { valueAsNumber: true })}
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="venuePricePerEvent">
                      Price Per Event (₹)
                    </Label>
                    <Input
                      id="venuePricePerEvent"
                      type="number"
                      {...form.register("venuePricePerEvent", {
                        valueAsNumber: true,
                      })}
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="venueDescription">Venue Description</Label>
                  <Textarea
                    id="venueDescription"
                    {...form.register("venueDescription")}
                    placeholder="Describe your venue..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="accessibility">Accessibility Features</Label>
                  <Input
                    id="accessibility"
                    {...form.register("accessibility")}
                    placeholder="Wheelchair ramps, elevators, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Facilities</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="parkingAvailable"
                      {...form.register("parkingAvailable")}
                      className="rounded"
                    />
                    <Label htmlFor="parkingAvailable" className="font-normal">
                      Parking Available
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="cateringAvailable"
                      {...form.register("cateringAvailable")}
                      className="rounded"
                    />
                    <Label htmlFor="cateringAvailable" className="font-normal">
                      Catering Available
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="outdoorSpace"
                      {...form.register("outdoorSpace")}
                      className="rounded"
                    />
                    <Label htmlFor="outdoorSpace" className="font-normal">
                      Outdoor Space
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && vendorType === "vendor" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-6 w-6 text-purple-600" />
                  <CardTitle>Service Vendor Details</CardTitle>
                </div>
                <CardDescription>Service-specific information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearsOfExperience">
                      Years of Experience
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      {...form.register("yearsOfExperience", {
                        valueAsNumber: true,
                      })}
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      {...form.register("teamSize", { valueAsNumber: true })}
                      placeholder="10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    {...form.register("workingHours")}
                    placeholder="9 AM - 6 PM, Mon-Sat"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Service Type Selection */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-6 w-6 text-purple-600" />
                  <CardTitle>Select Service Types</CardTitle>
                </div>
                <CardDescription>
                  Choose the types of services you offer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.values(ServiceType).map((serviceType) => {
                    const Icon = serviceTypeIcons[serviceType] || Package;
                    const isSelected =
                      selectedServiceTypes.includes(serviceType);

                    return (
                      <div
                        key={serviceType}
                        onClick={() => handleServiceTypeToggle(serviceType)}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                        }`}
                      >
                        {/* Custom checkbox visual */}
                        <div
                          className={`h-4 w-4 shrink-0 rounded-sm border flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-purple-600 border-purple-600"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <Icon className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">
                          {serviceType.replace(/_/g, " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {selectedServiceTypes.length > 0 && (
                  <Alert className="mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Selected {selectedServiceTypes.length} service type(s).
                      Configure details in the next step.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 5: Service Configuration */}
          {step === 5 && (
            <div className="space-y-6">
              {selectedServiceTypes.map((serviceType, index) => {
                const config = servicesConfig[serviceType];
                const Icon = serviceTypeIcons[serviceType] || Package;

                return (
                  <Card key={serviceType}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Icon className="h-6 w-6 text-purple-600" />
                        <CardTitle>
                          {serviceType.replace(/_/g, " ")} - Configure Service
                        </CardTitle>
                      </div>
                      <CardDescription>
                        Required service details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Service Name *</Label>
                        <Input
                          value={config?.name || ""}
                          onChange={(e) =>
                            updateServiceConfig(
                              serviceType,
                              "name",
                              e.target.value,
                            )
                          }
                          placeholder={`e.g., Professional ${serviceType.replace(/_/g, " ")}`}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Event Type *</Label>
                          <Select
                            value={config?.eventType || EventType.WEDDING}
                            onValueChange={(value) =>
                              updateServiceConfig(
                                serviceType,
                                "eventType",
                                value as EventType,
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(EventType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Price Range *</Label>
                          <Select
                            value={config?.priceEnum || PriceEnum.MODERATE}
                            onValueChange={(value) =>
                              updateServiceConfig(
                                serviceType,
                                "priceEnum",
                                value as PriceEnum,
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(PriceEnum).map((price) => (
                                <SelectItem key={price} value={price}>
                                  {price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Cost (INR ₹) *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={config?.cost || 0}
                          onChange={(e) =>
                            updateServiceConfig(
                              serviceType,
                              "cost",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <MultiImageUpload
                          label="Service Images (Optional)"
                          currentImages={config?.images || []}
                          onImagesChange={(urls) =>
                            updateServiceConfig(serviceType, "images", urls)
                          }
                          folder="service-images"
                          maxImages={5}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Step 6: Legal & Payment */}
          {step === 6 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-purple-600" />
                  <CardTitle>Legal & Payment Information</CardTitle>
                </div>
                <CardDescription>
                  Business registration and payment details (all optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessRegistrationNumber">
                      Business Registration Number
                    </Label>
                    <Input
                      id="businessRegistrationNumber"
                      {...form.register("businessRegistrationNumber")}
                      placeholder="REG123456"
                    />
                  </div>

                  <div>
                    <Label htmlFor="taxId">Tax ID / GST Number</Label>
                    <Input
                      id="taxId"
                      {...form.register("taxId")}
                      placeholder="GST123456"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="insuranceDetails">Insurance Details</Label>
                  <Textarea
                    id="insuranceDetails"
                    {...form.register("insuranceDetails")}
                    placeholder="Insurance provider, policy number, coverage..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="cancellationPolicy">
                    Cancellation Policy
                  </Label>
                  <Textarea
                    id="cancellationPolicy"
                    {...form.register("cancellationPolicy")}
                    placeholder="Describe your cancellation policy..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="refundPolicy">Refund Policy</Label>
                  <Textarea
                    id="refundPolicy"
                    {...form.register("refundPolicy")}
                    placeholder="Describe your refund policy..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="termsAndConditions">
                    Terms and Conditions
                  </Label>
                  <Textarea
                    id="termsAndConditions"
                    {...form.register("termsAndConditions")}
                    placeholder="Your terms and conditions..."
                    rows={4}
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    These details help build trust with customers. You can add
                    or update them later from your dashboard.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Step 7: Optional Add-ons */}
          {step === 7 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  <CardTitle>Additional Information</CardTitle>
                </div>
                <CardDescription>
                  Social media, awards, and other details (all optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Social Media Links</Label>
                  <div className="space-y-2">
                    <Input
                      {...form.register("socialMediaLinks.facebook")}
                      placeholder="Facebook URL"
                    />
                    <Input
                      {...form.register("socialMediaLinks.instagram")}
                      placeholder="Instagram URL"
                    />
                    <Input
                      {...form.register("socialMediaLinks.twitter")}
                      placeholder="Twitter URL"
                    />
                    <Input
                      {...form.register("socialMediaLinks.linkedin")}
                      placeholder="LinkedIn URL"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    {...form.register("emergencyContact")}
                    placeholder="+1 (555) 987-6543"
                  />
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    You're almost done! Review and submit your information in
                    the next step.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1 || loading}
            >
              Previous
            </Button>

            {step < totalSteps ? (
              <Button type="button" onClick={nextStep} disabled={loading}>
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                onClick={() => setAllowSubmit(true)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Onboarding
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Back to signin link */}
        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-purple-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

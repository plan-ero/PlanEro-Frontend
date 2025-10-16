"use client";

import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
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
  Heart,
  Gift,
  Mic,
  Sparkles,
  Cake,
  Crown,
  Check,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/loading-spinner";
import ImageUpload from "@/components/image-upload";
import MultiImageUpload from "@/components/multi-image-upload";
import toast from "react-hot-toast";

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

// Main form schema
const quickOnboardingSchema = z.object({
  // User fields
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

  // Vendor fields
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(1000, "Bio must be less than 1000 characters"),
  websiteUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  profilePictureUrl: z.string().optional(),
  phoneNumber: z.string().optional(),

  // Service types selection
  selectedServiceTypes: z
    .array(z.nativeEnum(ServiceType))
    .min(1, "Select at least one service type"),
});

// Dynamic service schema for each selected type
const dynamicServiceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  serviceType: z.nativeEnum(ServiceType),
  eventType: z.nativeEnum(EventType),
  priceEnum: z.nativeEnum(PriceEnum),
  availability: z.boolean().default(true),
  cost: z.number().min(0, "Cost must be a positive number"),
  metadata: z.string().optional(),
  images: z.array(z.string()).optional(),
});

type QuickOnboardingForm = z.infer<typeof quickOnboardingSchema>;
type ServiceFormData = z.infer<typeof dynamicServiceSchema>;

interface ServiceConfig extends ServiceFormData {}

export default function QuickOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<
    ServiceType[]
  >([]);
  const [servicesConfig, setServicesConfig] = useState<{
    [key: string]: ServiceConfig;
  }>({});

  const form = useForm<QuickOnboardingForm>({
    resolver: zodResolver(quickOnboardingSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      businessName: "",
      location: "",
      bio: "",
      websiteUrl: "",
      profilePictureUrl: "",
      phoneNumber: "",
      selectedServiceTypes: [],
    },
  });

  const totalSteps = 4;
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
          availability: true,
          cost: 0,
          metadata: "",
          images: [],
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

  // Handle image uploads for vendor profile
  const handleVendorImageUploaded = (url: string) => {
    form.setValue("profilePictureUrl", url);
    toast.success("Profile picture uploaded!");
  };

  const handleVendorImageDeleted = () => {
    form.setValue("profilePictureUrl", "");
  };

  // Handle service image uploads
  const handleServiceImagesUploaded = (
    serviceType: ServiceType,
    urls: string[],
  ) => {
    updateServiceConfig(serviceType, "images", urls);
  };

  // Validate current step
  const validateStep = async () => {
    const values = form.getValues();

    switch (step) {
      case 1:
        // Validate user fields
        const userFields = ["name", "email", "username", "password"];
        const userErrors = await form.trigger(
          userFields as Array<keyof QuickOnboardingForm>,
        );
        return userErrors;

      case 2:
        // Validate vendor fields
        const vendorFields = [
          "businessName",
          "location",
          "bio",
          "phoneNumber",
        ];
        const vendorErrors = await form.trigger(
          vendorFields as Array<keyof QuickOnboardingForm>,
        );
        return vendorErrors;

      case 3:
        // Validate service types selection
        if (selectedServiceTypes.length === 0) {
          toast.error("Please select at least one service type");
          return false;
        }
        return true;

      case 4:
        // Validate all service configurations
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

      default:
        return true;
    }
  };

  // Navigation handlers
  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Main submission handler
  const onSubmit = async (data: QuickOnboardingForm) => {
    setLoading(true);

    try {
      // Step 1: Register User
      console.log("Step 1: Registering user...");
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
          role: "VENDOR",
        }),
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        throw new Error(error.error || "User registration failed");
      }

      const registerData = await registerResponse.json();
      const token = registerData.token;

      console.log("User registered successfully");

      // Step 2: Create/Update Vendor Profile
      console.log("Step 2: Creating vendor profile...");
      const vendorResponse = await fetch("/api/vendors/onboard", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessName: data.businessName,
          location: data.location,
          bio: data.bio,
          websiteUrl: data.websiteUrl,
          profilePictureUrl: data.profilePictureUrl,
          phoneNumber: data.phoneNumber,
          email: data.email,
        }),
      });

      if (!vendorResponse.ok) {
        const error = await vendorResponse.json();
        throw new Error(error.error || "Vendor profile creation failed");
      }

      const vendorData = await vendorResponse.json();
      console.log("Vendor profile created successfully");

      // Step 3: Create Services
      console.log("Step 3: Creating services...");
      const servicePromises = selectedServiceTypes.map(async (serviceType) => {
        const serviceConfig = servicesConfig[serviceType];
        return fetch("/api/vendors/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: serviceConfig.name,
            serviceType: serviceConfig.serviceType,
            eventType: serviceConfig.eventType,
            priceEnum: serviceConfig.priceEnum,
            availability: serviceConfig.availability,
            cost: serviceConfig.cost,
            metadata: serviceConfig.metadata || "",
            images: serviceConfig.images || [],
          }),
        });
      });

      const serviceResponses = await Promise.all(servicePromises);

      // Check if all services were created successfully
      const failedServices = serviceResponses.filter((res) => !res.ok);
      if (failedServices.length > 0) {
        console.warn(
          `${failedServices.length} service(s) failed to create, but continuing...`,
        );
      }

      console.log("Services created successfully");

      toast.success("Onboarding completed successfully!");
      toast.success("You can now sign in with your credentials");

      // Redirect to signin page
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error.message || "Onboarding failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Vendor Onboarding
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Complete your profile in {totalSteps} easy steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Step 1: User Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-6 w-6 text-purple-600" />
                  <CardTitle>Account Information</CardTitle>
                </div>
                <CardDescription>
                  Create your account to get started
                </CardDescription>
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
              </CardContent>
            </Card>
          )}

          {/* Step 2: Vendor Information */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-purple-600" />
                  <CardTitle>Business Information</CardTitle>
                </div>
                <CardDescription>
                  Tell us about your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    {...form.register("phoneNumber")}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Business Bio *</Label>
                  <Textarea
                    id="bio"
                    {...form.register("bio")}
                    placeholder="Tell us about your business, experience, and what makes you unique... (minimum 50 characters)"
                    rows={5}
                  />
                  {form.formState.errors.bio && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.bio.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    {...form.register("websiteUrl")}
                    placeholder="https://www.yourwebsite.com"
                  />
                  {form.formState.errors.websiteUrl && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.websiteUrl.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Profile Picture</Label>
                  <ImageUpload
                    label="Profile Picture"
                    currentImageUrl={form.watch("profilePictureUrl")}
                    onImageUploaded={handleVendorImageUploaded}
                    onImageDeleted={handleVendorImageDeleted}
                    folder="profile-pictures"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Service Type Selection */}
          {step === 3 && (
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
                        {/* Custom checkbox visual - no state management */}
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
                      You'll configure details in the next step.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Service Configuration */}
          {step === 4 && (
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
                          {serviceType.replace(/_/g, " ")} - Service Details
                        </CardTitle>
                      </div>
                      <CardDescription>
                        Configure your {serviceType.replace(/_/g, " ")} service
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
                        <Label>Cost (USD) *</Label>
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
                        <Label>Description / Metadata</Label>
                        <Textarea
                          value={config?.metadata || ""}
                          onChange={(e) =>
                            updateServiceConfig(
                              serviceType,
                              "metadata",
                              e.target.value,
                            )
                          }
                          placeholder="Additional details about this service..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Service Images (Max 5)</Label>
                        <MultiImageUpload
                          label="Service Images"
                          currentImages={config?.images || []}
                          onImagesChange={(urls) =>
                            handleServiceImagesUploaded(serviceType, urls)
                          }
                          maxImages={5}
                          folder="service-images"
                        />
                      </div>

                      {index < selectedServiceTypes.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
              <Button type="submit" disabled={loading}>
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
      </div>
    </div>
  );
}

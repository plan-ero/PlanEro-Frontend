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

// Main form schema - ONLY REQUIRED FIELDS
const quickOnboardingSchema = z
  .object({
    // User credentials
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

    // Vendor info (required only)
    businessName: z
      .string()
      .min(2, "Business name must be at least 2 characters"),
    location: z.string().min(2, "Location is required"),
    bio: z
      .string()
      .min(1, "Bio is required")
      .max(1000, "Bio must be less than 1000 characters"),

    // Service types selection
    selectedServiceTypes: z
      .array(z.nativeEnum(ServiceType))
      .min(1, "Select at least one service type"),
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
  const [profilePicture, setProfilePicture] = useState<string>(""); // Add profile picture state
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<
    ServiceType[]
  >([]);
  const [servicesConfig, setServicesConfig] = useState<{
    [key: string]: ServiceConfig;
  }>({});
  const [allowSubmit, setAllowSubmit] = useState(false); // Add flag to control submission

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
      selectedServiceTypes: [],
    },
    mode: "onChange", // Validate on change to prevent automatic submission
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
      case 1:
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

      case 2:
        const vendorFields = ["businessName", "location", "bio"];
        return await form.trigger(
          vendorFields as Array<keyof QuickOnboardingForm>,
        );

      case 3:
        if (selectedServiceTypes.length === 0) {
          toast.error("Please select at least one service type");
          return false;
        }
        return true;

      case 4:
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
        images: servicesConfig[serviceType].images || [], // Include service images
      }));

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
          profilePicture: profilePicture || undefined, // Include profile picture
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

          {/* Step 2: Business Information */}
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
                    label="Profile Picture (Optional)"
                    currentImageUrl={profilePicture}
                    onImageUploaded={(url) => setProfilePicture(url)}
                    onImageDeleted={() => setProfilePicture("")}
                    folder="profile-pictures"
                    className="mt-4"
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Additional details like phone number and website can be
                    added later from your dashboard.
                  </AlertDescription>
                </Alert>
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

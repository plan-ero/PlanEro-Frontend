"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
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
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Upload,
  Building2,
  Mail,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/loading-spinner";
import EmailVerification from "@/components/email-verification";
import ImageUpload from "@/components/image-upload";
import toast from "react-hot-toast";

const vendorOnboardingSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  bio: z
    .string()
    .min(1, "Bio is required")
    .max(1000, "Bio must be less than 1000 characters"),
  websiteUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  profilePictureUrl: z.string().optional(),
  phoneNumber: z.string().optional(),
  isPublished: z.boolean().default(false),
});

type VendorOnboardingForm = z.infer<typeof vendorOnboardingSchema>;

export default function VendorOnboarding() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  // If user has a session, they're already verified (logged in)
  const isUserVerified = !!session?.user?.email;
  const [emailVerified, setEmailVerified] = useState(isUserVerified);
  const [verificationToken, setVerificationToken] = useState("");
  // Only 3 steps if already verified (no email verification step)
  const totalSteps = isUserVerified ? 3 : 4;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<VendorOnboardingForm>({
    resolver: zodResolver(vendorOnboardingSchema),
    defaultValues: {
      isPublished: false,
      profilePictureUrl: "",
      phoneNumber: "",
    },
  });

  const watchedValues = watch();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    // If user is authenticated, mark as verified and use their session token
    if (status === "authenticated" && session?.user?.email) {
      setEmailVerified(true);
      // Use the API token from session if available
      if (session.apiToken) {
        setVerificationToken(session.apiToken);
      }
    }
  }, [status, router, session]);

  const handleEmailVerified = (token: string) => {
    setEmailVerified(true);
    setVerificationToken(token);
    toast.success("Email verified! You can now proceed with registration.");
    nextStep();
  };

  const handleImageUploaded = (url: string) => {
    setValue("profilePictureUrl", url);
    toast.success("Profile picture uploaded successfully!");
  };

  const handleImageDeleted = () => {
    setValue("profilePictureUrl", "");
  };

  const onSubmit = async (data: VendorOnboardingForm) => {
    if (!emailVerified) {
      toast.error("Please verify your email first");
      return;
    }

    try {
      setLoading(true);

      // Use the verification token or session API token for API calls
      const token = verificationToken || session?.apiToken || "";
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Add email to the data payload
      const payload = {
        ...data,
        email: session?.user?.email,
        phoneNumber: data.phoneNumber || "",
      };

      const response = await fetch("/api/vendors/onboard", {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Vendor profile submitted for review!");
        router.push("/vendor/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to submit vendor profile");
      }
    } catch (error) {
      console.error("Error submitting vendor profile:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const progress = (step / totalSteps) * 100;

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Become a Vendor</h1>
            <p className="text-muted-foreground">
              Join PlanEro and showcase your services to event planners
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form */}
        {step === 1 && !isUserVerified && !emailVerified ? (
          // Step 1: Email Verification (only for non-logged-in users)
          <EmailVerification
            email={session?.user?.email || ""}
            onVerificationComplete={handleEmailVerified}
            showEmailInput={false}
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {/* Adjust step titles based on whether user is already verified */}
                  {!isUserVerified && step === 1 && "Email Verified ✓"}
                  {(isUserVerified && step === 1) ||
                  (!isUserVerified && step === 2)
                    ? "Business Information"
                    : ""}
                  {(isUserVerified && step === 2) ||
                  (!isUserVerified && step === 3)
                    ? "Profile & Images"
                    : ""}
                  {(isUserVerified && step === 3) ||
                  (!isUserVerified && step === 4)
                    ? "Review & Submit"
                    : ""}
                </CardTitle>
                <CardDescription>
                  {!isUserVerified &&
                    step === 1 &&
                    "Your email has been verified successfully"}
                  {(isUserVerified && step === 1) ||
                  (!isUserVerified && step === 2)
                    ? "Tell us about your business"
                    : ""}
                  {(isUserVerified && step === 2) ||
                  (!isUserVerified && step === 3)
                    ? "Upload your profile picture and add details"
                    : ""}
                  {(isUserVerified && step === 3) ||
                  (!isUserVerified && step === 4)
                    ? "Review your information before submitting"
                    : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isUserVerified && step === 1 && emailVerified && (
                  <div className="text-center space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">Email Verified!</h3>
                      <p className="text-muted-foreground">
                        Your email <strong>{session?.user?.email}</strong> has
                        been verified. You can now continue with your vendor
                        registration.
                      </p>
                    </div>
                  </div>
                )}

                {((isUserVerified && step === 1) ||
                  (!isUserVerified && step === 2)) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        placeholder="Your business name"
                        {...register("businessName")}
                        className={errors.businessName ? "border-red-500" : ""}
                      />
                      {errors.businessName && (
                        <p className="text-sm text-red-500">
                          {errors.businessName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="City, State/Region"
                        {...register("location")}
                        className={errors.location ? "border-red-500" : ""}
                      />
                      {errors.location && (
                        <p className="text-sm text-red-500">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        type="url"
                        placeholder="https://yourwebsite.com"
                        {...register("websiteUrl")}
                        className={errors.websiteUrl ? "border-red-500" : ""}
                      />
                      {errors.websiteUrl && (
                        <p className="text-sm text-red-500">
                          {errors.websiteUrl.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...register("phoneNumber")}
                      />
                    </div>
                  </>
                )}

                {((isUserVerified && step === 2) ||
                  (!isUserVerified && step === 3)) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Business Description *</Label>
                      <Textarea
                        id="bio"
                        placeholder="Describe your business, services, and what makes you unique..."
                        className="min-h-32"
                        {...register("bio")}
                      />
                      {errors.bio && (
                        <p className="text-sm text-red-500">
                          {errors.bio.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {watchedValues.bio?.length || 0}/1000 characters
                      </p>
                    </div>

                    <ImageUpload
                      label="Profile Picture"
                      currentImageUrl={watchedValues.profilePictureUrl}
                      onImageUploaded={handleImageUploaded}
                      onImageDeleted={handleImageDeleted}
                      folder="profile-pictures"
                      className="mt-4"
                    />

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your business description and profile picture help
                        potential clients understand your services and
                        expertise. Include your specialties, experience, and
                        what sets you apart from competitors.
                      </AlertDescription>
                    </Alert>
                  </>
                )}

                {((isUserVerified && step === 3) ||
                  (!isUserVerified && step === 4)) && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-medium">Business Name</Label>
                        <p className="text-sm text-muted-foreground">
                          {watchedValues.businessName}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium">Location</Label>
                        <p className="text-sm text-muted-foreground">
                          {watchedValues.location}
                        </p>
                      </div>
                      {watchedValues.websiteUrl && (
                        <div>
                          <Label className="font-medium">Website</Label>
                          <p className="text-sm text-muted-foreground">
                            {watchedValues.websiteUrl}
                          </p>
                        </div>
                      )}
                      {watchedValues.phoneNumber && (
                        <div>
                          <Label className="font-medium">Phone</Label>
                          <p className="text-sm text-muted-foreground">
                            {watchedValues.phoneNumber}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="font-medium">
                        Business Description
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {watchedValues.bio}
                      </p>
                    </div>

                    {watchedValues.profilePictureUrl && (
                      <div>
                        <Label className="font-medium">Profile Picture</Label>
                        <div className="mt-2 w-32 h-32 relative border rounded-lg overflow-hidden">
                          <img
                            src={watchedValues.profilePictureUrl}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label htmlFor="isPublished" className="font-medium">
                          Publish Profile
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to the public after approval
                        </p>
                      </div>
                      <Switch
                        id="isPublished"
                        checked={watchedValues.isPublished}
                        onCheckedChange={(checked) =>
                          setValue("isPublished", checked)
                        }
                      />
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your profile will be reviewed by our team before going
                        live. This typically takes 24-48 hours.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1 || !emailVerified}
              >
                Previous
              </Button>

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    !emailVerified ||
                    // For verified users: step 1 = business info, step 2 = profile
                    // For unverified: step 2 = business info, step 3 = profile
                    (((isUserVerified && step === 1) ||
                      (!isUserVerified && step === 2)) &&
                      (!watchedValues.businessName ||
                        !watchedValues.location)) ||
                    (((isUserVerified && step === 2) ||
                      (!isUserVerified && step === 3)) &&
                      (!watchedValues.bio || watchedValues.bio.length < 50))
                  }
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={loading || !emailVerified}>
                  {loading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : null}
                  Submit for Review
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

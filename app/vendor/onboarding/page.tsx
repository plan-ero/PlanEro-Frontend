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
  CardFooter,
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
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  MapPin,
  Globe,
  Phone,
  Rocket
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/loading-spinner";
import EmailVerification from "@/components/email-verification";
import ImageUpload from "@/components/image-upload";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

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
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms and Conditions",
  }),
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
      acceptTerms: false,
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
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-2xl shadow-lg flex items-center justify-center text-primary-foreground"
            >
              <Rocket className="h-10 w-10" />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl font-bold tracking-tight">Become a Vendor</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Join PlanEro and showcase your services to event planners
              </p>
            </motion.div>
          </div>

          {/* Progress */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2 bg-card p-4 rounded-xl shadow-sm border border-border/50"
          >
            <div className="flex justify-between text-sm font-medium">
              <span className="text-primary">
                Step {step} of {totalSteps}
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2.5" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span className={step >= 1 ? "text-primary font-medium" : ""}>Verification</span>
              <span className={step >= (isUserVerified ? 1 : 2) ? "text-primary font-medium" : ""}>Business Info</span>
              <span className={step >= (isUserVerified ? 2 : 3) ? "text-primary font-medium" : ""}>Profile</span>
              <span className={step >= (isUserVerified ? 3 : 4) ? "text-primary font-medium" : ""}>Review</span>
            </div>
          </motion.div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && !isUserVerified && !emailVerified ? (
                // Step 1: Email Verification (only for non-logged-in users)
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Verify Your Email
                    </CardTitle>
                    <CardDescription>
                      We need to verify your email address before you can create a vendor profile.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmailVerification
                      email={session?.user?.email || ""}
                      onVerificationComplete={handleEmailVerified}
                      showEmailInput={false}
                    />
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Card className="border-none shadow-lg overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        {/* Adjust step titles based on whether user is already verified */}
                        {!isUserVerified && step === 1 && (
                          <>
                            <CheckCircle className="h-6 w-6 text-green-500" />
                            Email Verified
                          </>
                        )}
                        {(isUserVerified && step === 1) ||
                          (!isUserVerified && step === 2) ? (
                          <>
                            <Briefcase className="h-6 w-6 text-primary" />
                            Business Information
                          </>
                        ) : ""}
                        {(isUserVerified && step === 2) ||
                          (!isUserVerified && step === 3) ? (
                          <>
                            <ImageIcon className="h-6 w-6 text-primary" />
                            Profile & Images
                          </>
                        ) : ""}
                        {(isUserVerified && step === 3) ||
                          (!isUserVerified && step === 4) ? (
                          <>
                            <FileText className="h-6 w-6 text-primary" />
                            Review & Submit
                          </>
                        ) : ""}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {!isUserVerified &&
                          step === 1 &&
                          "Your email has been verified successfully"}
                        {(isUserVerified && step === 1) ||
                          (!isUserVerified && step === 2)
                          ? "Tell us about your business so clients can find you"
                          : ""}
                        {(isUserVerified && step === 2) ||
                          (!isUserVerified && step === 3)
                          ? "Upload your profile picture and add a compelling description"
                          : ""}
                        {(isUserVerified && step === 3) ||
                          (!isUserVerified && step === 4)
                          ? "Review your information carefully before submitting"
                          : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {!isUserVerified && step === 1 && emailVerified && (
                        <div className="text-center space-y-6 py-8">
                          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-green-700">Email Verified Successfully!</h3>
                            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                              Your email <strong>{session?.user?.email}</strong> has
                              been verified. You can now continue with your vendor
                              registration.
                            </p>
                          </div>
                        </div>
                      )}

                      {((isUserVerified && step === 1) ||
                        (!isUserVerified && step === 2)) && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name *</Label>
                                <div className="relative">
                                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    id="businessName"
                                    placeholder="e.g. Elegant Events Co."
                                    {...register("businessName")}
                                    className={`pl-9 ${errors.businessName ? "border-red-500" : ""}`}
                                  />
                                </div>
                                {errors.businessName && (
                                  <p className="text-sm text-red-500">
                                    {errors.businessName.message}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    id="location"
                                    placeholder="City, State/Region"
                                    {...register("location")}
                                    className={`pl-9 ${errors.location ? "border-red-500" : ""}`}
                                  />
                                </div>
                                {errors.location && (
                                  <p className="text-sm text-red-500">
                                    {errors.location.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="websiteUrl">Website URL</Label>
                              <div className="relative">
                                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="websiteUrl"
                                  type="url"
                                  placeholder="https://yourwebsite.com"
                                  {...register("websiteUrl")}
                                  className={`pl-9 ${errors.websiteUrl ? "border-red-500" : ""}`}
                                />
                              </div>
                              {errors.websiteUrl && (
                                <p className="text-sm text-red-500">
                                  {errors.websiteUrl.message}
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
                                  {...register("phoneNumber")}
                                  className="pl-9"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                      {((isUserVerified && step === 2) ||
                        (!isUserVerified && step === 3)) && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-2">
                              <Label htmlFor="bio">Business Description *</Label>
                              <Textarea
                                id="bio"
                                placeholder="Describe your business, services, and what makes you unique. This will be shown on your public profile."
                                className="min-h-40 resize-y"
                                {...register("bio")}
                              />
                              {errors.bio && (
                                <p className="text-sm text-red-500">
                                  {errors.bio.message}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground text-right">
                                {watchedValues.bio?.length || 0}/1000 characters
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label>Profile Picture</Label>
                              <div className="bg-muted/30 p-6 rounded-xl border border-dashed border-border">
                                <ImageUpload
                                  label="Upload Profile Picture"
                                  currentImageUrl={watchedValues.profilePictureUrl}
                                  onImageUploaded={handleImageUploaded}
                                  onImageDeleted={handleImageDeleted}
                                  folder="profile-pictures"
                                />
                              </div>
                            </div>

                            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <AlertDescription className="text-blue-800 dark:text-blue-300">
                                Your business description and profile picture help
                                potential clients understand your services and
                                expertise. Include your specialties, experience, and
                                what sets you apart from competitors.
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}

                      {((isUserVerified && step === 3) ||
                        (!isUserVerified && step === 4)) && (
                          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-muted/30 rounded-xl p-6 space-y-6 border border-border/50">
                              <div className="flex items-start gap-6">
                                <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden border border-border">
                                  {watchedValues.profilePictureUrl ? (
                                    <img
                                      src={watchedValues.profilePictureUrl}
                                      alt="Profile Preview"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                      <Building2 className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <h3 className="text-xl font-bold">{watchedValues.businessName}</h3>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {watchedValues.location}
                                  </div>
                                  {watchedValues.websiteUrl && (
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                      <Globe className="h-3.5 w-3.5" />
                                      <a href={watchedValues.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                                        Website
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">About</h4>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {watchedValues.bio}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-xl bg-card shadow-sm">
                              <div className="space-y-1">
                                <Label htmlFor="isPublished" className="font-medium text-base">
                                  Publish Profile Immediately
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Make your profile visible to the public as soon as it's approved
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

                            {/* Eligibility Information */}
                            <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                              <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              <AlertDescription className="text-amber-900 dark:text-amber-200">
                                <strong className="font-semibold block mb-2">
                                  Eligibility Requirements:
                                </strong>
                                <ul className="list-disc pl-4 space-y-1 text-sm opacity-90">
                                  <li>
                                    You must be at least 18 years old or have reached
                                    the age of majority in your jurisdiction
                                  </li>
                                  <li>
                                    You must possess all necessary licenses, permits,
                                    and insurance required to operate your business
                                    legally
                                  </li>
                                  <li>
                                    You must provide accurate and complete information
                                    about your services
                                  </li>
                                </ul>
                              </AlertDescription>
                            </Alert>

                            {/* Terms and Conditions Checkbox */}
                            <div className="flex items-start space-x-3 p-4 border rounded-xl bg-card hover:bg-muted/20 transition-colors">
                              <input
                                type="checkbox"
                                id="acceptTerms"
                                {...register("acceptTerms")}
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor="acceptTerms"
                                  className="font-medium cursor-pointer text-base"
                                >
                                  I accept the{" "}
                                  <a
                                    href="/terms-and-conditions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline font-bold"
                                  >
                                    Terms and Conditions
                                  </a>{" "}
                                  *
                                </Label>
                                {errors.acceptTerms && (
                                  <p className="text-sm text-destructive mt-1 font-medium">
                                    {errors.acceptTerms.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between bg-muted/20 p-6 border-t border-border/50">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={step === 1 || !emailVerified}
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      {step < totalSteps ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="gap-2"
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
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          size="lg"
                          className="gap-2 shadow-lg hover:shadow-xl transition-all"
                          disabled={
                            loading || !emailVerified || !watchedValues.acceptTerms
                          }
                        >
                          {loading ? (
                            <LoadingSpinner size="sm" className="mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Submit for Review
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

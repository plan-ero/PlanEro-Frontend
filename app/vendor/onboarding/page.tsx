"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Upload, Building2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/loading-spinner"
import toast from "react-hot-toast"

const vendorOnboardingSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(1000, "Bio must be less than 1000 characters"),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  profilePictureUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
})

type VendorOnboardingForm = z.infer<typeof vendorOnboardingSchema>

export default function VendorOnboarding() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const totalSteps = 3

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm<VendorOnboardingForm>({
    resolver: zodResolver(vendorOnboardingSchema),
    defaultValues: {
      isPublished: false,
    }
  })

  const watchedValues = watch()

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const onSubmit = async (data: VendorOnboardingForm) => {
    try {
      setLoading(true)
      
      // Get the authentication token from session
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      
      // Add authorization token if available
      if ((session as any)?.apiToken) {
        headers["Authorization"] = `Bearer ${(session as any).apiToken}`
      }
      
      // Add user email to headers for backend reference
      if (session?.user?.email) {
        headers["x-user-email"] = session.user.email
      }
      
      // Add email to the data payload as well
      const payload = {
        ...data,
        email: session?.user?.email
      }
      
      const response = await fetch("/api/vendors/onboard", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success("Vendor profile submitted for review!")
        router.push("/vendor/dashboard")
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to submit vendor profile")
      }
    } catch (error) {
      console.error("Error submitting vendor profile:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const progress = (step / totalSteps) * 100

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
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
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Business Information"}
                {step === 2 && "About Your Business"}
                {step === 3 && "Review & Submit"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Tell us about your business"}
                {step === 2 && "Help customers understand your services"}
                {step === 3 && "Review your information before submitting"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
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
                      <p className="text-sm text-red-500">{errors.businessName.message}</p>
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
                      <p className="text-sm text-red-500">{errors.location.message}</p>
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
                      <p className="text-sm text-red-500">{errors.websiteUrl.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profilePicture">Profile Picture URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="profilePicture"
                        placeholder="https://example.com/logo.jpg"
                        {...register("profilePictureUrl")}
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add a professional logo or photo of your business
                    </p>
                  </div>
                </>
              )}

              {step === 2 && (
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
                      <p className="text-sm text-red-500">{errors.bio.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {watchedValues.bio?.length || 0}/1000 characters (minimum 50)
                    </p>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your business description helps potential clients understand your services and expertise. 
                      Include your specialties, experience, and what sets you apart from competitors.
                    </AlertDescription>
                  </Alert>
                </>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-medium">Business Name</Label>
                      <p className="text-sm text-muted-foreground">{watchedValues.businessName}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Location</Label>
                      <p className="text-sm text-muted-foreground">{watchedValues.location}</p>
                    </div>
                    {watchedValues.websiteUrl && (
                      <div>
                        <Label className="font-medium">Website</Label>
                        <p className="text-sm text-muted-foreground">{watchedValues.websiteUrl}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="font-medium">Business Description</Label>
                    <p className="text-sm text-muted-foreground mt-1">{watchedValues.bio}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="isPublished" className="font-medium">Publish Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to the public after approval
                      </p>
                    </div>
                    <Switch
                      id="isPublished"
                      checked={watchedValues.isPublished}
                      onCheckedChange={(checked) => setValue("isPublished", checked)}
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your profile will be reviewed by our team before going live. This typically takes 24-48 hours.
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
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={
                  (step === 1 && (!watchedValues.businessName || !watchedValues.location)) ||
                  (step === 2 && (!watchedValues.bio || watchedValues.bio.length < 50))
                }
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                Submit for Review
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

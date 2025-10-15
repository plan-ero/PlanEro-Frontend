"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  ShieldCheck
} from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import ImageUpload from "@/components/image-upload"
import EmailVerification from "@/components/email-verification"
import toast from "react-hot-toast"

const profileSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(1000, "Bio must be less than 1000 characters"),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  profilePictureUrl: z.string().optional(),
  phoneNumber: z.string().optional(),
})

const accountSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
})

const settingsSchema = z.object({
  isPublished: z.boolean(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
})

type ProfileForm = z.infer<typeof profileSchema>
type AccountForm = z.infer<typeof accountSchema>
type SettingsForm = z.infer<typeof settingsSchema>

interface Vendor {
  id: number
  businessName: string
  location: string
  bio: string
  websiteUrl?: string[] // Backend has List<String>
  profilePictureUrl?: string
  email: string
  phoneNumber?: string
  isApproved: boolean
  isPublished: boolean
  emailVerified: boolean
  addressId?: number
  priceEnum?: string
  totalRating?: number
  numberOfRatings?: number
}

interface User {
  id: number
  username: string
  email: string
  phone?: string
  role: string
}

export default function VendorProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authIssue, setAuthIssue] = useState(false)
  const [dataFetched, setDataFetched] = useState(false) // Prevent unnecessary re-fetching
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0) // Track last submission time
  const submissionInProgress = useRef(false) // More reliable submission tracking
  const preventFetch = useRef(false) // Prevent fetchData after successful submissions
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  // emailVerified state is now derived from vendor data



  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  })

  const accountForm = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
  })

  const settingsForm = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
    }
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user && status === "authenticated" && !dataFetched && !preventFetch.current) {
      fetchData()
    }
  }, [session, status, router, dataFetched]) // Keep session dependency but add preventFetch check

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch vendor profile
      const vendorResponse = await fetch(`/api/vendors/profile`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (vendorResponse.ok) {
        const vendorData = await vendorResponse.json()
        console.log('✅ Vendor data received:', vendorData)
        setVendor(vendorData)

        const formData = {
          businessName: vendorData.businessName || "",
          location: vendorData.location || "",
          bio: vendorData.bio || "",
          websiteUrl: vendorData.websiteUrl?.[0] || "", // Take first URL from array
          profilePictureUrl: vendorData.profilePictureUrl || "",
          phoneNumber: vendorData.phoneNumber || "",
        }
        console.log('🔧 Resetting form with data:', formData)
        profileForm.reset(formData)

        settingsForm.reset({
          isPublished: vendorData.isPublished,
          emailNotifications: true,
          smsNotifications: false,
        })

        // Verify form was updated correctly
        setTimeout(() => {
          console.log('✅ Form values after reset:', profileForm.getValues())
        }, 100)
      } else if (vendorResponse.status === 404) {
        // Vendor profile doesn't exist yet - this is ok, we'll show creation form
        const errorData = await vendorResponse.json().catch(() => ({}))
        setVendor(null)
        if (errorData.needsCreation) {
          toast.success("Welcome! Please create your vendor profile to get started")
        } else {
          console.error('Vendor profile not found:', errorData)
          toast.error(errorData.error || "Vendor profile not found. Please create one to continue.")
        }
      } else {
        const errorData = await vendorResponse.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Vendor profile fetch error:', errorData)

        // Check if this is likely an authentication token mismatch
        if (errorData.error && errorData.error.includes('email') && vendorResponse.status === 404) {
          setAuthIssue(true)
          toast.error("Authentication session mismatch detected. Please sign out and sign back in to refresh your session.")
        } else {
          toast.error(`Failed to load vendor profile: ${errorData.error || 'Unknown error'}`)
        }
        setVendor(null)
      }

      // Fetch user account info
      const userResponse = await fetch(`/api/users/profile`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
        accountForm.reset({
          username: userData.username || "",
          email: userData.email || "",
        })
      } else {
        const errorData = await userResponse.json().catch(() => ({ error: 'Unknown error' }))
        console.error('User profile fetch error:', errorData)
        toast.error(`Failed to load user profile: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Network error: Failed to load profile data. Please check your connection.")
    } finally {
      setLoading(false)
      setDataFetched(true) // Mark data as fetched
    }
  }

  const handleImageUploaded = (url: string) => {
    profileForm.setValue("profilePictureUrl", url)
    toast.success("Profile picture uploaded successfully!")
  }

  const handleImageDeleted = () => {
    profileForm.setValue("profilePictureUrl", "")
    toast.success("Profile picture removed successfully!")
  }

  const onProfileSubmit = async (data: ProfileForm) => {
    const now = Date.now()
    const timeDiff = now - lastSubmitTime

    // Multiple layers of protection against double submission
    if (submissionInProgress.current || saving || (timeDiff < 2000)) {
      toast.error('Please wait, your previous submission is still processing...')
      return
    }

    try {
      // Set all protection flags immediately
      submissionInProgress.current = true
      setSaving(true)
      setLastSubmitTime(now)

      // Validate required fields
      const requiredFields = ['businessName', 'location', 'bio'] as const
      const missingFields = requiredFields.filter(field => {
        const value = data[field]
        return !value || value.trim() === ''
      })

      if (missingFields.length > 0) {
        toast.error(`Please fill in required fields: ${missingFields.join(', ')}`)
        console.error('❌ Missing required fields:', missingFields)
        return
      }

      // Validate bio length
      if (data.bio && data.bio.length < 50) {
        toast.error('Bio must be at least 10 characters long')
        console.error('❌ Bio too short:', data.bio.length)
        return
      }

      // Convert websiteUrl string to array for backend
      const profileData = {
        ...data,
        websiteUrl: data.websiteUrl ? [data.websiteUrl] : []
      }

      // Always try PUT first to update existing vendor
      let response = await fetch(`/api/vendors/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      // If PUT fails with 404 (vendor not found), try POST to create new vendor
      if (response.status === 404) {
        response = await fetch(`/api/vendors/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        })
      }

      if (response.ok) {
        const responseData = await response.json()
        toast.success(vendor ? "Profile updated successfully!" : "Profile created successfully!")

        // Update local state with the saved data instead of fetching
        setVendor(responseData)

        // Prevent any subsequent fetchData calls that might reset the form
        preventFetch.current = true
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }))
        const errorMessage = errorData.error || errorData.message || `Failed to save profile (${response.status})`
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error("Network error: Please check your connection and try again.")
    } finally {
      setSaving(false)
      submissionInProgress.current = false
    }
  }

  const onSettingsSubmit = async (data: SettingsForm) => {
    try {
      setSaving(true)

      const response = await fetch(`/api/vendors/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const responseData = await response.json()
        setVendor(prev => prev ? { ...prev, ...responseData } : responseData) // Update vendor state directly
        toast.success("Settings updated successfully!")
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }))
        const errorMessage = errorData.error || errorData.message || `Failed to update settings (${response.status})`
        console.error('Settings update error:', errorData)
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error("Network error: Please check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleVerificationComplete = (token: string) => {
    // Update the vendor state to reflect verified email
    setVendor(prev => prev ? { ...prev, emailVerified: true } : null)
    setShowVerificationDialog(false)
    toast.success("Email verified successfully! Your account is now verified.")
  }

  const openVerificationDialog = () => {
    if (!vendor?.email) {
      toast.error("Email address not found")
      return
    }
    setShowVerificationDialog(true)
  }

  const getStatusInfo = () => {
    if (!vendor) return { icon: AlertCircle, text: "No Profile", variant: "secondary" as const }

    if (!vendor.isApproved) {
      return {
        icon: AlertCircle,
        text: "Pending Approval",
        variant: "secondary" as const,
        description: "Your profile is under review"
      }
    }
    if (!vendor.isPublished) {
      return {
        icon: EyeOff,
        text: "Not Published",
        variant: "outline" as const,
        description: "Your profile is approved but not visible to the public"
      }
    }
    return {
      icon: CheckCircle,
      text: "Live",
      variant: "default" as const,
      description: "Your profile is live and visible to customers"
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your vendor profile and account settings</p>
          </div>
          <Badge variant={statusInfo.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusInfo.text}
          </Badge>
        </div>

        {/* Authentication Issue Alert */}
        {authIssue && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800">Authentication Session Issue Detected</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your authentication token appears to be outdated. This can happen after system updates.
                    Please sign out and sign back in to refresh your session.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out & Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={vendor?.profilePictureUrl} />
                <AvatarFallback>
                  <Building2 className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{vendor?.businessName || "No Business Name"}</h3>
                <p className="text-muted-foreground">{vendor?.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusIcon className="h-4 w-4" />
                  <span className="text-sm">{statusInfo.description}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Business Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
                <CardDescription>
                  Update your business information that customers will see
                </CardDescription>
              </CardHeader>
              <CardContent>

                <form onSubmit={(e) => {
                  e.preventDefault() // Prevent default form submission
                }} className={`space-y-6 ${saving ? 'opacity-75 pointer-events-none' : ''}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        disabled={saving}
                        {...profileForm.register("businessName")}
                        className={profileForm.formState.errors.businessName ? "border-red-500" : ""}
                      />
                      {profileForm.formState.errors.businessName && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.businessName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        disabled={saving}
                        {...profileForm.register("location")}
                        className={profileForm.formState.errors.location ? "border-red-500" : ""}
                      />
                      {profileForm.formState.errors.location && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      disabled={saving}
                      {...profileForm.register("websiteUrl")}
                      className={profileForm.formState.errors.websiteUrl ? "border-red-500" : ""}
                    />
                    {profileForm.formState.errors.websiteUrl && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.websiteUrl.message}
                      </p>
                    )}
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
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      disabled={saving}
                      {...profileForm.register("phoneNumber")}
                      className={profileForm.formState.errors.phoneNumber ? "border-red-500" : ""}
                    />
                    {profileForm.formState.errors.phoneNumber && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Business Description *</Label>
                    <Textarea
                      id="bio"
                      placeholder="Describe your business and services..."
                      className="min-h-32"
                      disabled={saving}
                      {...profileForm.register("bio")}
                    />
                    {profileForm.formState.errors.bio && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.bio.message}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <Button
                    type="button"
                    disabled={saving || submissionInProgress.current}
                    onClick={async (e) => {
                      e.preventDefault()
                      if (!submissionInProgress.current && !saving) {
                        const formData = profileForm.getValues()
                        const isValid = await profileForm.trigger() // Validate form
                        if (isValid) {
                          await onProfileSubmit(formData)
                        } else {
                          toast.error('Please fix form errors before submitting')
                        }
                      } else {
                        toast.error('Please wait, submission in progress...')
                      }
                    }}
                  >
                    {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details (read-only). Contact support to update.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...accountForm.register("username")}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...accountForm.register("email")}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>

                  {/* Email Verification Status */}
                  {vendor?.emailVerified ? (
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-900 dark:text-green-100">
                            Email Verified
                          </h4>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Your email address has been successfully verified. You'll receive all important notifications.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                              Email Verification Required
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              Verify your email address to ensure you receive important notifications and updates about your vendor account.
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={openVerificationDialog}
                          className="whitespace-nowrap"
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Verify Email
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Account information cannot be changed at this time. If you need to update your username or email, please contact support.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Visibility & Notifications</CardTitle>
                <CardDescription>
                  Control how your profile appears and manage notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label>Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to the public
                        </p>
                      </div>
                      <Switch
                        {...settingsForm.register("isPublished")}
                        disabled={!vendor?.isApproved}
                      />
                    </div>

                    {!vendor?.isApproved && (
                      <p className="text-sm text-muted-foreground">
                        Profile visibility will be available after admin approval
                      </p>
                    )}

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch {...settingsForm.register("emailNotifications")} />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <Switch {...settingsForm.register("smsNotifications")} />
                    </div>
                  </div>

                  <Separator />

                  <Button type="submit" disabled={saving}>
                    {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Email Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              We'll send a verification code to your email address
            </DialogDescription>
          </DialogHeader>
          <EmailVerification
            email={vendor?.email || ""}
            onVerificationComplete={handleVerificationComplete}
            showEmailInput={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

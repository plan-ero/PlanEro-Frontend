"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  Star,
  ArrowLeft,
  Calendar,
  Award,
  CheckCircle,
  MessageSquare
} from "lucide-react"

interface Vendor {
  id: number
  businessName: string
  location: string
  bio: string
  websiteUrl: string[]
  profilePictureUrl: string
  email: string
  phoneNumber: string
  addressId: number
  approved: boolean
  published: boolean
}

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const vendorId = params.id as string

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  useEffect(() => {
    if (vendorId) {
      fetchVendor()
    }
  }, [vendorId])

  const fetchVendor = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/vendors/${vendorId}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Vendor not found')
        }
        throw new Error('Failed to fetch vendor details')
      }

      const vendorData = await response.json()
      setVendor(vendorData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
    if (vendorId) {
      fetchVendor()
    }
  }, [vendorId])

  const fetchVendor = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/vendors/${vendorId}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Vendor not found')
        }
        throw new Error('Failed to fetch vendor details')
      }

      const vendorData = await response.json()
      setVendor(vendorData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-destructive mb-2">
                {error || 'Vendor not found'}
              </h2>
              <p className="text-muted-foreground mb-4">
                The vendor you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/vendors">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Vendors
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            asChild
            className="mb-4"
          >
            <Link href="/vendors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vendors
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={vendor?.profilePictureUrl || "/placeholder-user.jpg"}
                      alt={vendor?.businessName || vendor?.email || "Vendor"}
                    />
                    <AvatarFallback className="text-2xl">
                      {getInitials(vendor?.businessName || vendor?.email || "Unknown Vendor")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold">{vendor?.businessName || vendor?.email || "Unnamed Vendor"}</h1>
                      {vendor?.approved && (
                        <Badge variant="default" className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Verified</span>
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {vendor?.location || "Location not specified"}
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.5</span>
                        <span className="text-sm text-muted-foreground">(120 reviews)</span>
                      </div>
                      <Badge variant="secondary">
                        Professional Vendor
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {vendor?.bio || "This vendor hasn't provided a bio yet."}
                </p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "Wedding Planning",
                    "Event Coordination",
                    "Catering",
                    "Photography",
                    "Venue Selection",
                    "Decoration"
                  ].map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Sarah Johnson",
                      rating: 5,
                      comment: "Absolutely amazing service! They made our wedding day perfect.",
                      date: "2 weeks ago"
                    },
                    {
                      name: "Mike Chen",
                      rating: 5,
                      comment: "Professional, reliable, and creative. Highly recommended!",
                      date: "1 month ago"
                    },
                    {
                      name: "Emily Davis",
                      rating: 4,
                      comment: "Great attention to detail and excellent communication.",
                      date: "2 months ago"
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
                            <CardContent className="space-y-4">
                {vendor?.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${vendor.email}`}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {vendor.email}
                    </a>
                  </div>
                )}

                {vendor?.phoneNumber && vendor.phoneNumber.trim() && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${vendor.phoneNumber}`}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {vendor.phoneNumber}
                    </a>
                  </div>
                )}

                {vendor?.websiteUrl && Array.isArray(vendor.websiteUrl) && vendor.websiteUrl.length > 0 && vendor.websiteUrl[0] && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={vendor.websiteUrl[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-primary transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Vendor
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="text-sm font-medium">Within 2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed Projects</span>
                  <span className="text-sm font-medium">150+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Years Experience</span>
                  <span className="text-sm font-medium">8 years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Service Areas</span>
                  <span className="text-sm font-medium">50+ cities</span>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Certified Event Planner</p>
                      <p className="text-xs text-muted-foreground">International Event Institute</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Wedding Specialist</p>
                      <p className="text-xs text-muted-foreground">Association of Bridal Consultants</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

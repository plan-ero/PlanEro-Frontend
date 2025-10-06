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
import { StarRating } from "@/components/ui/star-rating"
import { RatingsDisplay } from "@/components/ratings-display"
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
  MessageSquare,
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
  Building,
  DollarSign,
  Tag
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
  totalRating?: number
  numberOfRatings?: number
}

interface Service {
  id: number
  name: string
  serviceType: string
  eventType: string
  priceEnum: string
  availability: boolean
  cost: number
  metadata?: string
  images?: string[]
  vendorId: number
  totalRating?: number
  numberOfRatings?: number
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
  VENUE: Building,
}

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [servicesLoading, setServicesLoading] = useState(false)
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
      
      // Fetch vendor services
      await fetchVendorServices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchVendorServices = async () => {
    try {
      setServicesLoading(true)
      const response = await fetch(`/api/services?vendorId=${vendorId}`)
      
      if (response.ok) {
        const servicesData = await response.json()
        setServices(Array.isArray(servicesData) ? servicesData : [])
      } else {
        console.error('Failed to fetch vendor services')
        setServices([])
      }
    } catch (err) {
      console.error('Error fetching vendor services:', err)
      setServices([])
    } finally {
      setServicesLoading(false)
    }
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
                      {(vendor?.totalRating !== undefined && vendor?.numberOfRatings !== undefined) ? (
                        <div className="flex items-center gap-2">
                          <StarRating rating={vendor.totalRating || 0} readonly size="md" />
                          <span className="text-sm text-muted-foreground">({vendor.numberOfRatings} reviews)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <StarRating rating={0} readonly size="md" />
                          <span className="text-sm text-muted-foreground">(No reviews yet)</span>
                        </div>
                      )}
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

            {/* Ratings & Reviews Section */}
            <RatingsDisplay
              vendorId={vendor.id}
              title={`Reviews for ${vendor.businessName}`}
              showAddRating={true}
            />
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

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Services Offered
                  <Badge variant="secondary">{services.length} Services</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => {
                      const ServiceIcon = serviceTypeIcons[service.serviceType] || Tag
                      return (
                        <Card key={service.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <ServiceIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm mb-1 line-clamp-1">{service.name}</h4>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {service.serviceType.replace(/_/g, " ")}
                                  </Badge>
                                  <Badge 
                                    variant={service.availability ? "default" : "secondary"}
                                    className={service.availability ? "bg-green-100 text-green-800 border-green-200 text-xs" : "text-xs"}
                                  >
                                    {service.availability ? "Available" : "Unavailable"}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3 text-green-600" />
                                    <span className="text-sm font-semibold text-green-600">
                                      ${service.cost.toFixed(2)}
                                    </span>
                                  </div>
                                  {service.totalRating !== undefined && service.numberOfRatings !== undefined ? (
                                    <div className="flex items-center gap-1">
                                      <StarRating rating={service.totalRating || 0} readonly size="sm" />
                                      <span className="text-xs text-muted-foreground">
                                        ({service.numberOfRatings})
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">No reviews</span>
                                  )}
                                </div>
                                <Button asChild size="sm" className="w-full mt-3" variant="outline">
                                  <Link href={`/services/${service.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No services available yet.</p>
                  </div>
                )}
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

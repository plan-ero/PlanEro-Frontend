"use client"

import React, { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Clock, 
  Tag,
  Camera,
  Music,
  Utensils,
  Palette,
  Car,
  Heart,
  Gift,
  Mic,
  Sparkles,
  User,
  Cake,
  Crown,
  TrendingUp,
  Zap,
  Star,
  Gem,
  Building,
  MapPin,
  Upload,
  X,
  Image as ImageIcon
} from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import toast from "react-hot-toast"

// Service Types Enum based on backend
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

// Event Types Enum based on backend
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

// Price Enum based on backend
enum PriceEnum {
  INEXPENSIVE = "INEXPENSIVE",
  AFFORDABLE = "AFFORDABLE", 
  MODERATE = "MODERATE",
  LUXURY = "LUXURY",
}

const serviceTypeIcons = {
  [ServiceType.PHOTOGRAPHER]: Camera,
  [ServiceType.PHOTO_VIDEOGRAPHER]: Camera,
  [ServiceType.DECORATOR]: Palette,
  [ServiceType.FLORIST]: Gift,
  [ServiceType.CATERS]: Utensils,
  [ServiceType.BAKERS]: Cake,
  [ServiceType.TRANSPORTATION]: Car,
  [ServiceType.BRIDE_GROOMING]: Crown,
  [ServiceType.WEDDING_BAND]: Music,
  [ServiceType.DJ]: Music,
  [ServiceType.SINGER]: Mic,
  [ServiceType.ANCHOR]: User,
  [ServiceType.MAGICIAN]: Sparkles,
  [ServiceType.VENUE]: Building,
}

const eventTypeIcons = {
  [EventType.WEDDING]: Heart,
  [EventType.BIRTHDAY]: Gift,
  [EventType.ANNIVERSARY]: Heart,
  [EventType.CORPORATE]: User,
  [EventType.ENGAGEMENT]: Heart,
  [EventType.BABY_SHOWER]: Gift,
  [EventType.GRADUATION]: Sparkles,
  [EventType.HOLIDAY_PARTY]: Gift,
  [EventType.CONFERENCE]: User,
  [EventType.EXHIBITION]: Tag,
}

const priceEnumIcons = {
  [PriceEnum.INEXPENSIVE]: DollarSign,
  [PriceEnum.AFFORDABLE]: TrendingUp,
  [PriceEnum.MODERATE]: Zap,
  [PriceEnum.LUXURY]: Gem,
}

const serviceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  serviceType: z.nativeEnum(ServiceType),
  eventType: z.nativeEnum(EventType),
  priceEnum: z.nativeEnum(PriceEnum),
  availability: z.boolean().default(true),
  cost: z.number().min(0, "Cost must be a positive number"),
  metadata: z.string().optional(),
  images: z.array(z.string()).optional(),
})

type ServiceForm = z.infer<typeof serviceSchema>

interface Service {
  id: number
  name: string
  serviceType: ServiceType
  eventType: EventType
  priceEnum: PriceEnum
  availability: boolean
  cost: number
  metadata?: string
  images?: string[]
  vendorId: number
}

export default function VendorServices() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState("")

  const form = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      serviceType: ServiceType.PHOTOGRAPHER,
      eventType: EventType.WEDDING,
      priceEnum: PriceEnum.MODERATE,
      availability: true,
      cost: 0,
      metadata: "",
      images: [],
    }
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user && status === "authenticated") {
      fetchServices()
    }
  }, [session, status, router])

  // Helper function to create authenticated headers
  const getAuthHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Check all possible token locations
    let token = null
    
    if ((session as any)?.apiToken) {
      token = (session as any).apiToken
    } else if ((session as any)?.user?.token) {
      token = (session as any).user.token
    } else if ((session as any)?.token) {
      token = (session as any).token
    }
    
    // Add authorization header if we have a token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }
  
  const fetchServices = async () => {
    try {
      setLoading(true)
      // Get authenticated headers
      const headers = getAuthHeaders()
      // Get vendorId from session (user.profile or user.vendorId)
      let vendorId = null
      // Prefer vendor.id (number) from session
      if ((session as any)?.user?.vendor?.id && !isNaN(Number((session as any).user.vendor.id))) {
        vendorId = (session as any).user.vendor.id
      } else if ((session as any)?.user?.vendorId && !isNaN(Number((session as any).user.vendorId))) {
        vendorId = (session as any).user.vendorId
      }
      if (!vendorId) {
        toast.error("No valid numeric vendorId found in session. Please re-login as a vendor.")
        console.log("Session user data:", session?.user)
        setLoading(false)
        return
      }
      console.log("Fetching services for vendorId:", session)

      const response = await fetch(`/api/vendors/services?vendorId=${vendorId}`, {
        headers,
      })
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else if (response.status === 401) {
        toast.error("Authentication required. Please sign in again.")
        router.push('/auth/signin')
      } else {
        toast.error("Failed to load services")
      }
    } catch (error) {
      console.error("Error fetching services:", error)
      toast.error("Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ServiceForm) => {
    try {
      setSaving(true)
      
      const url = editingService 
        ? `/api/vendors/services/${editingService.id}`
        : `/api/vendors/services`
      
      const method = editingService ? "PUT" : "POST"
      
      // Get authenticated headers
      const headers = getAuthHeaders()
      
      // Get vendorId from session for new services
      let requestData: any = { ...data }
      
      if (!editingService) {
        // For new services, add vendorId
        let vendorId = null
        
        // Debug log to see what we have in session
        console.log("Session data for vendorId extraction:", {
          session: session,
          user: (session as any)?.user,
          vendor: (session as any)?.user?.vendor
        })
        
        if ((session as any)?.user?.vendor?.id) {
          vendorId = Number((session as any).user.vendor.id)
          console.log("Using vendor.id from session:", vendorId)
        }
        
        if (!vendorId || isNaN(vendorId)) {
          console.error("Invalid vendorId extracted:", vendorId)
          toast.error("No valid vendorId found in session. Please re-login.")
          setSaving(false)
          return
        }
        
        requestData = { ...data, vendorId }
        console.log("Request data being sent:", requestData)
      }
      
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        toast.success(editingService ? "Service updated successfully!" : "Service added successfully!")
        setDialogOpen(false)
        setEditingService(null)
        form.reset()
        fetchServices()
      } else {
        const error = await response.json()
        console.error("API Error Response:", error)
        toast.error(error.message || error.error || "Failed to save service")
      }
    } catch (error) {
      console.error("Error saving service:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const deleteService = async (serviceId: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      // Get authenticated headers
      const headers = getAuthHeaders()
      
      const response = await fetch(`/api/vendors/services/${serviceId}`, {
        method: "DELETE",
        headers,
      })

      if (response.ok) {
        toast.success("Service deleted successfully!")
        fetchServices()
      } else {
        toast.error("Failed to delete service")
      }
    } catch (error) {
      console.error("Error deleting service:", error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const toggleAvailability = async (service: Service) => {
    try {
      // Get authenticated headers
      const headers = getAuthHeaders()
      
      const response = await fetch(`/api/vendors/services/${service.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          ...service,
          availability: !service.availability,
        }),
      })

      if (response.ok) {
        toast.success("Service availability updated!")
        fetchServices()
      } else {
        toast.error("Failed to update service availability")
      }
    } catch (error) {
      console.error("Error updating service:", error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  // Image management functions
  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      const updatedUrls = [...imageUrls, newImageUrl.trim()]
      setImageUrls(updatedUrls)
      form.setValue("images", updatedUrls)
      setNewImageUrl("")
    }
  }

  const removeImageUrl = (index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(updatedUrls)
    form.setValue("images", updatedUrls)
  }

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    const serviceImages = service.images || []
    setImageUrls(serviceImages)
    form.reset({
      name: service.name,
      serviceType: service.serviceType,
      eventType: service.eventType,
      priceEnum: service.priceEnum,
      availability: service.availability,
      cost: service.cost,
      metadata: service.metadata || "",
      images: serviceImages,
    })
    setDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingService(null)
    setImageUrls([])
    setNewImageUrl("")
    form.reset({
      name: "",
      serviceType: ServiceType.PHOTOGRAPHER,
      eventType: EventType.WEDDING,
      priceEnum: PriceEnum.MODERATE,
      availability: true,
      cost: 0,
      metadata: "",
      images: [],
    })
    setDialogOpen(true)
  }

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Services</h1>
            <p className="text-muted-foreground">Manage the services you offer to customers</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Edit Service" : "Add New Service"}
                </DialogTitle>
                <DialogDescription>
                  {editingService ? "Update your service details" : "Add a new service to your offerings"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Service Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Wedding Photography"
                      {...form.register("name")}
                      className={form.formState.errors.name ? "border-red-500" : ""}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select 
                      value={form.watch("serviceType")} 
                      onValueChange={(value) => form.setValue("serviceType", value as ServiceType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ServiceType).map((type) => {
                          const IconComponent = serviceTypeIcons[type]
                          return (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                {type.replace(/_/g, " ")}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Select 
                      value={form.watch("eventType")} 
                      onValueChange={(value) => form.setValue("eventType", value as EventType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EventType).map((type) => {
                          const IconComponent = eventTypeIcons[type]
                          return (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                {type.replace(/_/g, " ")}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceEnum">Price Tier *</Label>
                    <Select 
                      value={form.watch("priceEnum")} 
                      onValueChange={(value) => form.setValue("priceEnum", value as PriceEnum)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select price tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PriceEnum).map((tier) => {
                          const IconComponent = priceEnumIcons[tier]
                          return (
                            <SelectItem key={tier} value={tier}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                {tier.replace(/_/g, " ")}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (USD) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10"
                      {...form.register("cost", { valueAsNumber: true })}
                    />
                  </div>
                  {form.formState.errors.cost && (
                    <p className="text-sm text-red-500">{form.formState.errors.cost.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metadata">Additional Details</Label>
                  <Textarea
                    id="metadata"
                    placeholder="Include packages, duration, special features, etc."
                    {...form.register("metadata")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add any specific details about this service that customers should know
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Service Images (Optional)</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter image URL"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addImageUrl}
                        disabled={!newImageUrl.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {imageUrls.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Added Images:</p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {imageUrls.map((url, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                              <ImageIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-sm truncate flex-1">{url}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeImageUrl(index)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      Add image URLs to showcase your service. Images help customers understand what you offer.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="availability">Service Available</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle availability of this service
                    </p>
                  </div>
                  <Switch
                    id="availability"
                    checked={form.watch("availability")}
                    onCheckedChange={(checked) => form.setValue("availability", checked)}
                  />
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                    {editingService ? "Update Service" : "Add Service"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Tag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Services Added</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first service to showcase what you offer
              </p>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              // Fallback to 'PHOTOGRAPHER' if serviceType is missing or invalid
              const typeKey = service.serviceType && serviceTypeIcons[service.serviceType] ? service.serviceType : ServiceType.PHOTOGRAPHER;
              const IconComponent = serviceTypeIcons[typeKey] || Tag;
              
              // Get event type icon and fallback
              const eventTypeKey = service.eventType && eventTypeIcons[service.eventType] ? service.eventType : EventType.WEDDING;
              const EventIconComponent = eventTypeIcons[eventTypeKey] || Tag;
              
              // Get price tier icon and fallback
              const priceKey = service.priceEnum && priceEnumIcons[service.priceEnum] ? service.priceEnum : PriceEnum.MODERATE;
              const PriceIconComponent = priceEnumIcons[priceKey] || DollarSign;
              
              return (
                <Card key={service.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-semibold text-gray-900">{service.name}</CardTitle>
                          <div className="mt-2 space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span className="font-medium">Service:</span>
                              <span>{typeKey.replace(/_/g, " ")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <EventIconComponent className="h-3.5 w-3.5 text-gray-500" />
                              <span className="font-medium">Event:</span>
                              <span>{eventTypeKey.replace(/_/g, " ")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <PriceIconComponent className="h-3.5 w-3.5 text-gray-500" />
                              <span className="font-medium">Tier:</span>
                              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50">
                                {priceKey.replace(/_/g, " ")}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant={service.availability ? "default" : "secondary"}
                          className={service.availability ? "bg-green-100 text-green-800 border-green-200" : ""}
                        >
                          {service.availability ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <span className="text-lg font-bold text-gray-900">${service.cost.toFixed(2)}</span>
                          <p className="text-xs text-gray-500">Starting price</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Available:</span>
                        <Switch
                          checked={service.availability}
                          onCheckedChange={() => toggleAvailability(service)}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>
                    </div>

                    {service.images && service.images.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <ImageIcon className="h-4 w-4" />
                          Service Images ({service.images.length})
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {service.images.slice(0, 4).map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={imageUrl}
                                alt={`${service.name} image ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              {index === 3 && service.images && service.images.length > 4 && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    +{service.images.length - 3} more
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {service.metadata && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800 leading-relaxed">
                          {service.metadata}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-400">
                        Service ID: {service.id}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                          onClick={() => openEditDialog(service)}
                        >
                          <Edit className="h-3 w-3 mr-1.5" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                          onClick={() => deleteService(service.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

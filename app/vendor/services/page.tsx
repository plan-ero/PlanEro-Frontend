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
  Gift
} from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import toast from "react-hot-toast"

// Service Types Enum based on backend
enum ServiceType {
  PHOTOGRAPHY = "PHOTOGRAPHY",
  VIDEOGRAPHY = "VIDEOGRAPHY", 
  CATERING = "CATERING",
  DECORATION = "DECORATION",
  MUSIC_DJ = "MUSIC_DJ",
  LIVE_BAND = "LIVE_BAND",
  VENUE = "VENUE",
  FLOWERS = "FLOWERS",
  TRANSPORTATION = "TRANSPORTATION",
  ENTERTAINMENT = "ENTERTAINMENT",
  PLANNING = "PLANNING",
  OTHER = "OTHER"
}

const serviceTypeIcons = {
  [ServiceType.PHOTOGRAPHY]: Camera,
  [ServiceType.VIDEOGRAPHY]: Camera,
  [ServiceType.CATERING]: Utensils,
  [ServiceType.DECORATION]: Palette,
  [ServiceType.MUSIC_DJ]: Music,
  [ServiceType.LIVE_BAND]: Music,
  [ServiceType.VENUE]: Heart,
  [ServiceType.FLOWERS]: Gift,
  [ServiceType.TRANSPORTATION]: Car,
  [ServiceType.ENTERTAINMENT]: Heart,
  [ServiceType.PLANNING]: Tag,
  [ServiceType.OTHER]: Tag,
}

const serviceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  serviceType: z.nativeEnum(ServiceType),
  isAvailable: z.boolean().default(true),
  cost: z.number().min(0, "Cost must be a positive number"),
  metadata: z.string().optional(),
})

type ServiceForm = z.infer<typeof serviceSchema>

interface Service {
  id: number
  name: string
  serviceType: ServiceType
  isAvailable: boolean
  cost: number
  metadata?: string
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

  const form = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      isAvailable: true,
      cost: 0,
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
      
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingService ? "Service updated successfully!" : "Service added successfully!")
        setDialogOpen(false)
        setEditingService(null)
        form.reset()
        fetchServices()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to save service")
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
      const response = await fetch(`/api/vendors/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...service,
          isAvailable: !service.isAvailable,
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

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    form.reset({
      name: service.name,
      serviceType: service.serviceType,
      isAvailable: service.isAvailable,
      cost: service.cost,
      metadata: service.metadata || "",
    })
    setDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingService(null)
    form.reset({
      name: "",
      serviceType: ServiceType.OTHER,
      isAvailable: true,
      cost: 0,
      metadata: "",
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
                            <SelectItem key={type} value={type || "OTHER"}>
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

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="isAvailable">Service Available</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle availability of this service
                    </p>
                  </div>
                  <Switch
                    id="isAvailable"
                    checked={form.watch("isAvailable")}
                    onCheckedChange={(checked) => form.setValue("isAvailable", checked)}
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
              // Fallback to 'OTHER' if serviceType is missing or invalid
              const typeKey = service.serviceType && serviceTypeIcons[service.serviceType] ? service.serviceType : 'OTHER';
              const IconComponent = serviceTypeIcons[typeKey] || Tag;
              return (
                <Card key={service.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription>
                            {(service.serviceType ? String(service.serviceType).replace(/_/g, " ") : 'Other')}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={service.isAvailable ? "default" : "secondary"}>
                        {service.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">${service.cost.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Switch
                          checked={service.isAvailable}
                          onCheckedChange={() => toggleAvailability(service)}
                        />
                      </div>
                    </div>

                    {service.metadata && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.metadata}
                      </p>
                    )}

                    <Separator />

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(service)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteService(service.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
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

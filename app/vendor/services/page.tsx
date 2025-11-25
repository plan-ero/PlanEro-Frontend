"use client";

import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Image as ImageIcon,
  MoreVertical,
  Briefcase,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StarRating } from "@/components/ui/star-rating";
import MultiImageUpload from "@/components/multi-image-upload";
import toast from "react-hot-toast";
import { getPriceDisplay, PriceEnum } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
};

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
};

const priceEnumIcons = {
  [PriceEnum.INEXPENSIVE]: DollarSign,
  [PriceEnum.AFFORDABLE]: TrendingUp,
  [PriceEnum.MODERATE]: Zap,
  [PriceEnum.LUXURY]: Gem,
};

const serviceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  serviceType: z.nativeEnum(ServiceType),
  eventType: z.nativeEnum(EventType),
  priceEnum: z.nativeEnum(PriceEnum),
  availability: z.boolean().default(true),
  metadata: z.string().optional(),
  images: z.array(z.string()).optional(),
});

type ServiceForm = z.infer<typeof serviceSchema>;

interface Service {
  id: number;
  name: string;
  serviceType: ServiceType;
  eventType: EventType;
  priceEnum: PriceEnum;
  availability: boolean;
  metadata?: string;
  images?: string[];
  vendorId: number;
  totalRating?: number;
  numberOfRatings?: number;
}

export default function VendorServices() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const form = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      serviceType: ServiceType.PHOTOGRAPHER,
      eventType: EventType.WEDDING,
      priceEnum: PriceEnum.MODERATE,
      availability: true,
      metadata: "",
      images: [],
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session?.user && status === "authenticated") {
      fetchServices();
    }
  }, [session, status, router]);

  // Helper function to create authenticated headers
  const getAuthHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Check all possible token locations
    let token = null;

    if ((session as any)?.apiToken) {
      token = (session as any).apiToken;
    } else if ((session as any)?.user?.token) {
      token = (session as any).user.token;
    } else if ((session as any)?.token) {
      token = (session as any).token;
    }

    // Add authorization header if we have a token
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Get authenticated headers
      const headers = getAuthHeaders();
      // Get vendorId from session (user.profile or user.vendorId)
      let vendorId = null;
      // Prefer vendor.id (number) from session
      if (
        (session as any)?.user?.vendor?.id &&
        !isNaN(Number((session as any).user.vendor.id))
      ) {
        vendorId = (session as any).user.vendor.id;
      } else if (
        (session as any)?.user?.vendorId &&
        !isNaN(Number((session as any).user.vendorId))
      ) {
        vendorId = (session as any).user.vendorId;
      }
      if (!vendorId) {
        toast.error(
          "No valid numeric vendorId found in session. Please re-login as a vendor.",
        );
        console.log("Session user data:", session?.user);
        setLoading(false);
        return;
      }
      console.log("Fetching services for vendorId:", session);

      const response = await fetch(
        `/api/vendors/services?vendorId=${vendorId}`,
        {
          headers,
        },
      );
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else if (response.status === 401) {
        toast.error("Authentication required. Please sign in again.");
        router.push("/auth/signin");
      } else {
        toast.error("Failed to load services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ServiceForm) => {
    try {
      setSaving(true);

      const url = editingService
        ? `/api/vendors/services/${editingService.id}`
        : `/api/vendors/services`;

      const method = editingService ? "PUT" : "POST";

      // Get authenticated headers
      const headers = getAuthHeaders();

      // Get vendorId from session for new services
      let requestData: any = { ...data };

      if (!editingService) {
        // For new services, add vendorId
        let vendorId = null;

        // Debug log to see what we have in session
        console.log("Session data for vendorId extraction:", {
          session: session,
          user: (session as any)?.user,
          vendor: (session as any)?.user?.vendor,
        });

        if ((session as any)?.user?.vendor?.id) {
          vendorId = Number((session as any).user.vendor.id);
          console.log("Using vendor.id from session:", vendorId);
        }

        if (!vendorId || isNaN(vendorId)) {
          console.error("Invalid vendorId extracted:", vendorId);
          toast.error("No valid vendorId found in session. Please re-login.");
          setSaving(false);
          return;
        }

        requestData = { ...data, vendorId };
        console.log("Request data being sent:", requestData);
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        toast.success(
          editingService
            ? "Service updated successfully!"
            : "Service added successfully!",
        );
        setDialogOpen(false);
        setEditingService(null);
        form.reset();
        fetchServices();
      } else {
        const error = await response.json();
        console.error("API Error Response:", error);
        toast.error(error.message || error.error || "Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (serviceId: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      // Get authenticated headers
      const headers = getAuthHeaders();

      const response = await fetch(`/api/vendors/services/${serviceId}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        toast.success("Service deleted successfully!");
        fetchServices();
      } else {
        toast.error("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleAvailability = async (service: Service) => {
    try {
      // Get authenticated headers
      const headers = getAuthHeaders();

      const response = await fetch(`/api/vendors/services/${service.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          ...service,
          availability: !service.availability,
        }),
      });

      if (response.ok) {
        toast.success("Service availability updated!");
        fetchServices();
      } else {
        toast.error("Failed to update service availability");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    const serviceImages = service.images || [];
    form.reset({
      name: service.name,
      serviceType: service.serviceType,
      eventType: service.eventType,
      priceEnum: service.priceEnum,
      availability: service.availability,
      metadata: service.metadata || "",
      images: serviceImages,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingService(null);
    form.reset({
      name: "",
      serviceType: ServiceType.PHOTOGRAPHER,
      eventType: EventType.WEDDING,
      priceEnum: PriceEnum.MODERATE,
      availability: true,
      metadata: "",
      images: [],
    });
    setDialogOpen(true);
  };

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-3xl border border-primary/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              My Services
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage the services you offer to customers
            </p>
          </div>
          <Button onClick={openAddDialog} size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
            <Plus className="h-5 w-5 mr-2" />
            Add New Service
          </Button>
        </div>

        {/* Services Grid */}
        <AnimatePresence>
          {services.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-dashed border-2 bg-muted/30">
                <CardContent className="pt-6 text-center py-20">
                  <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Briefcase className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Services Added Yet</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Start by adding your first service to showcase what you offer to potential clients.
                  </p>
                  <Button onClick={openAddDialog} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Service
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                // Fallback to 'PHOTOGRAPHER' if serviceType is missing or invalid
                const typeKey =
                  service.serviceType && serviceTypeIcons[service.serviceType]
                    ? service.serviceType
                    : ServiceType.PHOTOGRAPHER;
                const IconComponent = serviceTypeIcons[typeKey] || Tag;

                // Get event type icon and fallback
                const eventTypeKey =
                  service.eventType && eventTypeIcons[service.eventType]
                    ? service.eventType
                    : EventType.WEDDING;
                const EventIconComponent = eventTypeIcons[eventTypeKey] || Tag;

                // Get price tier icon and fallback
                const priceKey =
                  service.priceEnum && priceEnumIcons[service.priceEnum]
                    ? service.priceEnum
                    : PriceEnum.MODERATE;
                const PriceIconComponent = priceEnumIcons[priceKey] || DollarSign;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden h-full flex flex-col">
                      {/* Service Image Preview */}
                      <div className="h-48 bg-muted relative overflow-hidden">
                        {service.images && service.images.length > 0 ? (
                          <img
                            src={service.images[0]}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/50">
                            <IconComponent className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Badge
                            variant={service.availability ? "default" : "secondary"}
                            className={`${service.availability
                                ? "bg-green-500/90 hover:bg-green-600/90 text-white"
                                : "bg-gray-500/90 hover:bg-gray-600/90 text-white"
                              } backdrop-blur-sm shadow-sm`}
                          >
                            {service.availability ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                          <h3 className="font-bold text-lg truncate">{service.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <IconComponent className="h-3.5 w-3.5" />
                            <span>{typeKey.replace(/_/g, " ")}</span>
                          </div>
                        </div>
                      </div>

                      <CardContent className="flex-1 p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Event Type</span>
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <EventIconComponent className="h-4 w-4 text-primary" />
                              <span className="truncate">{eventTypeKey.replace(/_/g, " ")}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Price Tier</span>
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <PriceIconComponent className="h-4 w-4 text-primary" />
                              <span>{priceKey.replace(/_/g, " ")}</span>
                            </div>
                          </div>
                        </div>

                        {service.totalRating !== undefined && service.numberOfRatings !== undefined && (
                          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-sm font-bold">
                              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                              {service.totalRating.toFixed(1)}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({service.numberOfRatings} reviews)
                            </span>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="p-4 bg-muted/30 border-t border-border/50 flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.availability}
                            onCheckedChange={() => toggleAvailability(service)}
                            className="scale-75 data-[state=checked]:bg-green-500"
                          />
                          <span className="text-xs text-muted-foreground font-medium">
                            {service.availability ? "On" : "Off"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(service)}
                            className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteService(service.id)}
                            className="h-8 w-8 p-0 rounded-full hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {editingService ? <Edit className="h-6 w-6 text-primary" /> : <Plus className="h-6 w-6 text-primary" />}
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? "Update your service details and pricing"
                  : "Fill in the details to add a new service to your portfolio"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Premium Wedding Photography"
                    {...form.register("name")}
                    className={form.formState.errors.name ? "border-red-500" : ""}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Select
                    value={form.watch("serviceType")}
                    onValueChange={(value) =>
                      form.setValue("serviceType", value as ServiceType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ServiceType).map((type) => {
                        const IconComponent = serviceTypeIcons[type];
                        return (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {type.replace(/_/g, " ")}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Select
                    value={form.watch("eventType")}
                    onValueChange={(value) =>
                      form.setValue("eventType", value as EventType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EventType).map((type) => {
                        const IconComponent = eventTypeIcons[type];
                        return (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {type.replace(/_/g, " ")}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceEnum">Price Tier *</Label>
                  <Select
                    value={form.watch("priceEnum")}
                    onValueChange={(value) =>
                      form.setValue("priceEnum", value as PriceEnum)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PriceEnum).map((tier) => {
                        const IconComponent = priceEnumIcons[tier];
                        return (
                          <SelectItem key={tier} value={tier}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {tier.replace(/_/g, " ")}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metadata">Additional Details</Label>
                <Textarea
                  id="metadata"
                  placeholder="Include packages, duration, special features, equipment used, etc."
                  className="min-h-[100px]"
                  {...form.register("metadata")}
                />
                <p className="text-xs text-muted-foreground">
                  Provide specific details that help clients understand what's included.
                </p>
              </div>

              <div className="space-y-2">
                <MultiImageUpload
                  label="Service Images (Max 5)"
                  currentImages={form.watch("images") || []}
                  onImagesChange={(urls) => form.setValue("images", urls)}
                  maxImages={5}
                  folder="service-images"
                  className="space-y-2"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="space-y-1">
                  <Label htmlFor="availability" className="text-base">Available for Booking</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn this off to temporarily hide this service from search results
                  </p>
                </div>
                <Switch
                  id="availability"
                  checked={form.watch("availability")}
                  onCheckedChange={(checked) =>
                    form.setValue("availability", checked)
                  }
                />
              </div>

              <DialogFooter className="pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="min-w-[120px]">
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {editingService ? "Update Service" : "Add Service"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

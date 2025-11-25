"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  CalendarCheck,
  CheckCircle,
  CreditCard,
  TrendingUp,
  MoreVertical,
  Search,
  Filter,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock data interface - would be replaced with actual API types
interface ServiceBooking {
  id: string;
  serviceName: string;
  vendorName: string;
  date: string;
  time: string;
  location: string;
  status: "completed" | "upcoming" | "cancelled";
  price: number;
  imageUrl: string;
  rating?: number;
  hasReview: boolean;
}

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    // Mock data load - would be replaced with API call
    const mockFetchBookings = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        // await api.getUserBookings(session.user.id)

        // Mock data for demonstration
        setTimeout(() => {
          setBookings([
            {
              id: "booking1",
              serviceName: "Elite Wedding Photography",
              vendorName: "CaptureMoment Studios",
              date: "2023-10-15",
              time: "14:00 - 18:00",
              location: "Los Angeles, CA",
              status: "completed",
              price: 2500,
              imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
              rating: 5,
              hasReview: true,
            },
            {
              id: "booking2",
              serviceName: "Gourmet Catering Co.",
              vendorName: "Delicious Bites",
              date: "2023-11-05",
              time: "18:00 - 22:00",
              location: "San Francisco, CA",
              status: "completed",
              price: 3200,
              imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
              rating: 4,
              hasReview: true,
            },
            {
              id: "booking3",
              serviceName: "Premium DJ Services",
              vendorName: "BeatMasters",
              date: "2023-12-18",
              time: "20:00 - 24:00",
              location: "San Diego, CA",
              status: "upcoming",
              price: 1200,
              imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
              hasReview: false,
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookings. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    mockFetchBookings();
  }, [status, router, toast]);

  const leaveReview = (bookingId: string) => {
    toast({
      title: "Coming Soon",
      description: "Review feature is coming soon!",
    });
  };

  const cancelBooking = (bookingId: string) => {
    toast({
      title: "Coming Soon",
      description: "Cancellation feature is coming soon!",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: CalendarCheck,
      description: "All time booking count",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Upcoming",
      value: bookings.filter((b) => b.status === "upcoming").length,
      icon: Clock,
      description: "Services to look forward to",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Completed",
      value: bookings.filter((b) => b.status === "completed").length,
      icon: CheckCircle,
      description: "Services you've enjoyed",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Spent",
      value: `$${bookings
        .reduce((sum, booking) => sum + (booking.price || 0), 0)
        .toLocaleString()}`,
      icon: CreditCard,
      description: "Your investment in services",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-3xl border border-primary/10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Welcome back, {session?.user?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your events and bookings in one place.
          </p>
        </div>
        <Button size="lg" className="shadow-lg hover:shadow-xl transition-all rounded-full px-8" asChild>
          <Link href="/search">
            <Sparkles className="mr-2 h-4 w-4" />
            Explore Services
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${stat.bg.replace('bg-', 'bg-')}`} />
              <CardContent className="p-6 flex items-center space-x-4 relative z-10">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bookings Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Bookings</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search bookings..." className="pl-9 rounded-full bg-muted/50 border-transparent focus:bg-background transition-colors" />
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-full inline-flex h-auto">
            <TabsTrigger value="all" className="rounded-full px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">All Bookings</TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-full px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Upcoming</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-full px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <BookingsGrid
              bookings={bookings}
              onReview={leaveReview}
              onCancel={cancelBooking}
            />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <BookingsGrid
              bookings={bookings.filter((b) => b.status === "upcoming")}
              onReview={leaveReview}
              onCancel={cancelBooking}
              emptyMessage="You don't have any upcoming bookings."
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <BookingsGrid
              bookings={bookings.filter((b) => b.status === "completed")}
              onReview={leaveReview}
              onCancel={cancelBooking}
              emptyMessage="You don't have any completed bookings yet."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BookingsGrid({
  bookings,
  onReview,
  onCancel,
  emptyMessage = "You don't have any bookings yet."
}: {
  bookings: ServiceBooking[];
  onReview: (id: string) => void;
  onCancel: (id: string) => void;
  emptyMessage?: string;
}) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-3xl bg-muted/5">
        <div className="p-6 rounded-full bg-muted/50 mb-4">
          <Calendar className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{emptyMessage}</h3>
        <p className="text-muted-foreground mb-8 max-w-md">
          Discover amazing vendors and services for your next event and start planning today.
        </p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/search">Browse Services</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking, index) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <BookingCard
            booking={booking}
            onReview={onReview}
            onCancel={onCancel}
          />
        </motion.div>
      ))}
    </div>
  );
}

function BookingCard({
  booking,
  onReview,
  onCancel,
}: {
  booking: ServiceBooking;
  onReview: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const bookingDate = new Date(booking.date);

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-none shadow-md ring-1 ring-black/5 dark:ring-white/10 h-full flex flex-col">
      <div className="h-56 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img
          src={booking.imageUrl}
          alt={booking.serviceName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 z-20">
          <Badge
            className={cn(
              "backdrop-blur-md border-none px-3 py-1 text-xs font-semibold shadow-lg",
              booking.status === "completed"
                ? "bg-green-500/90 text-white hover:bg-green-500"
                : booking.status === "upcoming"
                  ? "bg-blue-500/90 text-white hover:bg-blue-500"
                  : "bg-red-500/90 text-white hover:bg-red-500"
            )}
          >
            {booking.status === "completed"
              ? "Completed"
              : booking.status === "upcoming"
                ? "Upcoming"
                : "Cancelled"}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 z-20 text-white">
          <p className="font-bold text-xl leading-tight mb-1">{booking.serviceName}</p>
          <p className="text-sm text-white/80 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            {booking.vendorName}
          </p>
        </div>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="space-y-4 mb-6 flex-1">
          <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="font-medium">{format(bookingDate, "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <span className="font-medium">{booking.time}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="font-medium truncate">{booking.location}</span>
          </div>
          {booking.rating && (
            <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3 text-yellow-600">
                <Star className="h-4 w-4 fill-current" />
              </div>
              <span className="font-medium">{booking.rating}/5 Rating</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t mt-auto">
          <p className="font-bold text-xl text-primary">
            {booking.price
              ? `₹${booking.price.toLocaleString()}`
              : "Price not available"}
          </p>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-primary/10 hover:text-primary">
              <Link href={`/services/${booking.id}`}>
                Details
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/services/${booking.id}`}>View Details</Link>
                </DropdownMenuItem>
                {booking.status === "upcoming" && (
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={() => onCancel(booking.id)}
                  >
                    Cancel Booking
                  </DropdownMenuItem>
                )}
                {booking.status === "completed" && !booking.hasReview && (
                  <DropdownMenuItem onClick={() => onReview(booking.id)} className="cursor-pointer">
                    Leave Review
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

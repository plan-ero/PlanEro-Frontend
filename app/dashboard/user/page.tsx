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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Link from "next/link";

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
              imageUrl: "/placeholder.jpg",
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
              imageUrl: "/placeholder.jpg",
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
              imageUrl: "/placeholder.jpg",
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
    // In a real implementation, this would navigate to a review form
    toast({
      title: "Coming Soon",
      description: "Review feature is coming soon!",
    });
  };

  const cancelBooking = (bookingId: string) => {
    // In a real implementation, this would call an API to cancel the booking
    toast({
      title: "Coming Soon",
      description: "Cancellation feature is coming soon!",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        View and manage your services and bookings
      </p>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onReview={leaveReview}
                  onCancel={cancelBooking}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  You don't have any bookings yet.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/services">Browse Services</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.filter((b) => b.status === "upcoming").length > 0 ? (
              bookings
                .filter((b) => b.status === "upcoming")
                .map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onReview={leaveReview}
                    onCancel={cancelBooking}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  You don't have any upcoming bookings.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/services">Browse Services</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.filter((b) => b.status === "completed").length > 0 ? (
              bookings
                .filter((b) => b.status === "completed")
                .map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onReview={leaveReview}
                    onCancel={cancelBooking}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  You don't have any completed bookings yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
            <CardDescription>All time booking count</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>Services to look forward to</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {bookings.filter((b) => b.status === "upcoming").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>Services you've enjoyed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
            <CardDescription>Your investment in services</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              $
              {bookings
                .reduce((sum, booking) => sum + booking.price, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
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
  // Parse date for formatting
  const bookingDate = new Date(booking.date);

  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted relative">
        <img
          src={booking.imageUrl}
          alt={booking.serviceName}
          className="w-full h-full object-cover"
        />
        <Badge
          className={`absolute top-2 right-2 ${
            booking.status === "completed"
              ? "bg-green-500"
              : booking.status === "upcoming"
                ? "bg-blue-500"
                : "bg-red-500"
          }`}
        >
          {booking.status === "completed"
            ? "Completed"
            : booking.status === "upcoming"
              ? "Upcoming"
              : "Cancelled"}
        </Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-1">{booking.serviceName}</h3>
        <p className="text-muted-foreground mb-4">
          Provided by {booking.vendorName}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{format(bookingDate, "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{booking.location}</span>
          </div>
          {booking.rating && (
            <div className="flex items-center text-sm">
              <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{booking.rating}/5 Rating</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="font-bold">${booking.price.toLocaleString()}</p>

          {booking.status === "upcoming" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(booking.id)}
            >
              Cancel
            </Button>
          ) : booking.status === "completed" && !booking.hasReview ? (
            <Button size="sm" onClick={() => onReview(booking.id)}>
              Leave Review
            </Button>
          ) : booking.status === "completed" ? (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="mr-1 h-4 w-4" />
              <span>Reviewed</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

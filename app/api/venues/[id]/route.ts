import { NextResponse } from "next/server";

// Mock venue data - replace with actual database queries
const venues = {
  "1": {
    id: "1",
    name: "Elegant Garden Venue",
    location: "Beverly Hills, CA",
    address: "123 Garden Lane, Beverly Hills, CA 90210",
    price: 5000,
    images: [
      "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
      "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
      "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
      "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
    ],
    category: "Wedding Venues",
    capacity: 150,
    description:
      "Beautiful outdoor garden venue perfect for intimate weddings and special celebrations.",
    longDescription:
      "Nestled in the heart of Beverly Hills, our Elegant Garden Venue offers a magical setting for your most important celebrations. With meticulously maintained gardens, charming gazebos, and elegant outdoor spaces, we provide the perfect canvas for creating unforgettable memories.",
    rating: 4.8,
    reviews: 124,
    amenities: [
      { name: "Outdoor ceremony space", icon: "Camera" },
      { name: "Bridal suite", icon: "Users" },
      { name: "Catering kitchen", icon: "Utensils" },
      { name: "Parking for 100 cars", icon: "Car" },
      { name: "WiFi throughout", icon: "Wifi" },
      { name: "Sound system", icon: "Users" },
    ],
    features: [
      "Climate-controlled bridal suite",
      "Professional lighting system",
      "Backup power generator",
      "Wheelchair accessible",
      "Pet-friendly ceremony space",
      "On-site coordinator included",
    ],
    policies: [
      "Booking requires 50% deposit",
      "Cancellation policy: 30 days notice",
      "Setup begins 4 hours before event",
      "Music must end by 10 PM",
      "No smoking on premises",
      "Alcohol service requires licensed bartender",
    ],
    availability: {
      "2024-02-15": true,
      "2024-02-16": false,
      "2024-02-17": true,
      "2024-02-18": true,
    },
    contact: {
      phone: "(555) 123-4567",
      email: "info@elegantgarden.com",
      website: "www.elegantgarden.com",
    },
  },
  "2": {
    id: "2",
    name: "Modern Rooftop Space",
    location: "Manhattan, NY",
    address: "456 Sky Tower, Manhattan, NY 10001",
    price: 8000,
    images: [
      "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
      "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
      "https://us.123rf.com/450wm/machthay/machthay2407/machthay240700279/231406089-wedding-ceremony-decoration-with-flowers-and-garlands-thailand.jpg?ver=6",
    ],
    category: "Corporate Events",
    capacity: 200,
    description:
      "Stunning rooftop venue with panoramic city views, perfect for corporate events and upscale celebrations.",
    longDescription:
      "Experience the ultimate in urban sophistication at our Modern Rooftop Space. Located in the heart of Manhattan, this contemporary venue offers breathtaking 360-degree views of the city skyline.",
    rating: 4.9,
    reviews: 89,
    amenities: [
      { name: "360-degree city views", icon: "Camera" },
      { name: "Climate controlled", icon: "Users" },
      { name: "AV equipment included", icon: "Users" },
      { name: "Full bar service", icon: "Utensils" },
      { name: "Valet parking", icon: "Car" },
      { name: "High-speed WiFi", icon: "Wifi" },
    ],
    features: [
      "Floor-to-ceiling windows",
      "Professional sound system",
      "LED lighting system",
      "Outdoor terrace access",
      "Executive lounge",
      "Dedicated event coordinator",
    ],
    policies: [
      "Booking requires 60% deposit",
      "Cancellation policy: 45 days notice",
      "Setup begins 6 hours before event",
      "Events must end by 11 PM",
      "Security deposit required",
      "Professional catering required",
    ],
    availability: {
      "2024-02-15": true,
      "2024-02-16": true,
      "2024-02-17": false,
      "2024-02-18": true,
    },
    contact: {
      phone: "(555) 987-6543",
      email: "events@modernrooftop.com",
      website: "www.modernrooftop.com",
    },
  },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const venue = venues[id as keyof typeof venues];

  if (!venue) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  return NextResponse.json(venue);
}

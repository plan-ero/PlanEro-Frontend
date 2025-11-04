import { NextRequest, NextResponse } from "next/server";

// Map frontend category values to backend EventType enum values
const categoryToEventTypeMap: Record<string, string> = {
  wedding: "WEDDING",
  "anniversary-engagement": "ANNIVERSARY", // Map to closest match
  engagement: "ENGAGEMENT",
  corporate: "CORPORATE",
  "college-fests": "CONFERENCE", // Map to closest match
  "house-private-party": "HOLIDAY_PARTY", // Map to closest match
  farewell: "GRADUATION", // Map to closest match
  reunion: "CONFERENCE", // Map to closest match
  "baby-shower": "BABY_SHOWER",
  birthday: "BIRTHDAY",
  conference: "CONFERENCE",
  exhibition: "EXHIBITION",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const eventType = searchParams.get("eventType");

    // Build query parameters for backend
    const params = new URLSearchParams();
    params.append("serviceType", "VENUE");

    // Only add eventType if it exists and is valid
    if (eventType && eventType.trim() !== "") {
      // Try to map the category to a valid EventType
      const mappedEventType =
        categoryToEventTypeMap[eventType.toLowerCase()] ||
        eventType.toUpperCase();

      // Only add if it's a known mapping (skip invalid ones)
      if (
        categoryToEventTypeMap[eventType.toLowerCase()] ||
        [
          "WEDDING",
          "BIRTHDAY",
          "ANNIVERSARY",
          "CORPORATE",
          "ENGAGEMENT",
          "BABY_SHOWER",
          "GRADUATION",
          "HOLIDAY_PARTY",
          "CONFERENCE",
          "EXHIBITION",
        ].includes(mappedEventType)
      ) {
        params.append("eventType", mappedEventType);
      } else {
        console.log(`Skipping unknown eventType: ${eventType}`);
      }
    }

    const backendUrl = `${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/services/public?${params.toString()}`;
    console.log("Fetching venues from backend:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Backend response error:",
        response.status,
        response.statusText,
        errorText,
      );

      // If it's a validation error (500 with enum issue), return empty array instead of error
      if (response.status === 500 && errorText.includes("EventType")) {
        console.log("Invalid EventType, returning empty array");
        return NextResponse.json([]);
      }

      return NextResponse.json(
        { error: "Failed to fetch venues from backend" },
        { status: response.status },
      );
    }

    let venues = await response.json();
    console.log(`Successfully fetched ${venues.length} venues from backend`);

    // Apply frontend filtering for backward compatibility
    if (category && category !== "all") {
      venues = venues.filter(
        (venue: any) =>
          venue.eventType?.toLowerCase().includes(category.toLowerCase()) ||
          venue.serviceType?.toLowerCase().includes(category.toLowerCase()),
      );
    }

    if (search) {
      venues = venues.filter(
        (venue: any) =>
          venue.name?.toLowerCase().includes(search.toLowerCase()) ||
          venue.description?.toLowerCase().includes(search.toLowerCase()) ||
          venue.metadata?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Sort venues
    if (sortBy) {
      switch (sortBy) {
        case "price-low":
          venues.sort((a: any, b: any) => (a.cost || 0) - (b.cost || 0));
          break;
        case "price-high":
          venues.sort((a: any, b: any) => (b.cost || 0) - (a.cost || 0));
          break;
        case "rating":
          venues.sort(
            (a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0),
          );
          break;
        default:
          venues.sort((a: any, b: any) =>
            (a.name || "").localeCompare(b.name || ""),
          );
      }
    }

    return NextResponse.json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching venues" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  // TODO: Implement venue creation
  const body = await request.json();

  // Mock response
  const newVenue = {
    id: Date.now().toString(),
    ...body,
    rating: 0,
    reviews: 0,
    images: [],
  };

  return NextResponse.json(newVenue, { status: 201 });
}

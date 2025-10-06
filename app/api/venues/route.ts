import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const eventType = searchParams.get('eventType');

    // Build query parameters for backend
    const params = new URLSearchParams();
    params.append('serviceType', 'VENUE');
    if (eventType) params.append('eventType', eventType);

    const response = await fetch(
      `${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/services/public?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error('Backend response error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch venues from backend' },
        { status: response.status }
      );
    }

    let venues = await response.json();

    // Apply frontend filtering for backward compatibility
    if (category && category !== "all") {
      venues = venues.filter((venue: any) =>
        venue.eventType?.toLowerCase().includes(category.toLowerCase()) ||
        venue.serviceType?.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search) {
      venues = venues.filter((venue: any) =>
        venue.name?.toLowerCase().includes(search.toLowerCase()) ||
        venue.description?.toLowerCase().includes(search.toLowerCase()) ||
        venue.metadata?.toLowerCase().includes(search.toLowerCase())
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
          venues.sort((a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0));
          break;
        default:
          venues.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
      }
    }

    return NextResponse.json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching venues' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // TODO: Implement venue creation
  const body = await request.json()

  // Mock response
  const newVenue = {
    id: Date.now().toString(),
    ...body,
    rating: 0,
    reviews: 0,
    images: [],
  }

  return NextResponse.json(newVenue, { status: 201 })
}

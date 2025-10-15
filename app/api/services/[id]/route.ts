import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

// GET /api/services/[id] - Get a specific service by ID (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id);

    if (isNaN(serviceId)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 },
      );
    }

    // Call backend to get service details
    const response = await fetch(`${BACKEND_URL}/services/${serviceId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Service not found" },
          { status: 404 },
        );
      }
      console.error(
        `Backend error (${response.status}): Failed to fetch service ${serviceId}`,
      );
      return NextResponse.json(
        { error: "Failed to fetch service" },
        { status: response.status },
      );
    }

    const service = await response.json();
    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/services/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

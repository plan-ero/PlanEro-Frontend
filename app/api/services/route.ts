import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

// GET /api/services - Get all services (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendorId");

    // If vendorId is provided, get services for that vendor
    if (vendorId) {
      const response = await fetch(
        `${BACKEND_URL}/services?vendorId=${vendorId}`,
      );

      if (!response.ok) {
        console.error(
          `Backend error (${response.status}): Failed to fetch services for vendor ${vendorId}`,
        );
        return NextResponse.json([], { status: 200 }); // Return empty array instead of error
      }

      const services = await response.json();
      return NextResponse.json(services, { status: 200 });
    }

    // Otherwise, we need to get all vendors first, then fetch services for each
    try {
      const vendorsResponse = await fetch(`${BACKEND_URL}/vendors`);

      if (!vendorsResponse.ok) {
        console.error(`Failed to fetch vendors: ${vendorsResponse.status}`);
        return NextResponse.json([], { status: 200 });
      }

      const vendors = await vendorsResponse.json();
      const allServices = [];

      // Fetch services for each vendor
      for (const vendor of vendors) {
        try {
          const servicesResponse = await fetch(
            `${BACKEND_URL}/services?vendorId=${vendor.id}`,
          );
          if (servicesResponse.ok) {
            const vendorServices = await servicesResponse.json();
            if (Array.isArray(vendorServices)) {
              allServices.push(...vendorServices);
            }
          }
        } catch (err) {
          console.error(
            `Error fetching services for vendor ${vendor.id}:`,
            err,
          );
          // Continue with other vendors
        }
      }

      return NextResponse.json(allServices, { status: 200 });
    } catch (error) {
      console.error("Error fetching all services:", error);
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error("Error in GET /api/services:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

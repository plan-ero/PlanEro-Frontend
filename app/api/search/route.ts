import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("search") || "";
    const type = searchParams.get("type") || "all"; // all, venue, vendor, service
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const sortBy = searchParams.get("sortBy");

    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    let results: any[] = [];

    // Fetch services (venues) if type is 'all', 'venue', or 'service'
    if (type === "all" || type === "venue" || type === "service") {
      try {
        const servicesParams = new URLSearchParams();
        if (query) servicesParams.append("search", query);

        const servicesResponse = await fetch(
          `${backendUrl}/services/public?${servicesParams.toString()}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          }
        );

        if (servicesResponse.ok) {
          const services = await servicesResponse.json();
          // Map services to search result format
          const mappedServices = services.map((service: any) => ({
            id: service.id?.toString(),
            type: service.serviceType === "VENUE" ? "venue" : "service",
            name: service.name,
            category: service.eventType?.toLowerCase() || service.serviceType?.toLowerCase(),
            location: service.metadata ?
              ((() => {
                try {
                  return JSON.parse(service.metadata)?.location || "Location not specified";
                } catch {
                  return service.metadata || "Location not specified";
                }
              })()) : "Location not specified",
            price: service.cost || 0,
            image: service.images?.[0] || "/placeholder.svg",
            description: service.metadata || service.name,
            rating: service.totalRating || 0,
            reviews: service.numberOfRatings || 0,
            verified: true,
            availability: service.availability ? "Available" : "Unavailable",
            serviceType: service.serviceType,
            eventType: service.eventType,
          }));
          results.push(...mappedServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    }

    // Fetch vendors if type is 'all' or 'vendor'
    if (type === "all" || type === "vendor") {
      try {
        const vendorsParams = new URLSearchParams();
        if (query) vendorsParams.append("search", query);

        const vendorsResponse = await fetch(
          `${backendUrl}/vendors/public?${vendorsParams.toString()}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          }
        );

        if (vendorsResponse.ok) {
          const vendors = await vendorsResponse.json();
          // Map vendors to search result format
          const mappedVendors = vendors.map((vendor: any) => ({
            id: vendor.id?.toString(),
            type: "vendor",
            name: vendor.businessName || vendor.email,
            category: "vendor",
            location: vendor.location || "Location not specified",
            price: 0, // Vendors don't have a single price
            image: vendor.profilePictureUrl || "/placeholder-user.jpg",
            description: vendor.businessName || vendor.email,
            rating: 0, // TODO: Add vendor ratings when available
            reviews: 0,
            verified: vendor.approved === true,
            availability: vendor.approved ? "Available" : "Pending Approval",
          }));
          results.push(...mappedVendors);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    }

    // Apply frontend filters
    if (category && category !== "all") {
      results = results.filter((result) =>
        result.category?.toLowerCase().includes(category.toLowerCase()) ||
        result.serviceType?.toLowerCase().includes(category.toLowerCase()) ||
        result.eventType?.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (location) {
      results = results.filter((result) =>
        result.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Sort results
    if (sortBy) {
      switch (sortBy) {
        case "price-low":
          results.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case "price-high":
          results.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case "rating":
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "reviews":
          results.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
          break;
        default:
          // Default to relevance/name
          results.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      }
    }

    console.log(`Search returned ${results.length} results for query: "${query}", type: ${type}`);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      { error: "Internal server error while searching" },
      { status: 500 }
    );
  }
}

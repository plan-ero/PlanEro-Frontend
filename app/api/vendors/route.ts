import { NextRequest, NextResponse } from "next/server";
import { vendorApi, TokenManager, ApiError } from "@/lib/api";

// POST /vendors - Create vendor
export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || TokenManager.getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      businessName,
      location,
      bio,
      websiteUrl,
      profilePictureUrl,
      phoneNumber,
      addressId,
      email,
    } = body;

    if (!businessName || !location || !email) {
      return NextResponse.json(
        { error: "Missing required fields: businessName, location, email" },
        { status: 400 },
      );
    }

    try {
      // Create vendor through external API
      const vendorData = {
        businessName,
        location,
        bio: bio || "",
        websiteUrl: websiteUrl ? [websiteUrl] : [],
        profilePictureUrl: profilePictureUrl || "",
        email,
        phoneNumber: phoneNumber || "",
        addressId: addressId || 0,
        approved: false,
        published: false,
      };

      const vendor = await vendorApi.createVendor(vendorData, token);

      return NextResponse.json(vendor, { status: 201 });
    } catch (apiError) {
      console.error("External API error:", apiError);
      if (apiError instanceof ApiError) {
        return NextResponse.json(
          { error: apiError.message },
          { status: apiError.status },
        );
      }

      return NextResponse.json(
        { error: "Failed to create vendor" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET /vendors - Search vendors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pgNo = parseInt(searchParams.get("pgNo") || "1");
    const pgSize = parseInt(searchParams.get("pgSize") || "12");
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const showAll = searchParams.get("showAll") === "true";

    console.log("API Request params:", {
      pgNo,
      pgSize,
      search,
      location,
      showAll,
    });

    try {
      // Fetch from external API
      const allVendors = await vendorApi.getAllVendors();
      console.log("All vendors from backend:", allVendors);
      console.log("Number of vendors:", allVendors?.length || 0);

      // Filter approved and published vendors (show all for now since none are approved/published)
      let filteredVendors = allVendors; // Temporarily show all vendors for testing
      console.log(
        "Filtered vendors (showing all for testing):",
        filteredVendors,
      );
      console.log("Number of filtered vendors:", filteredVendors.length);

      // Apply search filter
      if (search && search.trim()) {
        const searchLower = search.toLowerCase().trim();
        filteredVendors = filteredVendors.filter((vendor) => {
          const businessName = (vendor.businessName || "").toLowerCase();
          const bio = (vendor.bio || "").toLowerCase();
          const vendorLocation = (vendor.location || "").toLowerCase();
          const matches =
            businessName.includes(searchLower) ||
            bio.includes(searchLower) ||
            vendorLocation.includes(searchLower);
          console.log(
            `Search filter for vendor ${vendor.id}: "${searchLower}" in "${businessName}" or "${bio}" or "${vendorLocation}" = ${matches}`,
          );
          return matches;
        });
        console.log("After search filter:", filteredVendors.length);
      }

      // Apply location filter
      if (location && location !== "all" && location.trim()) {
        const locationLower = location.toLowerCase().trim();
        filteredVendors = filteredVendors.filter((vendor) => {
          const vendorLocation = (vendor.location || "").toLowerCase();
          const matches = vendorLocation.includes(locationLower);
          console.log(
            `Location filter for vendor ${vendor.id}: "${locationLower}" in "${vendorLocation}" = ${matches}`,
          );
          return matches;
        });
        console.log("After location filter:", filteredVendors.length);
      }

      // Apply pagination
      const skip = (pgNo - 1) * pgSize;
      const paginatedVendors = filteredVendors.slice(skip, skip + pgSize);
      console.log("Final paginated vendors:", paginatedVendors.length);

      const response = {
        vendors: paginatedVendors,
        pagination: {
          page: pgNo,
          size: pgSize,
          total: filteredVendors.length,
          pages: Math.ceil(filteredVendors.length / pgSize),
        },
      };

      console.log("API Response:", response);
      return NextResponse.json(response);
    } catch (apiError) {
      console.error("External API error:", apiError);

      // Return empty result if API is down
      return NextResponse.json({
        vendors: [],
        pagination: {
          page: pgNo,
          size: pgSize,
          total: 0,
          pages: 0,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

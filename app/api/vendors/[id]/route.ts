import { NextRequest, NextResponse } from "next/server"
import { vendorApi, TokenManager, ApiError } from "@/lib/api"

// GET /api/vendors/[id] - Get vendor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendorId = parseInt(params.id)

    if (isNaN(vendorId)) {
      return NextResponse.json(
        { error: "Invalid vendor ID" },
        { status: 400 }
      )
    }

    try {
      // Fetch vendor from external API
      const vendor = await vendorApi.getVendorById(vendorId)

      // Check if vendor is approved and published
      if (!vendor.approved || !vendor.published) {
        return NextResponse.json(
          { error: "Vendor not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(vendor)

    } catch (apiError) {
      console.error("External API error:", apiError)

      // If vendor not found in external API, return 404
      if (apiError instanceof ApiError && apiError.status === 404) {
        return NextResponse.json(
          { error: "Vendor not found" },
          { status: 404 }
        )
      }

      // For other API errors, return a generic error
      return NextResponse.json(
        { error: "Failed to fetch vendor" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Error fetching vendor:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

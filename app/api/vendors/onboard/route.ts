import { NextRequest, NextResponse } from "next/server"
import { TokenManager } from "@/lib/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

// POST /api/vendors/onboard - Create vendor profile during onboarding
export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || TokenManager.getToken()
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log("Onboard request body:", body) // Debug log
    const { businessName, location, bio, websiteUrl, profilePictureUrl, phoneNumber, addressId, email } = body

    // Get email from session if not provided in body
    const sessionEmail = request.headers.get('x-user-email') // We'll add this from frontend
    const userEmail = email || sessionEmail

    if (!businessName || !location) {
      console.log("Missing required fields:", { businessName, location, userEmail })
      return NextResponse.json(
        { error: "Missing required fields: businessName, location" },
        { status: 400 }
      )
    }

    try {
      // Create vendor through direct backend API call instead of using vendorApi
      const vendorData = {
        businessName,
        location,
        bio: bio || "",
        websiteUrl: websiteUrl ? [websiteUrl] : [],
        profilePictureUrl: profilePictureUrl || "",
        email: userEmail || "default@example.com", // Use extracted email
        phoneNumber: phoneNumber || "",
        addressId: addressId || 0,
        approved: false,
        published: false,
      }
      
      console.log("Creating vendor with data:", vendorData) // Debug log
      
      // Make direct POST request to backend vendors endpoint
      const backendResponse = await fetch(`${API_BASE_URL}/vendors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      })

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text()
        console.error("Backend error:", errorText)
        return NextResponse.json(
          { error: "Failed to create vendor profile", details: errorText },
          { status: backendResponse.status }
        )
      }

      const vendor = await backendResponse.json()
      return NextResponse.json(vendor, { status: 201 })
      
    } catch (apiError) {
      console.error("External API error during onboarding:", apiError)
      return NextResponse.json(
        {
          error: "Failed to create vendor profile",
          details: apiError instanceof Error ? apiError.message : "Unknown error",
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in /api/vendors/onboard:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

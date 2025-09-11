import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

// GET /api/vendors/services - Get all services for the logged in vendor
export async function GET(request: NextRequest) {
  try {
    // Get the token from NextAuth JWT
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token?.apiToken) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Get vendorId from query params (forwarded from frontend)
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    if (!vendorId) {
      return NextResponse.json({ error: "Missing vendorId" }, { status: 400 })
    }

    // Call backend
    const backendRes = await fetch(`${API_BASE_URL}/services?vendorId=${vendorId}`, {
      headers: {
        'Authorization': `Bearer ${token.apiToken}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!backendRes.ok) {
      const errorData = await backendRes.text().catch(() => 'Unknown error');
      console.error(`Backend error (${backendRes.status}):`, errorData);
      return NextResponse.json(
        { error: "Failed to fetch services" },
        { status: backendRes.status }
      );
    }
    
    const data = await backendRes.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error in GET /api/vendors/services:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/vendors/services - Create a new service for the logged in vendor
export async function POST(request: NextRequest) {
  try {
    // Get the token from NextAuth JWT
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token?.apiToken) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const serviceData = await request.json()

    // Call backend
    const backendRes = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    })
    
    if (!backendRes.ok) {
      const errorData = await backendRes.text().catch(() => 'Unknown error');
      console.error(`Backend error (${backendRes.status}):`, errorData);
      return NextResponse.json(
        { error: "Failed to create service" },
        { status: backendRes.status }
      );
    }
    
    const data = await backendRes.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/vendors/services:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

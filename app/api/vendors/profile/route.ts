import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

// GET /api/vendors/profile - Get current vendor profile
export async function GET(request: NextRequest) {
  try {
    // Get the token from NextAuth JWT
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!token?.apiToken || !token?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Get vendor profile by email from backend
    const backendResponse = await fetch(`${BACKEND_URL}/vendors/email/${encodeURIComponent(token.id)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text().catch(() => 'Unknown error');
      console.error(`Backend error (${backendResponse.status}):`, errorData);

      if (backendResponse.status === 404) {
        return NextResponse.json(
          { error: "Vendor profile not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch vendor profile" },
        { status: backendResponse.status }
      );
    }

    const vendor = await backendResponse.json();
    return NextResponse.json(vendor, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/vendors/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/vendors/profile - Update vendor profile
export async function PUT(request: NextRequest) {
  try {
    // Get the token from NextAuth JWT
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!token?.apiToken || !token?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // First get the current vendor profile to get the vendor ID
    const getResponse = await fetch(`${BACKEND_URL}/vendors/email/${encodeURIComponent(token.id)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!getResponse.ok) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    const existingVendor = await getResponse.json();

    // Update vendor profile through backend
    const updateResponse = await fetch(`${BACKEND_URL}/vendors/${existingVendor.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.text().catch(() => 'Unknown error');
      console.error(`Backend error (${updateResponse.status}):`, errorData);
      return NextResponse.json(
        { error: "Failed to update vendor profile" },
        { status: updateResponse.status }
      );
    }

    const updatedVendor = await updateResponse.json();
    return NextResponse.json(updatedVendor, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/vendors/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

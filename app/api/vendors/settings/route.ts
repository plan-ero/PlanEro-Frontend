import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

// PUT /api/vendors/settings - Update vendor settings
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
      const errorData = await getResponse.text().catch(() => 'Unknown error');
      console.error(`Failed to get existing vendor (${getResponse.status}):`, errorData);
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    // Safely parse JSON response for existing vendor
    const getResponseText = await getResponse.text();
    if (!getResponseText.trim()) {
      console.error('Empty response when fetching existing vendor');
      return NextResponse.json(
        { error: "Empty response from server" },
        { status: 500 }
      );
    }

    const existingVendor = JSON.parse(getResponseText);

    // Update only the settings we care about
    const settingsData = {
      isPublished: body.isPublished,
      // Add other settings as needed
    };

    // Update vendor settings through backend
    const updateResponse = await fetch(`${BACKEND_URL}/vendors/${existingVendor.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settingsData),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.text().catch(() => 'Unknown error');
      console.error(`Backend error (${updateResponse.status}):`, errorData);
      return NextResponse.json(
        { error: "Failed to update vendor settings" },
        { status: updateResponse.status }
      );
    }

    // Safely parse JSON response for updated vendor
    const updateResponseText = await updateResponse.text();
    if (!updateResponseText.trim()) {
      console.error('Empty response when updating vendor settings');
      return NextResponse.json(
        { error: "Empty response from server" },
        { status: 500 }
      );
    }

    const updatedVendor = JSON.parse(updateResponseText);
    return NextResponse.json(updatedVendor, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/vendors/settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

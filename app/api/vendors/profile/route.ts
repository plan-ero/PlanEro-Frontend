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

    if (!token?.apiToken || !token?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Get vendor profile by email from backend using the full email
    const backendResponse = await fetch(`${BACKEND_URL}/vendors/email/${encodeURIComponent(token.email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text().catch(() => 'Unknown error');
      console.error(`Backend error (${backendResponse.status}):`, errorData);

      // Try to parse error as JSON to get better error message
      let errorMessage = "Failed to fetch vendor profile";
      try {
        const parsedError = JSON.parse(errorData);
        errorMessage = parsedError.error || parsedError.message || errorMessage;
      } catch {
        // If not JSON, use the raw error text if it's meaningful
        if (errorData && errorData.length < 200) {
          errorMessage = errorData;
        }
      }

      if (backendResponse.status === 404) {
        return NextResponse.json(
          { error: errorMessage, needsCreation: true },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: backendResponse.status }
      );
    }

    // Safely parse JSON response
    const responseText = await backendResponse.text();
    if (!responseText.trim()) {
      console.error('Empty response from backend');
      return NextResponse.json(
        { error: "Empty response from server" },
        { status: 500 }
      );
    }

    const vendor = JSON.parse(responseText);
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
  const operationId = Math.random().toString(36).substring(7);
  console.log(`🔄 PUT operation ${operationId} started`);

  try {
    // Get the token from NextAuth JWT
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!token?.apiToken || !token?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log(`📝 PUT operation ${operationId} - updating vendor for email: ${token.email}`);

    // First get the current vendor profile to get the vendor ID
    const getResponse = await fetch(`${BACKEND_URL}/vendors/email/${encodeURIComponent(token.email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`📥 PUT operation ${operationId} - fetch existing vendor response: ${getResponse.status}`);

    if (!getResponse.ok) {
      const errorData = await getResponse.text().catch(() => 'Unknown error');
      console.error(`❌ PUT operation ${operationId} - Failed to get existing vendor (${getResponse.status}):`, errorData);

      // Try to parse error as JSON to get better error message
      let errorMessage = "Vendor profile not found";
      try {
        const parsedError = JSON.parse(errorData);
        errorMessage = parsedError.error || parsedError.message || errorMessage;
      } catch {
        // If not JSON, use the raw error text if it's meaningful
        if (errorData && errorData.length < 200) {
          errorMessage = errorData;
        }
      }

      return NextResponse.json(
        { error: `${errorMessage} (Operation: ${operationId})` },
        { status: 404 }
      );
    }

    // Safely parse JSON response for existing vendor
    const getResponseText = await getResponse.text();
    if (!getResponseText.trim()) {
      console.error(`❌ PUT operation ${operationId} - Empty response when fetching existing vendor`);
      return NextResponse.json(
        { error: "Empty response from server" },
        { status: 500 }
      );
    }

    const existingVendor = JSON.parse(getResponseText);
    console.log(`✅ PUT operation ${operationId} - Found existing vendor with ID: ${existingVendor.id}`);

    // Update vendor profile through backend
    const updateResponse = await fetch(`${BACKEND_URL}/vendors/${existingVendor.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`📥 PUT operation ${operationId} - Update response: ${updateResponse.status}`);

    if (!updateResponse.ok) {
      const errorData = await updateResponse.text().catch(() => 'Unknown error');
      console.error(`❌ PUT operation ${operationId} - Backend update error (${updateResponse.status}):`, errorData);

      // Try to parse as JSON for better error message
      let errorMessage = 'Failed to update vendor profile';
      try {
        const parsedError = JSON.parse(errorData);
        errorMessage = parsedError.error || parsedError.message || errorMessage;
      } catch {
        // If not JSON, use the raw error text if it's meaningful
        if (errorData && errorData.length < 200) {
          errorMessage = errorData;
        }
      }

      return NextResponse.json(
        { error: `${errorMessage} (Operation: ${operationId})` },
        { status: updateResponse.status }
      );
    }

    // Safely parse JSON response for updated vendor
    const updateResponseText = await updateResponse.text();
    if (!updateResponseText.trim()) {
      console.error(`❌ PUT operation ${operationId} - Empty response when updating vendor`);
      return NextResponse.json(
        { error: "Empty response from server" },
        { status: 500 }
      );
    }

    const updatedVendor = JSON.parse(updateResponseText);
    console.log(`✅ PUT operation ${operationId} - Successfully updated vendor`);
    return NextResponse.json(updatedVendor, { status: 200 });
  } catch (error) {
    console.error(`❌ PUT operation ${operationId} - Error in PUT /api/vendors/profile:`, error);
    return NextResponse.json(
      { error: `Internal server error (Operation: ${operationId})` },
      { status: 500 }
    );
  }
}

// POST /api/vendors/profile - Create new vendor profile
export async function POST(request: NextRequest) {
  try {
    // Get the token from NextAuth JWT
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!token?.apiToken || !token?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Add the user's email to the vendor data
    const vendorData = {
      ...body,
      email: token.email // Use the full email address
    };

    // Create vendor profile through backend
    const createResponse = await fetch(`${BACKEND_URL}/vendors`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.text().catch(() => 'Unknown error');
      console.error(`Backend error (${createResponse.status}):`, errorData);

      // Try to parse as JSON for better error message
      let errorMessage = 'Failed to create vendor profile';
      try {
        const parsedError = JSON.parse(errorData);
        errorMessage = parsedError.error || parsedError.message || errorMessage;
      } catch {
        // If not JSON, use the raw error text if it's meaningful
        if (errorData && errorData.length < 200) {
          errorMessage = errorData;
        }
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: createResponse.status }
      );
    }

    // Safely parse JSON response for created vendor
    const createResponseText = await createResponse.text();
    if (!createResponseText.trim()) {
      console.error('Empty response when creating vendor');
      return NextResponse.json(
        { error: "Empty response from server" },
        { status: 500 }
      );
    }

    const newVendor = JSON.parse(createResponseText);
    return NextResponse.json(newVendor, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/vendors/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

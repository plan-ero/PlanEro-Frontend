import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

// GET /api/vendors/services/:id - Get a specific service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const serviceId = params.id;

    // Make request to backend
    const backendResponse = await fetch(`${BACKEND_URL}/services/${serviceId}`, {
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
          { error: "Service not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to fetch service" },
        { status: backendResponse.status }
      );
    }

    const service = await backendResponse.json();
    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error(`Error in GET /api/vendors/services/${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/vendors/services/:id - Update a specific service by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const serviceId = params.id;
    const serviceData = await request.json();

    // Make request to backend
    const backendResponse = await fetch(`${BACKEND_URL}/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text().catch(() => 'Unknown error');
      console.error(`Backend error (${backendResponse.status}):`, errorData);
      
      if (backendResponse.status === 404) {
        return NextResponse.json(
          { error: "Service not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to update service" },
        { status: backendResponse.status }
      );
    }

    const updatedService = await backendResponse.json();
    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error(`Error in PUT /api/vendors/services/${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/vendors/services/:id - Delete a specific service by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const serviceId = params.id;

    // Make request to backend
    const backendResponse = await fetch(`${BACKEND_URL}/services/${serviceId}`, {
      method: 'DELETE',
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
          { error: "Service not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to delete service" },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ message: "Service deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(`Error in DELETE /api/vendors/services/${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

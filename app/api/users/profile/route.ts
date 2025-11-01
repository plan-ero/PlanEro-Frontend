import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

// Mark this route as dynamic
// export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get the token from NextAuth JWT
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.apiToken) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 },
      );
    }

    // Get user profile from backend
    const backendResponse = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse
        .text()
        .catch(() => "Unknown error");
      console.error(`Backend error (${backendResponse.status}):`, errorData);
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: backendResponse.status },
      );
    }

    const profile = await backendResponse.json();

    return NextResponse.json(
      {
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        vendor: profile.vendor,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get the token from NextAuth JWT
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.apiToken) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Update user profile through backend
    const backendResponse = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse
        .text()
        .catch(() => "Unknown error");
      console.error(`Backend error (${backendResponse.status}):`, errorData);
      return NextResponse.json(
        { error: "Failed to update user profile" },
        { status: backendResponse.status },
      );
    }

    const updatedProfile = await backendResponse.json();
    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedProfile,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// POST /api/vendors/quick-onboarding - Atomic vendor onboarding
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call backend quick onboarding endpoint
    const backendRes = await fetch(`${API_BASE_URL}/vendors/quick-onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes
        .json()
        .catch(() => ({ error: "Unknown error" }));
      console.error(`Backend error (${backendRes.status}):`, errorData);
      return NextResponse.json(
        {
          error: errorData.error || errorData.message || "Onboarding failed",
        },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/vendors/quick-onboarding:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

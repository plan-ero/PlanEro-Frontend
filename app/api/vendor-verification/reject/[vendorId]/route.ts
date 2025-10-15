import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function POST(
  request: NextRequest,
  { params }: { params: { vendorId: string } },
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you might want to add proper role checking)
    if ((session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const vendorId = params.vendorId;
    const body = await request.json();
    const { reason } = body;

    const token = (session as any)?.apiToken;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/vendor-verification/reject-vendor/${vendorId}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ reason }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: data.error || "Failed to reject vendor" },
        { status: response.status },
      );
    }
  } catch (error) {
    console.error("Error rejecting vendor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

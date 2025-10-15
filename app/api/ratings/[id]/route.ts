import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Rating ID is required" },
        { status: 400 },
      );
    }

    const response = await fetch(`${BACKEND_URL}/ratings/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(session as any).apiToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Backend error:", errorData);
      return NextResponse.json(
        { error: "Failed to delete rating" },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

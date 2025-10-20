import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Allow unauthenticated uploads for quick onboarding
    // Backend will handle authorization if needed
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create new FormData for backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);
    backendFormData.append("folder", "service-images");

    const token = (session as any)?.apiToken;
    const headers: HeadersInit = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/cdn/upload-image`, {
      method: "POST",
      headers,
      body: backendFormData,
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = "Failed to upload service image";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `Upload failed with status ${response.status}`;
      }

      console.error("Backend upload error:", errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error uploading service image:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

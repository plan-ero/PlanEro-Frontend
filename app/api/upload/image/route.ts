import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  console.log("=== API Route /api/upload/image POST START ===");

  try {
    const session = await auth();

    if (!session) {
      console.log("ERROR: Unauthorized - no session");
      console.log(
        "=== API Route /api/upload/image POST END (UNAUTHORIZED) ===",
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "images";

    console.log("File name:", file?.name);
    console.log("File size:", file?.size);
    console.log("Folder:", folder);

    if (!file) {
      console.log("ERROR: No file provided");
      console.log("=== API Route /api/upload/image POST END (BAD REQUEST) ===");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create new FormData for backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);
    backendFormData.append("folder", folder);

    const token = (session as any)?.apiToken;
    const headers: HeadersInit = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const backendUrl = `${API_BASE_URL}/upload/image`;
    console.log("Forwarding to backend:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: backendFormData,
    });

    console.log("Backend response status:", response.status);

    const data = await response.json();
    console.log("Backend response data:", data);

    if (response.ok) {
      console.log("=== API Route /api/upload/image POST END (SUCCESS) ===");
      return NextResponse.json(data);
    } else {
      console.log("=== API Route /api/upload/image POST END (FAILED) ===");
      return NextResponse.json(
        { error: data.error || "Failed to upload image" },
        { status: response.status },
      );
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    console.log("=== API Route /api/upload/image POST END (EXCEPTION) ===");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  console.log("=== API Route /api/upload/image DELETE START ===");

  try {
    const session = await auth();

    if (!session) {
      console.log("ERROR: Unauthorized - no session");
      console.log(
        "=== API Route /api/upload/image DELETE END (UNAUTHORIZED) ===",
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url } = body;

    console.log("URL to delete:", url);

    if (!url) {
      console.log("ERROR: File URL is required");
      console.log(
        "=== API Route /api/upload/image DELETE END (BAD REQUEST) ===",
      );
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 },
      );
    }

    const token = (session as any)?.apiToken;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const backendUrl = `${API_BASE_URL}/upload/image?url=${encodeURIComponent(url)}`;
    console.log("Forwarding to backend:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "DELETE",
      headers,
    });

    console.log("Backend response status:", response.status);

    const data = await response.json();
    console.log("Backend response data:", data);

    if (response.ok) {
      console.log("=== API Route /api/upload/image DELETE END (SUCCESS) ===");
      return NextResponse.json(data);
    } else {
      console.log("=== API Route /api/upload/image DELETE END (FAILED) ===");
      return NextResponse.json(
        { error: data.error || "Failed to delete image" },
        { status: response.status },
      );
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    console.log("=== API Route /api/upload/image DELETE END (EXCEPTION) ===");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

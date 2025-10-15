import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'images'

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Create new FormData for backend
    const backendFormData = new FormData()
    backendFormData.append('file', file)
    backendFormData.append('folder', folder)

    const token = (session as any)?.apiToken
    const headers: HeadersInit = {}

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers,
      body: backendFormData,
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { error: data.error || "Failed to upload image" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      )
    }

    const token = (session as any)?.apiToken
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/upload/image?url=${encodeURIComponent(url)}`, {
      method: "DELETE",
      headers,
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { error: data.error || "Failed to delete image" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

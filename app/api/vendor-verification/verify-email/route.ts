import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contact, otp, channelType } = body

    if (!contact || !otp || !channelType) {
      return NextResponse.json(
        { error: "Contact, OTP, and channelType are required" },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/vendor-verification/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact, otp, channelType }),
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { error: data.error || "Email verification failed" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

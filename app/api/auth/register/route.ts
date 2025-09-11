import { NextRequest, NextResponse } from "next/server"
import { authApi, ApiError } from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    const { name, email, username, password, role } = await request.json()

    // Validate required fields
    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate role and map to backend API format
    const validRoles = ["USER", "VENDOR"]
    const userRole = role && validRoles.includes(role) ? role : "USER"

    try {
      // Register user with backend API
      const authResponse = await authApi.signup({
        username: username,
        email: email,
        password,
        role: userRole as "USER" | "VENDOR",
      })

      // Return success response with token
      return NextResponse.json({
        message: "User registered successfully",
        user: {
          email,
          name,
          username,
          role: userRole,
        },
        token: authResponse.token,
        username: authResponse.username,
      }, { status: 201 })

    } catch (apiError: unknown) {
      // Handle API errors (user already exists, validation errors, etc.)
      if (apiError instanceof ApiError) {
        // Check if the error response contains field-specific validation errors
        if (apiError.fieldErrors) {
          return NextResponse.json(
            { 
              error: "Validation failed",
              fieldErrors: apiError.fieldErrors 
            },
            { status: apiError.status }
          )
        }
        
        return NextResponse.json(
          { error: apiError.message },
          { status: apiError.status }
        )
      }
      
      return NextResponse.json(
        { error: "Registration failed" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

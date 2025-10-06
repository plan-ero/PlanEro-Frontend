import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../auth/[...nextauth]/route'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    const serviceId = searchParams.get('serviceId')
    const userId = searchParams.get('userId')

    let endpoint = '/ratings'
    if (vendorId) {
      endpoint = `/ratings/vendor/${vendorId}`
    } else if (serviceId) {
      endpoint = `/ratings/service/${serviceId}`
    } else if (userId) {
      endpoint = `/ratings/user/${userId}`
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ratings: ${response.statusText}`)
    }

    const ratings = await response.json()
    return NextResponse.json(ratings)
  } catch (error) {
    console.error('Error fetching ratings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { rating, review, serviceId, vendorId } = body

    // Validate input
    if (!rating || (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!serviceId && !vendorId) {
      return NextResponse.json(
        { error: 'Either serviceId or vendorId must be provided' },
        { status: 400 }
      )
    }

    const requestBody = {
      rating,
      review: review || '',
      serviceId: serviceId || null,
      vendorId: vendorId || null,
    }

    const response = await fetch(`${BACKEND_URL}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session as any).apiToken}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Failed to create rating: ${errorData}`)
    }

    const newRating = await response.json()
    return NextResponse.json(newRating)
  } catch (error) {
    console.error('Error creating rating:', error)
    return NextResponse.json(
      { error: 'Failed to create rating' },
      { status: 500 }
    )
  }
}

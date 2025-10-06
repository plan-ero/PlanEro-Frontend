import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields based on Inquiry entity
    const requiredFields = ['firstName', 'lastName', 'email', 'eventData', 'numberOfGuests', 'eventVision'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const response = await fetch(`${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session as any).apiToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend inquiry creation failed:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to create inquiry' },
        { status: response.status }
      );
    }

    const inquiry = await response.json();
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating inquiry' },
      { status: 500 }
    );
  }
}
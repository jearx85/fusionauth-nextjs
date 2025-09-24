import { NextRequest, NextResponse } from 'next/server';
import { fusionAuthClient } from '@/lib/fusionauth';

export async function POST(request: NextRequest) {
  try {
    const { userId, token } = await request.json();

    if (!userId || !token) {
      return NextResponse.json(
        { message: 'Missing credentials' },
        { status: 401 }
      );
    }

    const response = await fusionAuthClient.retrieveUser(userId);
    
    if (response.wasSuccessful() && response.response.user) {
      const user = response.response.user;
      
      return NextResponse.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl || null, // Avatar desde FusionAuth
          username: user.username || null,
        }
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid session' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 401 }
    );
  }
}
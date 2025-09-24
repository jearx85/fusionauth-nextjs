import { NextRequest, NextResponse } from 'next/server';
import { fusionAuthClient, applicationId } from '@/lib/fusionauth';

export async function POST(request: NextRequest) {
  try {
    const { token, userId } = await request.json();

    if (token && userId) {
      // Invalidar el token en FusionAuth
      const response = await fusionAuthClient.revokeRefreshToken(userId, token, applicationId);
      console.log('FusionAuth logout response:', response.statusCode);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logout completed' },
      { status: 200 }
    );
  }
}
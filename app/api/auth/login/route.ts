import { NextRequest, NextResponse } from 'next/server';
import { fusionAuthClient, applicationId } from '@/lib/fusionauth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const response = await fusionAuthClient.login({
      applicationId,
      loginId: email,
      password,
    });

    if (response.wasSuccessful() && response.response.user) {
      const user = response.response.user;
      return NextResponse.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl || null, // Campo para avatar
          username: user.username || null,
          // Otros campos disponibles en FusionAuth:
          // mobilePhone: user.mobilePhone,
          // birthDate: user.birthDate,
          // timezone: user.timezone,
        },
        token: response.response.token
      });
    } else {
      console.error('FusionAuth login failed:', response.exception);
      
      let errorMessage = 'Invalid credentials';
      if (response.statusCode === 401) {
        errorMessage = 'Invalid email or password';
      } else if (response.statusCode === 404) {
        errorMessage = 'User not found';
      }

      return NextResponse.json(
        { message: errorMessage },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
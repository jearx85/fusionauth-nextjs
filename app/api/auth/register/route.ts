import { NextRequest, NextResponse } from 'next/server';
import { fusionAuthClient, applicationId } from '@/lib/fusionauth';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Validar que tenemos todas las variables de entorno
    if (!process.env.FUSIONAUTH_API_KEY) {
      console.error('FUSIONAUTH_API_KEY is not set');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!applicationId) {
      console.error('FUSIONAUTH_APPLICATION_ID is not set');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('Attempting to register user with email:', email);
    console.log('Using application ID:', applicationId);

    const response = await fusionAuthClient.register(randomUUID(), {
      user: {
        email,
        password,
        firstName,
        lastName,
      },
      registration: {
        applicationId,
      },
    });

    console.log('FusionAuth response status:', response.statusCode);

    if (response.wasSuccessful()) {
      return NextResponse.json({ 
        success: true, 
        message: 'User registered successfully',
        user: {
          id: response.response.user?.id,
          email: response.response.user?.email
        }
      });
    } else {
      console.error('FusionAuth registration failed:', response.exception);
      
      // Manejar errores específicos
      let errorMessage = 'Registration failed';
      if (response.statusCode === 401) {
        errorMessage = 'API authentication failed';
      } else if (response.statusCode === 400) {
        const fieldErrors = (response.exception as any)?.fieldErrors;
        if (fieldErrors?.['user.email']) {
          errorMessage = 'Email already exists or is invalid';
        }
      }

      return NextResponse.json(
        { 
          message: errorMessage,
          details: response.exception
        },
        { status: response.statusCode || 400 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
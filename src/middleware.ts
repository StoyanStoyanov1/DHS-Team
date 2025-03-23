import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  // Check if path starts with /api
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Exclude auth route from check
  if (request.nextUrl.pathname === '/api/auth') {
    return NextResponse.next();
  }

  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    verify(token, process.env.JWT_SECRET_KEY || 'your-secret-key');

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
}; 
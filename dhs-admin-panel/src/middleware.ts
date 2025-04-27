/**
 * Middleware for handling requests and responses in the application.
 * ВАЖНО: Временно изключен за отстраняване на проблем с пренасочванията
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: []
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // Authentication is handled via backend cookies on a different domain.
  // Frontend middleware cannot reliably read that cookie in production.
  return NextResponse.next();
}

export const config = {
  matcher: ['/__disabled__/:path*'],
};

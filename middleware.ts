// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host'); // e.g., foo.tn43.com
  const subdomain = host?.split('.')[0];

  // You can rewrite or set cookies for subdomain-specific content
  const res = NextResponse.next();
  res.cookies.set('subdomain', subdomain || '');
  return res;
}

export const config = { matcher: ['/'] };

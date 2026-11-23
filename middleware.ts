import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and API routes bypass
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Public auth pages (signin, forget-password, reset-password)
  const isAuthPage = pathname.startsWith('/auth');
  const token = request.cookies.get('EcommerceJwt')?.value;

  // Unauthenticated user attempting to access private route -> redirect to signin
  if (!token && !isAuthPage) {
    const signinUrl = new URL('/auth/signin', request.url);
    signinUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Authenticated user attempting to access signin page -> redirect to dashboard
  if (token && isAuthPage && pathname === '/auth/signin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

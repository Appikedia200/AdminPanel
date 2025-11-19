import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Define auth pages
  const isAuthPage = pathname.startsWith('/login') || 
                    pathname.startsWith('/register') || 
                    pathname.startsWith('/forgot-password') ||
                    pathname.startsWith('/verify-email') ||
                    pathname.startsWith('/verification-sent')

  // Define public paths (no auth required)
  const isPublicPath = isAuthPage

  // Check if user is trying to access dashboard without token
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname) // Remember where user was trying to go
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
}


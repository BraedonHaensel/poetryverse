import { NextRequest, NextResponse } from 'next/server'

import { getAuthSession } from './lib/nextauth'
import { GUEST_ACCESSIBLE_PAGES } from './lib/utils'

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const session = await getAuthSession()

  // Check if the user is signed in
  if (session) {
    if (!session.user.username) {
      // Signed in without a username, redirect to the Login page
      return NextResponse.redirect(new URL('/', req.url))
    }

    // TODO require an admin user for the admin pages. Pseudocode:
    // if (pathname.startsWith('/admin') && <is_not_an_admin>) {
    //   // User must be an admin to access the admin pages
    //   return NextResponse.redirect(new URL('/', req.url))
    // }

    // Signed in, proceed to the page
    return NextResponse.next()
  }

  if (GUEST_ACCESSIBLE_PAGES.some((path) => path.startsWith(pathname))) {
    // Guest mode allowed, proceed to the page
    return NextResponse.next()
  }

  // Sign in required, redirect to the Login page
  return NextResponse.redirect(new URL('/', req.url))
}

export const config = {
  // Paths where the proxy applies
  matcher: [
    '/home/:path*',
    '/poem-of-the-day/:path*',
    '/create/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
}

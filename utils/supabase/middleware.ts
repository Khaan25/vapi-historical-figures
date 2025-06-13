import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/database.types'
import { createServerClient } from '@supabase/ssr'

const authRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/app', '/app/analytics', '/app/call', '/app/new', '/app/quizzes']
const publicRoutes = ['/', '/auth/callback', '/auth/reset-password']

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    })

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if the current route is a public route
    // const isPublicRoute = publicRoutes.includes(requisPublicRouteest.nextUrl.pathname)
    const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

    if (isPublicRoute) {
      return response
    }

    // Check if the current route is not a public route and user is not authenticated
    const isLoggedIn = !!user
    const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)

    if (!isAuthRoute && !isLoggedIn) {
      let callbackUrl = request.nextUrl.pathname
      if (request.nextUrl.search) {
        callbackUrl += request.nextUrl.search
      }

      const encodedCallbackUrl = encodeURIComponent(callbackUrl)

      return NextResponse.redirect(new URL(`/auth/sign-in?callbackUrl=${encodedCallbackUrl}`, request.url))
    }

    // If user is authenticated and trying to access a public route, redirect to a default protected route
    if (isAuthRoute && isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return response
  } catch (e) {
    console.error('Error in updateSession:', e)
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

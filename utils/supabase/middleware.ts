import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create an unmodified response by default
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Fetch the user from the secure HTTP-only cookie
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;
  
  // 1. Define all pages that unauthenticated users are allowed to see
  const isPublicRoute = path === '/' || path === '/login' || path.startsWith('/auth/callback') || path === '/codex' || path === '/pro';

  // 2. If NO user and trying to access a locked route -> Kick to login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 3. If YES user and they visit login or the public landing page -> Push to the Arena
  if (user && (path === '/login' || path === '/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/arena'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
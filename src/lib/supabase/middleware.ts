import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make your application
  // vulnerable to security issues.

  // Refresh user session with error handling
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If there's an auth error (like invalid refresh token), clear the session
    if (error) {
      // Only log actual errors, not missing session (which is normal for unauthenticated users)
      if (!error.message.includes('Auth session missing')) {
        console.error('Auth error in middleware:', error.message);
      }

      // Clear all auth cookies and continue (don't block)
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
          supabaseResponse.cookies.delete(cookie.name);
        }
      });

      // If on protected route, redirect to login
      const protectedPaths = ['/dashboard', '/transaksi', '/laporan', '/profile'];
      const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

      if (isProtectedPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }

      return supabaseResponse;
    }

    // Protected routes logic
    const protectedPaths = ['/dashboard', '/transaksi', '/laporan', '/profile'];
    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

    if (!user && isProtectedPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error('Unexpected error in middleware:', error);
    // Don't block on errors, just continue
  }

  return supabaseResponse;
}

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ENV, isSupabaseConfigured } from "@/lib/env";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Redirect legacy /categories/[slug] -> /shop/[slug] (301 Permanent Redirect)
  if (pathname.startsWith("/categories")) {
    const newPath = pathname.replace(/^\/categories/, "/shop");
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = newPath;
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  // 2. Redirect legacy query-param shop URLs -> clean canonical routes (301 Permanent Redirect)
  if (pathname === "/shop") {
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const brand = searchParams.get("brand");

    if (category || brand) {
      let cleanPath = "/shop";
      if (category) {
        cleanPath += `/${encodeURIComponent(category)}`;
        if (subcategory) {
          cleanPath += `/${encodeURIComponent(subcategory)}`;
          if (brand) cleanPath += `/${encodeURIComponent(brand)}`;
        } else if (brand) {
          cleanPath += `/all/${encodeURIComponent(brand)}`;
        }
      } else if (brand) {
        cleanPath = `/brands/${encodeURIComponent(brand)}`;
      }

      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = cleanPath;
      redirectUrl.searchParams.delete("category");
      redirectUrl.searchParams.delete("subcategory");
      redirectUrl.searchParams.delete("brand");

      return NextResponse.redirect(redirectUrl, { status: 301 });
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Skip auth check if Supabase is not configured yet (allow initial inspection/dev)
  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(
    ENV.SUPABASE_URL,
    ENV.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminDevCookie = request.cookies.get("cado_admin_dev_session");
  const isAuthenticated = Boolean(user || adminDevCookie?.value === "authenticated");

  const isAccessingAdmin = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  // If accessing protected admin route without user session, redirect to /admin/login
  if (isAccessingAdmin && !isLoginPage && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // If logged in and on login page, redirect to dashboard
  if (isLoginPage && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};

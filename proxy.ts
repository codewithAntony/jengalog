import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const path = request.nextUrl.pathname;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (path.startsWith("/auth") || path === "/dashboard") {
      return NextResponse.redirect(
        new URL("/dashboard/dashboard", request.url),
      );
    }
  } else {
    const isProtectedRoute = path.startsWith("/dashboard");

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return response;
}

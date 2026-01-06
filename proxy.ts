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
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const path = request.nextUrl.pathname;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "client";

    if (path.startsWith("/admin-dashboard") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (path === "/dashboard" && role === "admin") {
      return NextResponse.redirect(
        new URL("/admin-dashboard/overview", request.url)
      );
    }

    if (path.startsWith("/auth")) {
      const dest =
        role === "admin" ? "/admin-dashboard/overview" : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  } else {
    const isProtectedRoute =
      path.startsWith("/admin-dashboard") || path.startsWith("/dashboard");

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return response;
}

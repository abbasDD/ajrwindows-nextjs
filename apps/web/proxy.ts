import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./lib/supabase/server";

const protectedUserRoutes = ["/checkout", "/order-success", "/user-orders"];
const adminProtectedRoute = "/admin/dashboard";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminDashboard = pathname.startsWith(adminProtectedRoute);

  if (isAdminDashboard) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // check if user has admin role
    const userData = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (userData.data?.role !== "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Check user-protected routes
  const isUserProtectedRoute = protectedUserRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (isUserProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

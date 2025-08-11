import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin pages
    if (req.nextUrl.pathname.startsWith("/admin")) {
      // Redirect to login if user is not authenticated
      if (!req.nextauth.token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(loginUrl);
      }

      // Check if user has admin role
      if (req.nextauth.token?.role !== "ADMIN") {
        // Redirect to unauthorized page or home page
        const unauthorizedUrl = new URL("/unauthorized", req.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // For admin pages, require authentication and admin role
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token && token.role === "ADMIN";
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};

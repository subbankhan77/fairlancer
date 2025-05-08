// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth.token;
//     const path = req.nextUrl.pathname;

//     // Define role-based access
//     if (path.startsWith("/admin") && token?.role !== "admin") {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     if (path.startsWith("/dashboard")) {
//       if (!["admin", "client", "freelancer"].includes(token?.role)) {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token
//     },
//   }
// );

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|register).*)',
//     "/dashboard/:path*", 
//     "/admin/:path*"
//   ],
// };
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Custom middleware function that will be wrapped by withAuth
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Special case for reset-password - always allow access
    if (path === '/reset-password' || path.startsWith('/reset-password?')) {
      console.log('Reset password route detected, bypassing auth check');
      return NextResponse.next();
    }
    
    // Define role-based access
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    if (path.startsWith("/dashboard")) {
      if (!["admin", "client", "freelancer"].includes(token?.role)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow reset-password page to bypass authentication
        const path = req.nextUrl.pathname;
        if (path === '/reset-password' || path.startsWith('/reset-password?')) {
          return true;
        }
        
        // For all other routes, require a token
        return !!token;
      }
    },
    pages: {
      signIn: '/login',
    }
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|register).*)',
    "/dashboard/:path*",
    "/admin/:path*"
  ],
};
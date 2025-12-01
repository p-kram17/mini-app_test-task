import { auth } from "./auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // If not authenticated, redirect to login
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return Response.redirect(loginUrl);
  }

  const role = (req.auth.user as any)?.role;

  // Dashboard is admin-only
  if (pathname.startsWith("/dashboard")) {
    if (role !== "Admin") {
      return Response.redirect(new URL("/forms", req.url));
    }
  }

  // Forms admin-only pages: /forms/new
  if (pathname === "/forms/new") {
    if (role !== "Admin") {
      return Response.redirect(new URL("/forms", req.url));
    }
  }
});

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/forms", "/forms/:path*"],
};

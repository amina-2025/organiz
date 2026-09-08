// middleware.js

import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

// Pages nécessitant une connexion
const PROTECTED_PAGES = ["/dashboard", "/events", "/events/new"];
const PROTECTED_PREFIXES = ["/dashboard/", "/events/new/", "/events/"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const needsAuth =
    PROTECTED_PAGES.includes(pathname) ||
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get("session")?.value;
  const session = await verifySession(token);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/events", "/events/new", "/events/:path*/edit"],
};
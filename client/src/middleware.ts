import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest, ev: NextFetchEvent) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return new NextResponse("API_URL is not defined", { status: 500 });
  }

  const url = request.nextUrl.clone();

  // Match and redirect requests to `/api/gateway/:path*`
  if (url.pathname.startsWith("/api/gateway")) {
    const path = url.pathname.replace("/api/gateway", "");
    url.href = `${apiUrl}/gateway${path}${url.search}`;
    return NextResponse.rewrite(url);
  }

  // Delegate to Clerk Middleware for protected paths
  return clerkMiddleware({})(request, ev);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/web")) {
    console.log("Web middleware");
    console.log(request);
  }

  if (request.nextUrl.pathname.startsWith("/api/mobile")) {
    console.log("Mobile middleware");
    console.log(request);
  }

  //return NextResponse.redirect(new URL("/home", request.url));
}

export const config = {
  matcher: ["/api/web/:path*", "/api/mobile/:path*"],
};

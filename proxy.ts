import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/", "/signup", "/login", "/forgot-password", "/reset-password", "/verify-email"]
const authPagePaths = publicPaths.filter((p) => p !== "/" && p !== "/verify-email")

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("accessToken")?.value

  const isPublic = publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))
  const isAuthPage = authPagePaths.includes(pathname)

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}

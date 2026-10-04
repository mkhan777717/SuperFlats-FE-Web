import { NextResponse, type NextRequest } from "next/server";

const ACCESS_COOKIE = "sf_access";
const PROTECTED = ["/explore", "/listings", "/saved", "/visits", "/profile", "/owner"];
const GUEST_ONLY = ["/login", "/register"];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/**
 * Optimistic check only: send signed-out visitors to login, and signed-in users away
 * from the auth screens. The backend still validates the token on every request.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = request.cookies.has(ACCESS_COOKIE);

  if (!signedIn && matches(pathname, PROTECTED)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  if (signedIn && matches(pathname, GUEST_ONLY)) {
    return NextResponse.redirect(new URL("/explore", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|images|favicon.ico).*)"],
};

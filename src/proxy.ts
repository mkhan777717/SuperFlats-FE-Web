import { NextResponse, type NextRequest } from "next/server";

const ACCESS_COOKIE = "sf_access";
const ROLE_COOKIE = "sf_role";

const RENTER_AREA = ["/explore", "/listings", "/saved", "/visits", "/profile"];
const CONSOLE_AREA = ["/dashboard"];
const GUEST_ONLY = ["/login", "/register"];

const matches = (pathname: string, prefixes: string[]) => prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/**
 * Optimistic routing only: signed-out visitors go to login, signed-in users skip the auth
 * screens, and renters can't open the owner console. The backend still checks every request.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = request.cookies.has(ACCESS_COOKIE);
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  const home = role === "admin" || role === "agent" ? "/dashboard" : "/explore";

  if (!signedIn && (matches(pathname, RENTER_AREA) || matches(pathname, CONSOLE_AREA))) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  if (signedIn && matches(pathname, GUEST_ONLY)) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (signedIn && role === "client" && matches(pathname, CONSOLE_AREA)) {
    return NextResponse.redirect(new URL("/explore", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|images|favicon.ico).*)"],
};

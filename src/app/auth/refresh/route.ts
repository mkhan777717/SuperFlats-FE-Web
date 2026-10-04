import { NextResponse, type NextRequest } from "next/server";
import { API_URL } from "@/lib/config";
import { clearSession, getRefreshToken, safeNext, setSession } from "@/lib/session";

/**
 * Reached when the backend rejected the access token. Server Components can't write
 * cookies, so they redirect here: rotate the tokens and go back, or sign out.
 */
export async function GET(request: NextRequest) {
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (res.ok) {
      const tokens = await res.json();
      await setSession(tokens);
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  await clearSession();
  const login = new URL("/login", request.url);
  login.searchParams.set("next", next);
  login.searchParams.set("expired", "1");
  return NextResponse.redirect(login);
}

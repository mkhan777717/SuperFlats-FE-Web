import type { NextRequest } from "next/server";
import { API_URL } from "@/lib/config";
import { getAccessToken, getRefreshToken, setSession } from "@/lib/session";

/** Bodies above this size are streamed to the backend rather than buffered (photos stay below it). */
const STREAM_THRESHOLD = 20 * 1024 * 1024;

/**
 * Backend-for-frontend proxy: browser code calls `/api/sf/<backend path>` and this handler
 * forwards it to the Superflats API with the token from the httpOnly cookie.
 * Auth endpoints are excluded; those go through Server Actions.
 */
async function forward(request: NextRequest, ctx: RouteContext<"/api/sf/[...path]">) {
  const { path } = await ctx.params;
  if (path[0] === "auth" || path[0] === "subscription") {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const target = `${API_URL}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const contentType = request.headers.get("content-type");
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  // Large uploads (videos, up to 500 MB) are streamed straight to the backend instead of being
  // buffered in memory. A stream can only be sent once, so they skip the 401 retry below;
  // the video uploader refreshes the session with a small request first.
  const stream = hasBody && (contentLength > STREAM_THRESHOLD || !request.headers.has("content-length"));
  const body = !hasBody ? undefined : stream ? request.body : await request.arrayBuffer();

  const send = (token: string | null) =>
    fetch(target, {
      method: request.method,
      body,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(contentType ? { "Content-Type": contentType } : {}),
        ...(stream && contentLength ? { "Content-Length": String(contentLength) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      // Required by Node's fetch when the body is a stream.
      ...(stream ? { duplex: "half" } : {}),
    } as RequestInit);

  let res = await send(await getAccessToken());

  // Rotate tokens once on 401 and retry.
  if (res.status === 401 && !stream) {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      const refreshed = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });
      if (refreshed.ok) {
        const tokens = await refreshed.json();
        await setSession(tokens);
        res = await send(tokens.accessToken);
      }
    }
  }

  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };

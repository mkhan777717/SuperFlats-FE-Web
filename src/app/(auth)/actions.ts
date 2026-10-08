"use server";

import { redirect } from "next/navigation";
import { API_URL } from "@/lib/config";
import { readError } from "@/lib/api";
import { clearSession, safeNext, setSession } from "@/lib/session";
import type { AuthResponse } from "@/lib/types";

export type FormState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "phone_number" | "password" | "confirm", string>>;
  values?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function post(path: string, body: unknown) {
  try {
    return await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return null;
  }
}

/** Where to land after auth: renters go to `next`; owners and agents go to their console. */
const landingFor = (role: string, next: string) => {
  if (role === "client") return next.startsWith("/dashboard") ? "/explore" : next;
  return next.startsWith("/dashboard") ? next : "/dashboard";
};

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const values = { email };

  if (!EMAIL_RE.test(email)) return { fieldErrors: { email: "Enter a valid email address." }, values };
  if (!password) return { fieldErrors: { password: "Enter your password." }, values };

  // `/auth/login` signs in any role without side effects. `/auth/admin/login` is not used:
  // it silently converts a renter account into an owner account.
  const res = await post("/auth/login", { email, password });
  if (!res) return { error: "Can't reach Superflats right now. Check your connection and try again.", values };
  if (!res.ok) return { error: await readError(res), values };

  const user = (await res.json()) as AuthResponse;
  await setSession({ accessToken: user.accessToken, refreshToken: user.refreshToken, role: user.role });
  redirect(landingFor(user.role, next));
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  // Backend accepts 10–15 digits only, so strip spaces, dashes and a leading +.
  const phone_number = String(formData.get("phone_number") ?? "").replace(/[^\d]/g, "");
  const next = safeNext(formData.get("next"));
  // Owners get their own company on sign-up (/auth/admin/register); everyone else is a renter.
  const isOwner = formData.get("account_type") === "owner";
  const values = { name, email, phone_number, account_type: isOwner ? "owner" : "renter" };

  const fieldErrors: FormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Enter your full name.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (!/^\d{10,15}$/.test(phone_number)) fieldErrors.phone_number = "Phone number must be 10 to 15 digits.";
  if (password.length < 8) fieldErrors.password = "Password must be at least 8 characters.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const res = await post(isOwner ? "/auth/admin/register" : "/auth/register", { name, email, password, phone_number });
  if (!res) return { error: "Can't reach Superflats right now. Check your connection and try again.", values };
  if (!res.ok) return { error: await readError(res), values };

  const user = (await res.json()) as AuthResponse;
  await setSession({ accessToken: user.accessToken, refreshToken: user.refreshToken, role: user.role });
  redirect(landingFor(user.role, next));
}

export type ResetState = FormState & { sent?: boolean; done?: boolean };

const RESET_UNAVAILABLE = "Password reset isn't available yet. Please try again later.";

/** Always reports success for a valid email so the form can't be used to find out who has an account. */
export async function requestPasswordReset(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const email = String(formData.get("email") ?? "").trim();
  const values = { email };
  if (!EMAIL_RE.test(email)) return { fieldErrors: { email: "Enter a valid email address." }, values };

  const res = await post("/auth/forgot-password", { email });
  if (!res) return { error: "Can't reach Superflats right now. Check your connection and try again.", values };
  if (res.status === 404) return { error: RESET_UNAVAILABLE, values };
  if (!res.ok && res.status !== 400) return { error: await readError(res), values };
  return { sent: true, values };
}

export async function resetPassword(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token) return { error: "This reset link is incomplete. Request a new one." };
  if (password.length < 8) return { fieldErrors: { password: "Password must be at least 8 characters." } };
  if (password !== confirm) return { fieldErrors: { confirm: "Passwords don't match." } };

  const res = await post("/auth/reset-password", { token, password });
  if (!res) return { error: "Can't reach Superflats right now. Check your connection and try again." };
  if (res.status === 404) return { error: RESET_UNAVAILABLE };
  if (!res.ok) return { error: await readError(res) };
  return { done: true };
}

export async function logout() {
  await clearSession();
  redirect("/login");
}

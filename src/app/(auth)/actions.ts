"use server";

import { redirect } from "next/navigation";
import { API_URL } from "@/lib/config";
import { readError } from "@/lib/api";
import { clearSession, safeNext, setSession } from "@/lib/session";
import type { AuthResponse } from "@/lib/types";

export type FormState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "phone_number" | "password", string>>;
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

/** Where to land after auth: owners and agents get the owner area, renters go to `next`. */
const landingFor = (role: string, next: string) => (role === "client" ? next : "/owner");

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
  const values = { name, email, phone_number };

  const fieldErrors: FormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Enter your full name.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (!/^\d{10,15}$/.test(phone_number)) fieldErrors.phone_number = "Phone number must be 10 to 15 digits.";
  if (password.length < 8) fieldErrors.password = "Password must be at least 8 characters.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const res = await post("/auth/register", { name, email, password, phone_number });
  if (!res) return { error: "Can't reach Superflats right now. Check your connection and try again.", values };
  if (!res.ok) return { error: await readError(res), values };

  const user = (await res.json()) as AuthResponse;
  await setSession({ accessToken: user.accessToken, refreshToken: user.refreshToken, role: user.role });
  redirect(landingFor(user.role, next));
}

export async function logout() {
  await clearSession();
  redirect("/login");
}

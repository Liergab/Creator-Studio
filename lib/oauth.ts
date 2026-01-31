import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { AuthUser } from "@/lib/auth-credentials";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";
export const COOKIE_NAME = "creator-studio-session";

export interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: "google" | "facebook";
}

export function createSession(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySession(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: AuthUser) {
  const token = createSession(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getSessionCookie(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

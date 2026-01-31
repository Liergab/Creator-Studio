import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/oauth";
import type { Role } from "@prisma/client";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

function getRedirectBase(request: NextRequest): string {
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto =
    request.headers.get("x-forwarded-proto") ||
    request.headers.get("x-forwarded-ssl");
  if (host) {
    const protocol = proto === "https" || proto === "on" ? "https" : "http";
    return `${protocol}://${host}`;
  }
  return APP_URL;
}

export async function GET(request: NextRequest) {
  const base = getRedirectBase(request);
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${base}/login?error=oauth_cancelled`);
  }

  if (!code) {
    return NextResponse.redirect(`${base}/login?error=oauth_failed`);
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(`${base}/login?error=oauth_not_configured`);
  }

  try {
    // Exchange code for access token (redirect_uri must match Google Console)
    const redirectUri = `${base}/api/auth/google/callback`;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokens.access_token) {
      throw new Error("Failed to get access token");
    }

    // Get user profile
    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );
    const profile = await profileResponse.json();

    if (!profile.email) {
      throw new Error("No email in Google profile");
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name || profile.given_name || "User",
          avatar: profile.picture,
          provider: "google",
          providerId: profile.id,
          role: "user",
        },
      });
    } else {
      // Update OAuth info if needed
      if (!user.provider || user.provider !== "google") {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: "google",
            providerId: profile.id,
            avatar: profile.picture || user.avatar,
          },
        });
      }
    }

    // Create session
    await setSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      avatar: user.avatar || undefined,
    });

    // Redirect based on role (use same origin as request so Vercel stays on deployment URL)
    if (user.role === "super_admin") {
      return NextResponse.redirect(`${base}/admin`);
    }
    return NextResponse.redirect(`${base}/`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${base}/login?error=oauth_error`);
  }
}

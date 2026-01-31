import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/oauth";
import type { Role } from "@prisma/client";

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_cancelled`);
  }

  if (!code) {
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_failed`);
  }

  if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_not_configured`);
  }

  try {
    // Exchange code for access token
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?${new URLSearchParams({
      client_id: FACEBOOK_APP_ID,
      client_secret: FACEBOOK_APP_SECRET,
      redirect_uri: `${APP_URL}/api/auth/facebook/callback`,
      code,
    }).toString()}`;

    const tokenResponse = await fetch(tokenUrl, { method: "GET" });
    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      throw new Error("Failed to get access token");
    }

    // Get user profile
    const profileUrl = `https://graph.facebook.com/v18.0/me?${new URLSearchParams({
      fields: "id,name,email,picture",
      access_token: tokens.access_token,
    }).toString()}`;

    const profileResponse = await fetch(profileUrl);
    const profile = await profileResponse.json();

    if (!profile.email) {
      throw new Error("No email in Facebook profile");
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    const avatar = profile.picture?.data?.url;

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name || "User",
          avatar,
          provider: "facebook",
          providerId: profile.id,
          role: "user",
        },
      });
    } else {
      if (!user.provider || user.provider !== "facebook") {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: "facebook",
            providerId: profile.id,
            avatar: avatar || user.avatar,
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

    // Redirect based on role
    if (user.role === "super_admin") {
      return NextResponse.redirect(`${APP_URL}/admin`);
    }
    return NextResponse.redirect(`${APP_URL}/`);
  } catch (error) {
    console.error("Facebook OAuth error:", error);
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_error`);
  }
}

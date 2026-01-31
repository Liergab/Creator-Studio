import { NextResponse } from "next/server";

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

export async function GET() {
  if (!FACEBOOK_APP_ID) {
    return NextResponse.json(
      { error: "Facebook OAuth not configured. Set FACEBOOK_APP_ID in .env" },
      { status: 500 }
    );
  }

  const redirectUri = `${APP_URL}/api/auth/facebook/callback`;
  // Meta requires at least one supported permission beyond email/public_profile
  const scope = "email,public_profile,pages_show_list";
  const state = Math.random().toString(36).substring(7);

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${new URLSearchParams(
    {
      client_id: FACEBOOK_APP_ID,
      redirect_uri: redirectUri,
      state,
      scope,
    }
  ).toString()}`;

  return NextResponse.redirect(authUrl);
}

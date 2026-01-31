import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

export async function GET() {
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { error: "Google OAuth not configured. Set GOOGLE_CLIENT_ID in .env" },
      { status: 500 }
    );
  }

  const redirectUri = `${APP_URL}/api/auth/google/callback`;
  const scope = "profile email";
  const state = Math.random().toString(36).substring(7); // Simple state for CSRF protection

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
    {
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope,
      state,
      access_type: "offline",
      prompt: "consent",
    }
  ).toString()}`;

  return NextResponse.redirect(authUrl);
}

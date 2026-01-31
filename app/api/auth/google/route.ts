import { NextRequest, NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

function getBaseUrl(request: NextRequest): string {
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto");
  if (host) {
    // Use https for production (Vercel, etc.); http only for localhost
    const isLocal =
      host.startsWith("localhost") || host.startsWith("127.0.0.1");
    const protocol = isLocal
      ? proto === "https"
        ? "https"
        : "http"
      : "https";
    return `${protocol}://${host}`;
  }
  return APP_URL;
}

export async function GET(request: NextRequest) {
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { error: "Google OAuth not configured. Set GOOGLE_CLIENT_ID in .env" },
      { status: 500 }
    );
  }

  const base = getBaseUrl(request);
  const redirectUri = `${base}/api/auth/google/callback`;
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

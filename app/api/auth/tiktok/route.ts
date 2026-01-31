import { NextResponse } from "next/server";

/**
 * TikTok OAuth – MVP placeholder.
 * Wire to TikTok Content Posting API / OAuth.
 * Redirect to TikTok consent, then your /api/auth/callback?provider=tiktok.
 */
export async function GET() {
  return NextResponse.json(
    { message: "Wire TikTok OAuth here. Redirect to provider, then callback." },
    { status: 501 }
  );
}

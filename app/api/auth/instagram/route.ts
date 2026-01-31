import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/oauth";

const META_APP_ID = process.env.FACEBOOK_APP_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

/**
 * GET /api/auth/instagram
 * Redirects the logged-in user to Meta OAuth to connect their Instagram (Business) account.
 * Requires session. Each user gets their own token stored in SocialAccount.
 */
export async function GET() {
  const user = await getSessionCookie();
  if (!user?.id) {
    return NextResponse.redirect(
      `${APP_URL}/login?error=instagram_login_required`
    );
  }

  if (!META_APP_ID) {
    return NextResponse.redirect(
      `${APP_URL}/accounts?error=instagram_oauth_not_configured`
    );
  }

  const redirectUri = `${APP_URL}/api/auth/instagram/callback`;
  const scope = [
    "instagram_basic",
    "instagram_content_publish",
    "pages_show_list",
    "pages_read_engagement",
  ].join(",");
  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString(
    "base64url"
  );

  const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?${new URLSearchParams(
    {
      client_id: META_APP_ID,
      redirect_uri: redirectUri,
      state,
      scope,
    }
  ).toString()}`;

  return NextResponse.redirect(authUrl);
}

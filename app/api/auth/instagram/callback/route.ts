import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/oauth";
import { prisma } from "@/lib/prisma";

const META_APP_ID = process.env.FACEBOOK_APP_ID;
const META_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
const API_VERSION = "v21.0";

/**
 * GET /api/auth/instagram/callback
 * Meta redirects here with ?code=...&state=...
 * Exchanges code for user token → pages → page with Instagram → long-lived page token → save to SocialAccount.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  const accountsPath = "/accounts";

  if (error) {
    return NextResponse.redirect(
      `${APP_URL}${accountsPath}?error=instagram_denied`
    );
  }

  const user = await getSessionCookie();
  if (!user?.id) {
    return NextResponse.redirect(
      `${APP_URL}/login?error=instagram_login_required`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${APP_URL}${accountsPath}?error=instagram_no_code`
    );
  }

  if (!META_APP_ID || !META_APP_SECRET) {
    return NextResponse.redirect(
      `${APP_URL}${accountsPath}?error=instagram_not_configured`
    );
  }

  try {
    // 1. Exchange code for short-lived user access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/${API_VERSION}/oauth/access_token?${new URLSearchParams(
        {
          client_id: META_APP_ID,
          client_secret: META_APP_SECRET,
          redirect_uri: `${APP_URL}/api/auth/instagram/callback`,
          code,
        }
      ).toString()}`
    );
    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      error?: { message?: string };
    };
    if (!tokenData.access_token) {
      throw new Error(tokenData.error?.message ?? "Failed to get access token");
    }
    const userToken = tokenData.access_token;

    // 2. Get user's Facebook Pages (with Instagram Business account and page token)
    const pagesRes = await fetch(
      `https://graph.facebook.com/${API_VERSION}/me/accounts?${new URLSearchParams(
        {
          fields: "id,name,access_token,instagram_business_account",
          access_token: userToken,
        }
      ).toString()}`
    );
    const pagesData = (await pagesRes.json()) as {
      data?: Array<{
        id: string;
        name: string;
        access_token: string;
        instagram_business_account?: { id: string };
      }>;
      error?: { message?: string };
    };
    if (!pagesData.data?.length) {
      throw new Error(
        "No Facebook Pages found. Link an Instagram Business account to a Page first."
      );
    }

    const pageWithIg = pagesData.data.find(
      p => p.instagram_business_account?.id
    );
    if (!pageWithIg?.instagram_business_account) {
      throw new Error(
        "No Page with Instagram Business account. Link Instagram to a Page in Meta Business settings."
      );
    }

    const pageToken = pageWithIg.access_token;
    const igBusinessId = pageWithIg.instagram_business_account.id;

    // 3. Exchange page token for long-lived (60 days)
    const longLivedRes = await fetch(
      `https://graph.facebook.com/${API_VERSION}/oauth/access_token?${new URLSearchParams(
        {
          grant_type: "fb_exchange_token",
          client_id: META_APP_ID,
          client_secret: META_APP_SECRET,
          fb_exchange_token: pageToken,
        }
      ).toString()}`
    );
    const longLivedData = (await longLivedRes.json()) as {
      access_token?: string;
      expires_in?: number;
      error?: { message?: string };
    };
    const longLivedPageToken = longLivedData.access_token ?? pageToken;
    const expiresIn = longLivedData.expires_in ?? 60 * 24 * 60 * 60; // 60 days in seconds
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

    // 4. Get Instagram username for display
    const igProfileRes = await fetch(
      `https://graph.instagram.com/${API_VERSION}/${igBusinessId}?${new URLSearchParams(
        {
          fields: "username,profile_picture_url",
          access_token: longLivedPageToken,
        }
      ).toString()}`
    );
    const igProfile = (await igProfileRes.json()) as {
      username?: string;
      error?: { message?: string };
    };
    const username = igProfile.username ?? "instagram";

    // 5. Ensure user exists in DB (for demo logins we may have no Prisma user)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!dbUser) {
      return NextResponse.redirect(
        `${APP_URL}${accountsPath}?error=instagram_user_not_found`
      );
    }

    // 6. Upsert SocialAccount (Instagram) for this user
    await prisma.socialAccount.upsert({
      where: {
        userId_platform: { userId: user.id, platform: "instagram" },
      },
      create: {
        userId: user.id,
        platform: "instagram",
        username,
        connected: true,
        accessToken: longLivedPageToken,
        tokenExpiresAt,
        externalId: igBusinessId,
      },
      update: {
        username,
        connected: true,
        accessToken: longLivedPageToken,
        tokenExpiresAt,
        externalId: igBusinessId,
      },
    });

    return NextResponse.redirect(
      `${APP_URL}${accountsPath}?connected=instagram`
    );
  } catch (e) {
    console.error("Instagram OAuth callback error:", e);
    const message = e instanceof Error ? e.message : "Instagram connect failed";
    return NextResponse.redirect(
      `${APP_URL}${accountsPath}?error=${encodeURIComponent(message)}`
    );
  }
}

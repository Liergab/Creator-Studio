import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/oauth";
import { prisma } from "@/lib/prisma";
import { getInstagramProfile, hasInstagramToken } from "@/lib/instagram";

/**
 * GET /api/instagram/profile
 * Returns the Instagram account for the current user.
 * Uses per-user OAuth token from DB when available; otherwise falls back to INSTAGRAM_ACCESS_TOKEN (.env) for dev.
 */
export async function GET() {
  const user = await getSessionCookie();

  if (user?.id) {
    const account = await prisma.socialAccount.findUnique({
      where: {
        userId_platform: { userId: user.id, platform: "instagram" },
      },
    });
    if (account?.accessToken) {
      const result = await getInstagramProfile(account.accessToken);
      if (result.ok) {
        return NextResponse.json({ profile: result.profile });
      }
      return NextResponse.json(
        { error: result.error },
        { status: result.error.includes("token") ? 401 : 400 }
      );
    }
  }

  // Fallback: single token from .env (dev / testing)
  if (hasInstagramToken()) {
    const result = await getInstagramProfile();
    if (result.ok) {
      return NextResponse.json({ profile: result.profile });
    }
    return NextResponse.json(
      { error: result.error },
      { status: result.error.includes("token") ? 401 : 400 }
    );
  }

  return NextResponse.json(
    {
      error:
        "Connect Instagram (OAuth) or set INSTAGRAM_ACCESS_TOKEN in .env for dev",
    },
    { status: 503 }
  );
}

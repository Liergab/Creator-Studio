import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/oauth";
import { prisma } from "@/lib/prisma";
import { getInstagramProfile, hasInstagramToken } from "@/lib/instagram";

/**
 * GET /api/accounts/connected
 * Returns which platforms are connected for the current user (or env token for dev).
 */
export async function GET() {
  const user = await getSessionCookie();

  let instagram = false;
  if (user?.id) {
    const account = await prisma.socialAccount.findUnique({
      where: {
        userId_platform: { userId: user.id, platform: "instagram" },
      },
    });
    instagram = Boolean(account?.accessToken);
  }
  if (!instagram && hasInstagramToken()) {
    const res = await getInstagramProfile();
    instagram = res.ok;
  }

  return NextResponse.json({
    instagram,
    tiktok: true,
    facebook: false,
  });
}

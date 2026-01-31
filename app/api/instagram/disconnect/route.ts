import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/oauth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/instagram/disconnect
 * Clears the current user's Instagram OAuth token (per-user). Does not remove INSTAGRAM_ACCESS_TOKEN from .env.
 */
export async function POST() {
  const user = await getSessionCookie();
  if (!user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  await prisma.socialAccount.updateMany({
    where: { userId: user.id, platform: "instagram" },
    data: {
      accessToken: null,
      tokenExpiresAt: null,
      externalId: null,
      connected: false,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Instagram disconnected",
  });
}

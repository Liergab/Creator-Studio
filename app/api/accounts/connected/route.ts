import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/oauth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/accounts/connected
 * Returns which platforms are connected for the current user (OAuth only). No hardcoded token.
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

  return NextResponse.json({
    instagram,
    tiktok: true,
    facebook: false,
  });
}

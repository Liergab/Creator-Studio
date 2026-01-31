import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/oauth";
import { prisma } from "@/lib/prisma";
import { decryptToken } from "@/lib/encrypt";
import { getInstagramProfile } from "@/lib/instagram";

/**
 * GET /api/instagram/profile
 * Returns the Instagram account for the current user (OAuth only). No hardcoded token.
 */
export async function GET() {
  const user = await getSessionCookie();
  if (!user?.id) {
    return NextResponse.json(
      { error: "Sign in to view connected Instagram" },
      { status: 401 }
    );
  }

  const account = await prisma.socialAccount.findUnique({
    where: {
      userId_platform: { userId: user.id, platform: "instagram" },
    },
  });
  if (!account?.accessToken) {
    return NextResponse.json(
      {
        error: "Connect Instagram (Accounts → Connect Instagram)",
      },
      { status: 503 }
    );
  }

  const accessToken = decryptToken(account.accessToken);
  const result = await getInstagramProfile(accessToken);
  if (result.ok) {
    return NextResponse.json({ profile: result.profile });
  }
  return NextResponse.json(
    { error: result.error },
    { status: result.error.includes("token") ? 401 : 400 }
  );
}

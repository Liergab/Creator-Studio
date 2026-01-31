import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/oauth";
import { prisma } from "@/lib/prisma";
import { publishImageToInstagram, hasInstagramToken } from "@/lib/instagram";

/**
 * POST /api/instagram/publish
 * Creates and publishes a single image post to Instagram (Content Publishing API).
 * Body: { imageUrl: string, caption?: string }
 * Uses per-user OAuth token from DB when available; otherwise falls back to INSTAGRAM_ACCESS_TOKEN (.env).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUrl =
      typeof body?.imageUrl === "string"
        ? body.imageUrl
        : typeof body?.url === "string"
          ? body.url
          : "";
    const imageUrl = rawUrl.trim();
    const caption =
      typeof body?.caption === "string" ? body.caption : undefined;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required and must be a public URL" },
        { status: 400 }
      );
    }

    let parsed: URL;
    try {
      parsed = new URL(imageUrl);
    } catch {
      return NextResponse.json(
        {
          error: "imageUrl must be a valid URL",
          received: imageUrl.slice(0, 80) + (imageUrl.length > 80 ? "…" : ""),
        },
        { status: 400 }
      );
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json(
        { error: "imageUrl must use http or https" },
        { status: 400 }
      );
    }

    const user = await getSessionCookie();
    let result: Awaited<ReturnType<typeof publishImageToInstagram>>;

    if (user?.id) {
      const account = await prisma.socialAccount.findUnique({
        where: {
          userId_platform: { userId: user.id, platform: "instagram" },
        },
      });
      if (account?.accessToken && account.externalId) {
        result = await publishImageToInstagram(imageUrl, caption, {
          accessToken: account.accessToken,
          igUserId: account.externalId,
        });
      } else {
        result = hasInstagramToken()
          ? await publishImageToInstagram(imageUrl, caption)
          : {
              ok: false,
              error: "Connect Instagram first (Accounts → Connect Instagram)",
            };
      }
    } else {
      result = hasInstagramToken()
        ? await publishImageToInstagram(imageUrl, caption)
        : {
            ok: false,
            error: "Connect Instagram first (Accounts → Connect Instagram)",
          };
    }

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error.includes("Connect") ? 503 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      mediaId: result.mediaId,
      message: "Post published to Instagram",
    });
  } catch (e) {
    console.error("Instagram publish error:", e);
    return NextResponse.json(
      { error: "Failed to publish to Instagram" },
      { status: 500 }
    );
  }
}

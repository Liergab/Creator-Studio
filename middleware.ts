import { NextResponse, type NextRequest } from "next/server";

// Must match lib/oauth.ts – do not import oauth here (jsonwebtoken is Node-only, middleware runs in Edge)
const COOKIE_NAME = "creator-studio-session";

const PUBLIC_PATHS = new Set([
  "/login",
  "/privacy",
  "/terms",
  "/data-deletion",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/session",
  "/api/auth/google",
  "/api/auth/facebook",
  "/api/auth/instagram",
  "/api/auth/tiktok",
]);

const ROLE_SEGMENTS = ["super_admin", "admin", "user"] as const;
type RoleSegment = (typeof ROLE_SEGMENTS)[number];

function wantsJson(req: NextRequest): boolean {
  const accept = req.headers.get("accept") ?? "";
  const requestedWith = req.headers.get("x-requested-with") ?? "";
  const dest = req.headers.get("sec-fetch-dest") ?? "";

  // Treat non-document fetches (XHR/fetch) as wanting JSON, even if accept is */*
  const isNonDocumentFetch = dest !== "" && dest !== "document";

  return (
    accept.includes("application/json") ||
    requestedWith === "XMLHttpRequest" ||
    isNonDocumentFetch
  );
}

function decodeJwtPayload(token: string): unknown {
  const [, payload] = token.split(".");
  if (!payload) return null;
  try {
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getSessionRole(req: NextRequest): RoleSegment | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = decodeJwtPayload(token) as { role?: string } | null;
  if (!payload?.role) return null;
  return ROLE_SEGMENTS.includes(payload.role as RoleSegment)
    ? (payload.role as RoleSegment)
    : null;
}

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Skip static assets/_next
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Skip non-auth API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Allow public paths
  if (PUBLIC_PATHS.has(pathname) || pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const role = getSessionRole(req);

  // Redirect unauthenticated users to login
  if (!role) {
    if (wantsJson(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Enforce /{role}/ prefix for dashboard
  if (pathname === "/" || pathname === "/dashboard") {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, origin));
  }

  // Enforce role segment match when present
  const roleMatch = pathname.match(/^\/(super_admin|admin|user)(\/|$)/);
  if (roleMatch) {
    const pathRole = roleMatch[1] as RoleSegment;
    if (pathRole !== role) {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, origin));
    }
  }

  // Guard /admin namespace to super_admin only
  if (pathname.startsWith("/admin") && role !== "super_admin") {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

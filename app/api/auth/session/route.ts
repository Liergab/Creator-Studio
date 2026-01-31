import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/oauth";

export async function GET() {
  const user = await getSessionCookie();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user });
}

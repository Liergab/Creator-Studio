import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * User API Endpoint (id scoped)
 *
 * DELETE /api/users/:id - Delete a user by id
 */

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "User id is required" }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ deleted: true, id });
  } catch (error: unknown) {
    // Prisma error codes:
    // - P2025: Record to delete does not exist
    // - P2023: Inconsistent column data (often invalid Mongo ObjectId)
    const e = error as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (e.code === "P2023") {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

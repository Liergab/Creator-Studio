/**
 * User API Endpoint
 *
 * GET  /api/users  - List users (pagination, filter, sort)
 *      Query: ?page=1&limit=10&role=user&search=john&sortBy=createdAt&sortOrder=desc
 * POST /api/users  - Create a new user
 *
 * See docs/API_USERS.md for full documentation.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

const ROLES: Role[] = ["super_admin", "admin", "user"];
const SORT_FIELDS = ["createdAt", "updatedAt", "name", "email", "memberSince", "role"] as const;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function parseQuery(request: NextRequest) {
  const u = request.nextUrl;
  const page = Math.max(1, parseInt(u.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(u.searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
  );
  const role = u.searchParams.get("role") ?? undefined;
  const search = (u.searchParams.get("search") ?? u.searchParams.get("q") ?? "").trim();
  const sortBy = u.searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = (u.searchParams.get("sortOrder") ?? "desc").toLowerCase() as "asc" | "desc";

  const validRole = role && ROLES.includes(role as Role) ? (role as Role) : undefined;
  const validSortBy = SORT_FIELDS.includes(sortBy as (typeof SORT_FIELDS)[number])
    ? (sortBy as (typeof SORT_FIELDS)[number])
    : "createdAt";
  const validSortOrder = sortOrder === "asc" ? "asc" : "desc";

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    role: validRole,
    search: search || undefined,
    sortBy: validSortBy,
    sortOrder: validSortOrder,
  };
}

// GET /api/users - List users with pagination, filter, sort
export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip, role, search, sortBy, sortOrder } = parseQuery(request);

    const where: Record<string, unknown> = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          memberSince: true,
          createdAt: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role = "user", avatar } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        avatar,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    const e = error as { code?: string };
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

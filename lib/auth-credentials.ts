// Demo credentials – replace with real auth (NextAuth, Supabase, etc.) in production.

export type Role = "super_admin" | "admin" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface Credential {
  email: string;
  password: string;
  user: AuthUser;
}

const CREDENTIALS: Credential[] = [
  {
    email: "superadmin@creator.studio",
    password: "superadmin123",
    user: {
      id: "sa1",
      name: "Super Admin",
      email: "superadmin@creator.studio",
      role: "super_admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin",
    },
  },
  {
    email: "admin@creator.studio",
    password: "admin123",
    user: {
      id: "a1",
      name: "Admin",
      email: "admin@creator.studio",
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    },
  },
];

const STORAGE_KEY = "creator-studio-auth";

export function validateCredentials(
  email: string,
  password: string
): AuthUser | null {
  const e = email.trim().toLowerCase();
  const c = CREDENTIALS.find(
    (x) => x.email.toLowerCase() === e && x.password === password
  );
  return c ? c.user : null;
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function isSuperAdmin(user: AuthUser | null): boolean {
  return user?.role === "super_admin";
}

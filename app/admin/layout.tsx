"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const nav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isReady, logout } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!user || user.role !== "super_admin") {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  if (!isReady || !user || user.role !== "super_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground gap-6 p-4">
      <aside className="w-56 bg-card border border-border rounded-2xl flex flex-col flex-shrink-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h1 className="font-bold text-base text-sidebar-foreground">Super Admin</h1>
              <p className="text-xs text-muted-foreground">Platform control</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            User Dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto bg-card border border-border rounded-2xl p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

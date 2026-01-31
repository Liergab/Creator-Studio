"use client";

import { useState, useEffect } from "react";
import { sidebarItems, mockUser } from "@/lib/mockData";
import {
  LayoutDashboard,
  Sparkles,
  Link as LinkIcon,
  Video,
  GitBranch,
  BarChart3,
  DollarSign,
  Moon,
  Sun,
  Shield,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Link: <LinkIcon className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Workflow: <GitBranch className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const displayUser = user ?? mockUser;
  const isSuperAdmin = user?.role === "super_admin";

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentDate = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();

  return (
    <div className="flex h-screen bg-background text-foreground gap-6 p-4">
      {/* Sidebar Card */}
      <aside className="w-64 bg-card border border-border rounded-2xl flex flex-col flex-shrink-0 overflow-hidden">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">
                Creator Studio
              </h1>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="p-4 border-b border-border">
          <div className="bg-secondary rounded-lg p-4 relative">
            {/* Theme Toggle */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="absolute top-3 right-3 flex items-center gap-1 p-1.5 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <Moon
                  className={cn(
                    "w-3.5 h-3.5",
                    !mounted
                      ? "text-muted-foreground"
                      : theme === "dark"
                        ? "text-accent"
                        : "text-muted-foreground"
                  )}
                />
                <Sun
                  className={cn(
                    "w-3.5 h-3.5",
                    !mounted
                      ? "text-muted-foreground"
                      : theme === "light"
                        ? "text-accent"
                        : "text-muted-foreground"
                  )}
                />
              </button>
            )}

            {/* Avatar */}
            <div className="mb-3">
              <Image
                src={
                  (displayUser as { avatar?: string }).avatar ?? mockUser.avatar
                }
                alt={displayUser.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>

            {/* Date */}
            <p className="text-xs text-muted-foreground mb-2">{currentDate}</p>

            {/* Greeting */}
            <p className="text-sm text-foreground mb-1">Welcome back,</p>
            <p className="text-xl font-bold text-foreground">
              {displayUser.name}!
            </p>
            {user ? (
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs text-accent hover:underline mt-2 inline-flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" /> Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="text-xs text-accent hover:underline mt-2 inline-block"
              >
                Sign in / OAuth
              </Link>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="mb-3">
            <div className="flex items-center gap-2 px-4 py-2">
              <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                User Dashboard
              </span>
            </div>
          </div>
          <div className="space-y-1">
            {sidebarItems.map(item => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-secondary text-foreground"
                    : "text-foreground hover:bg-secondary/50"
                )}
              >
                {iconMap[item.icon]}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
          {isSuperAdmin && (
            <div className="mt-4 pt-4 border-t border-border">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Super Admin</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Pro Banner */}
        <div className="p-4 border-t border-border">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg py-6 flex items-center gap-3 shadow-lg">
            <Sparkles className="w-5 h-5" />
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm">Auto-post daily</span>
              <span className="text-xs opacity-90">Workflows + AI video</span>
            </div>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto bg-card border border-border rounded-2xl p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { mockPlatformStats, mockPlatformUsers } from "@/lib/mockData";
import { Users, FileVideo, GitBranch, TrendingUp, ArrowRight } from "lucide-react";

export default function SuperAdminPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview, user management, and system settings.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Total users</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{mockPlatformStats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Active users</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{mockPlatformStats.activeUsers.toLocaleString()}</p>
        </div>
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileVideo className="w-4 h-4" />
            <span className="text-xs font-medium">Total posts</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{mockPlatformStats.totalPosts.toLocaleString()}</p>
        </div>
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <GitBranch className="w-4 h-4" />
            <span className="text-xs font-medium">Workflows</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{mockPlatformStats.totalWorkflows.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {mockPlatformUsers.slice(0, 6).map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-2 p-3 rounded-lg bg-background/50 border border-border"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      u.role === "super_admin"
                        ? "bg-amber-500/20 text-amber-500"
                        : u.role === "admin"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {u.role.replace("_", " ")}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      u.status === "active" ? "bg-green-400/20 text-green-400" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {u.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Platform growth</h2>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-foreground">{mockPlatformStats.growthPercent}%</p>
            <p className="text-sm text-muted-foreground mb-2">vs last period</p>
          </div>
        </div>
      </div>
    </>
  );
}

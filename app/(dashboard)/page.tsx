"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import {
  mockUser,
  mockSocialAccounts,
  mockPosts,
  mockWorkflows,
  mockAccountStats,
  mockDailyViews,
} from "@/lib/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Link as LinkIcon,
  Video,
  GitBranch,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridStroke = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
  const axisStroke = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const tickFill = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
  const tooltipStyle = isDark
    ? {
        backgroundColor: "rgba(20, 20, 40, 0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
      }
    : {
        backgroundColor: "rgba(255,255,255,0.98)",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "8px",
        color: "rgba(0,0,0,0.9)",
      };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Overview</h1>
        <p className="text-muted-foreground">
          Connect accounts, create videos, schedule posts, and track growth
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-medium">Total views</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {mockAccountStats.totalViews.toLocaleString()}
          </p>
        </div>
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-medium">Likes</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {mockAccountStats.totalLikes.toLocaleString()}
          </p>
        </div>
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Comments</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {mockAccountStats.totalComments}
          </p>
        </div>
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Engagement</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {mockAccountStats.engagementRate}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily views */}
        <div className="lg:col-span-2 bg-secondary rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Daily views
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockDailyViews}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                dataKey="date"
                stroke={axisStroke}
                tick={{ fill: tickFill }}
              />
              <YAxis stroke={axisStroke} tick={{ fill: tickFill }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="views"
                stroke="oklch(0.623 0.214 259.815)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Connected accounts */}
        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Accounts</h2>
            <Button asChild size="sm" variant="outline">
              <Link href="/accounts">
                Connect <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {mockSocialAccounts.map(acc => (
              <div
                key={acc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold">
                    {acc.platform === "tiktok" ? "T" : "IG"}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {acc.platformLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {acc.username}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-green-400 font-medium">
                  {acc.followers.toLocaleString()} followers
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent posts */}
        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent posts</h2>
            <Button asChild size="sm" variant="ghost">
              <Link href="/create">Create new</Link>
            </Button>
          </div>
          <div className="space-y-2">
            {mockPosts.slice(0, 4).map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {p.caption}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {p.platform} · {p.status}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {p.views.toLocaleString()} views
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      p.status === "posted"
                        ? "bg-green-400/20 text-green-400"
                        : p.status === "scheduled"
                          ? "bg-blue-400/20 text-blue-400"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active workflows */}
        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Workflows</h2>
            <Button asChild size="sm" variant="ghost">
              <Link href="/workflows">Manage</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {mockWorkflows.map(w => (
              <div
                key={w.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <GitBranch className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {w.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {w.frequency} at {w.time} · {w.platform}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-green-400 font-medium">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

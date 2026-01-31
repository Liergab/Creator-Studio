"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import {
  mockPosts,
  mockDailyViews,
  mockWeeklyEngagement,
  mockAccountStats,
} from "@/lib/mockData";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

export default function AnalyticsPage() {
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

  const posted = mockPosts.filter(p => p.status === "posted");

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Per-post: views, likes, comments, shares. Per-account: follower
            growth, engagement. Nightly sync.
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      {/* Summary */}
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
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-medium">Engagement</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {mockAccountStats.engagementRate}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Daily views
          </h2>
          <ResponsiveContainer width="100%" height={240}>
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
        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Weekly engagement
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockWeeklyEngagement}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                dataKey="day"
                stroke={axisStroke}
                tick={{ fill: tickFill }}
              />
              <YAxis stroke={axisStroke} tick={{ fill: tickFill }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="engagement"
                fill="oklch(0.623 0.214 259.815)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-secondary rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Per-post metrics
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">
                  Post
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">
                  Platform
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">
                  Views
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">
                  Likes
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">
                  Comments
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">
                  Shares
                </th>
              </tr>
            </thead>
            <tbody>
              {posted.map(p => (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-background/30"
                >
                  <td className="py-3 px-4 text-foreground font-medium">
                    {p.caption}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground capitalize">
                    {p.platform}
                  </td>
                  <td className="py-3 px-4 text-right text-foreground">
                    {p.views.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-foreground">
                    {p.likes.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-foreground">
                    {p.comments}
                  </td>
                  <td className="py-3 px-4 text-right text-foreground">
                    {p.shares}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

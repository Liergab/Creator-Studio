"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockIncomeEntries, mockRpmEstimate } from "@/lib/mockData";
import { DollarSign, Plus, TrendingUp } from "lucide-react";

export default function IncomePage() {
  const [entries] = useState(mockIncomeEntries);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Income</h1>
        <p className="text-muted-foreground">
          MVP: manual entry (brand deals, affiliate). RPM-based estimate from views. No auto-pull yet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-secondary rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Manual entries</h2>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add income
            </Button>
          </div>
          <div className="space-y-2">
            {entries.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border"
              >
                <div>
                  <p className="font-medium text-foreground">{e.source}</p>
                  <p className="text-xs text-muted-foreground">{e.date} · {e.note}</p>
                </div>
                <p className="text-lg font-bold text-foreground">${e.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">RPM estimate</h2>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">From views</span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            ${mockRpmEstimate.estimatedEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {mockRpmEstimate.estimatedFromViews.toLocaleString()} views × ${mockRpmEstimate.rpm} RPM
          </p>
        </div>
      </div>

      <div className="bg-secondary rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Total (manual)</h2>
        <p className="text-2xl font-bold text-foreground">
          ${entries.reduce((s, e) => s + e.amount, 0).toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Later: TikTok Creator Marketplace, YouTube AdSense.
        </p>
      </div>
    </>
  );
}

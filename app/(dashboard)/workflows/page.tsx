"use client";

import { Button } from "@/components/ui/button";
import { mockWorkflows } from "@/lib/mockData";
import { GitBranch, Plus, Clock, Video, Calendar } from "lucide-react";

export default function WorkflowsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Workflows</h1>
        <p className="text-muted-foreground">
          &quot;Post 1 video every day at 8PM&quot; — Frequency, platform, content source. Timezone-aware. Cron / BullMQ.
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4 mr-2" /> New workflow
        </Button>
      </div>

      <div className="space-y-4">
        {mockWorkflows.map((w) => (
          <div
            key={w.id}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-border bg-secondary gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                <GitBranch className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{w.name}</h2>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {w.frequency} at {w.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" /> {w.platform}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {w.timezone}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Content: {w.contentSource === "ai_generated" ? "AI generated" : "Drafts"} · Next run {new Date(w.nextRun).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-medium text-green-400">Active</span>
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">Pause</Button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Backend: Cron / Queue (BullMQ + Redis). Jobs render video if needed → upload → status: Posted / Failed / Retry.
      </p>
    </>
  );
}

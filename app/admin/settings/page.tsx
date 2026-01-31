"use client";

import { Button } from "@/components/ui/button";
import { Settings, Bell, Shield, Database } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          System configuration, feature flags, and defaults.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Email and in-app notification preferences for admins.
          </p>
          <Button variant="outline" size="sm">Configure</Button>
        </div>

        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            OAuth providers, rate limits, and access control.
          </p>
          <Button variant="outline" size="sm">Configure</Button>
        </div>

        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Data</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Backups, sync jobs, and retention policies.
          </p>
          <Button variant="outline" size="sm">Configure</Button>
        </div>
      </div>
    </>
  );
}

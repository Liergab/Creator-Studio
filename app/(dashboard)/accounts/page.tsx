"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockSocialAccounts } from "@/lib/mockData";
import { Link, Check, Plus, Loader2, Copy } from "lucide-react";

const PLATFORMS = [
  {
    id: "tiktok",
    name: "TikTok",
    desc: "Connect to post videos, read profile, views, likes, comments.",
    doc: "TikTok Content Posting API",
  },
  {
    id: "instagram",
    name: "Instagram",
    desc: "Connect to post to feed & Reels, read profile and insights.",
    doc: "Meta Graph API",
  },
] as const;

const INSTAGRAM_DISCONNECT_KEY = "creator-studio-instagram-disconnected";
const TIKTOK_DISCONNECT_KEY = "creator-studio-tiktok-disconnected";

type InstagramProfile = { id: string; username?: string };

function AccountsPageContent() {
  const searchParams = useSearchParams();
  const connected = mockSocialAccounts.filter(a => a.connected);
  const connectedIds = new Set(connected.map(a => a.platform));

  const [instagramProfile, setInstagramProfile] =
    useState<InstagramProfile | null>(null);
  const [instagramLoading, setInstagramLoading] = useState(true);
  const [instagramConnectDialogOpen, setInstagramConnectDialogOpen] =
    useState(false);
  const [envCopied, setEnvCopied] = useState(false);

  const [instagramDisconnected, setInstagramDisconnected] = useState(false);
  const [tiktokDisconnected, setTiktokDisconnected] = useState(false);

  useEffect(() => {
    setInstagramDisconnected(
      localStorage.getItem(INSTAGRAM_DISCONNECT_KEY) === "1"
    );
    setTiktokDisconnected(localStorage.getItem(TIKTOK_DISCONNECT_KEY) === "1");
  }, []);

  const handleInstagramDisconnect = async () => {
    setInstagramLoading(true);
    try {
      const res = await fetch("/api/instagram/disconnect", { method: "POST" });
      if (res.ok) {
        localStorage.removeItem(INSTAGRAM_DISCONNECT_KEY);
        setInstagramDisconnected(false);
        setInstagramProfile(null);
      }
    } finally {
      setInstagramLoading(false);
    }
  };

  const handleInstagramConnect = () => {
    localStorage.removeItem(INSTAGRAM_DISCONNECT_KEY);
    setInstagramDisconnected(false);
    // OAuth: redirect to Meta so the user connects their own Instagram
    window.location.href = "/api/auth/instagram";
  };

  const handleTiktokDisconnect = () => {
    localStorage.setItem(TIKTOK_DISCONNECT_KEY, "1");
    setTiktokDisconnected(true);
  };

  const envLine = 'INSTAGRAM_ACCESS_TOKEN="your-long-lived-token"';
  const copyEnvLine = () => {
    navigator.clipboard.writeText(envLine).then(() => {
      setEnvCopied(true);
      setTimeout(() => setEnvCopied(false), 2000);
    });
  };

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "instagram_oauth_not_configured") {
      setInstagramConnectDialogOpen(true);
    }
  }, [searchParams]);

  const callbackError = searchParams.get("error");
  const errorMessage =
    callbackError === "instagram_user_not_found"
      ? "Sign in with Google or Facebook to connect Instagram (demo login does not create a DB user)."
      : callbackError === "instagram_denied"
        ? "Instagram connection was cancelled or denied."
        : callbackError === "instagram_not_configured"
          ? "Instagram OAuth is not configured. Set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET in .env."
          : callbackError
            ? decodeURIComponent(callbackError)
            : null;

  useEffect(() => {
    let cancelled = false;
    setInstagramLoading(true);
    fetch("/api/instagram/profile")
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        if (data.profile?.id) setInstagramProfile(data.profile);
        else setInstagramProfile(null);
      })
      .catch(() => {
        if (!cancelled) setInstagramProfile(null);
      })
      .finally(() => {
        if (!cancelled) setInstagramLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const instagramConnected =
    Boolean(instagramProfile?.id) && !instagramDisconnected;
  const tiktokConnected = connectedIds.has("tiktok") && !tiktokDisconnected;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Accounts</h1>
        <p className="text-muted-foreground">
          Connect TikTok and Instagram. OAuth login (Meta + TikTok). Read
          profile, posts, metrics. Post & schedule.
        </p>
      </div>
      {errorMessage && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {errorMessage}
        </div>
      )}

      {/* Connected: TikTok from mock + Instagram from token when set */}
      {(tiktokConnected || instagramConnected) && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Connected
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockSocialAccounts
              .filter(
                acc =>
                  acc.platform === "tiktok" &&
                  acc.connected &&
                  !tiktokDisconnected
              )
              .map(acc => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                      T
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {acc.platformLabel}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {acc.username}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {acc.followers.toLocaleString()} followers · Synced
                        recently
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm text-green-400">
                      <Check className="w-4 h-4" /> Connected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTiktokDisconnect}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))}
            {instagramConnected && instagramProfile && (
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                    IG
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Instagram</p>
                    <p className="text-sm text-muted-foreground">
                      @{instagramProfile.username ?? "instagram"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Meta Graph API · Synced recently
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-sm text-green-400">
                    <Check className="w-4 h-4" /> Connected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleInstagramDisconnect}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add account */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Connect more
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLATFORMS.map(p => {
            const isInstagram = p.id === "instagram";
            const isConnected = isInstagram
              ? instagramConnected
              : tiktokConnected;
            const isLoading = isInstagram && instagramLoading;
            return (
              <div
                key={p.id}
                className="flex flex-col p-6 rounded-xl border border-border bg-secondary"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Link className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.doc}</p>
                      {isInstagram && instagramProfile?.username && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          @{instagramProfile.username}
                        </p>
                      )}
                    </div>
                  </div>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : isConnected ? (
                    <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : isInstagram ? (
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={handleInstagramConnect}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Connect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Connect
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connect Instagram: how to add token */}
      <Dialog
        open={instagramConnectDialogOpen}
        onOpenChange={setInstagramConnectDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Instagram</DialogTitle>
            <DialogDescription>
              For production: set{" "}
              <code className="bg-secondary px-1 rounded text-xs">
                FACEBOOK_APP_ID
              </code>{" "}
              and{" "}
              <code className="bg-secondary px-1 rounded text-xs">
                FACEBOOK_APP_SECRET
              </code>{" "}
              in .env so each user can connect via OAuth (Connect → Meta login).
              For dev you can use a single token below.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Optional (dev only): add to .env:
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-secondary/80 p-3 font-mono text-xs">
            <code className="flex-1 break-all">{envLine}</code>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={copyEnvLine}
            >
              {envCopied ? (
                <span className="text-green-500 text-xs">Copied</span>
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Full setup:{" "}
            <code className="bg-secondary px-1 rounded text-xs">
              docs/INSTAGRAM_SETUP.md
            </code>
            .
          </p>
          <DialogFooter>
            <Button onClick={() => setInstagramConnectDialogOpen(false)}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-xs text-muted-foreground mt-6">
        YouTube Shorts coming in Phase 2.
      </p>
    </>
  );
}

export default function AccountsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AccountsPageContent />
    </Suspense>
  );
}

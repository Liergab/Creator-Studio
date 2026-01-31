"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { mockPosts } from "@/lib/mockData";
import {
  Video,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "upload" | "generate" | "drafts";
type Platform = "instagram" | "tiktok" | "facebook";

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "facebook", label: "Facebook" },
];

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [connectedPlatforms, setConnectedPlatforms] = useState<Platform[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [platformsLoading, setPlatformsLoading] = useState(true);

  const [caption, setCaption] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [clipFiles, setClipFiles] = useState<File[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const imagePreviewUrlsRef = useRef<string[]>([]);
  useEffect(() => {
    imagePreviewUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
    const urls = imageFiles.map(f => URL.createObjectURL(f));
    imagePreviewUrlsRef.current = urls;
    setImagePreviewUrls(urls);
    return () => {
      urls.forEach(u => URL.revokeObjectURL(u));
    };
  }, [imageFiles]);

  const scriptInputId = "create-script-input";
  const imagesInputId = "create-images-input";
  const clipsInputId = "create-clips-input";

  useEffect(() => {
    fetch("/api/accounts/connected")
      .then(res => res.json())
      .then(data => {
        const connected: Platform[] = [];
        if (data.instagram) connected.push("instagram");
        if (data.tiktok) connected.push("tiktok");
        if (data.facebook) connected.push("facebook");
        setConnectedPlatforms(connected);
        if (connected.length > 0 && selectedPlatforms.length === 0) {
          setSelectedPlatforms([connected[0]]);
        }
      })
      .catch(() => setConnectedPlatforms([]))
      .finally(() => setPlatformsLoading(false));
  }, []);

  const togglePlatform = (id: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Create</h1>
        <p className="text-muted-foreground">
          Create posts manually (upload) or with AI. Choose platforms below.
          Output ready to schedule.
        </p>
      </div>

      {/* Post to: dropdown with checkboxes (only connected platforms) */}
      <div className="mb-6 p-4 rounded-xl bg-secondary border border-border">
        <h2 className="text-sm font-semibold text-foreground mb-3">Post to</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Select one or more connected platforms. Connect accounts in{" "}
          <a href="/accounts" className="text-accent hover:underline">
            Accounts
          </a>{" "}
          if needed.
        </p>
        {platformsLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : connectedPlatforms.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No platforms connected. Connect at least one in Accounts.
          </p>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-between min-w-[200px]"
              >
                {selectedPlatforms.length === 0
                  ? "Select platforms…"
                  : selectedPlatforms
                      .map(id => PLATFORMS.find(x => x.id === id)?.label)
                      .join(", ")}
                <ChevronDown className="w-4 h-4 ml-2 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="space-y-2">
                {connectedPlatforms.map(id => {
                  const label = PLATFORMS.find(x => x.id === id)?.label ?? id;
                  return (
                    <label
                      key={id}
                      className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent/10 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedPlatforms.includes(id)}
                        onCheckedChange={() => togglePlatform(id)}
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        )}
        {selectedPlatforms.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Posting to{" "}
            <span className="font-medium text-foreground">
              {selectedPlatforms
                .map(id => PLATFORMS.find(x => x.id === id)?.label)
                .join(", ")}
            </span>
          </p>
        )}
      </div>

      {/* Tabs: Manual (Upload) + Automation (AI Generate) + Drafts */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "upload" as Tab, label: "Upload", sub: "Manual", icon: Upload },
          {
            id: "generate" as Tab,
            label: "AI Generate",
            sub: "Automation",
            icon: Sparkles,
          },
          { id: "drafts" as Tab, label: "Drafts", icon: Video },
        ].map(({ id, label, sub, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === id
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {sub && <span className="text-xs opacity-80">({sub})</span>}
          </button>
        ))}
      </div>

      {activeTab === "upload" && (
        <div className="space-y-6">
          <div className="bg-secondary rounded-2xl p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Upload assets
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Create a post manually: upload script, images, or clips.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Text (caption / script), images OR short clips. We&apos;ll stitch
              with FFmpeg, add captions (OpenAI) & music (Pexels).
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              For Instagram: upload a <strong>.jpg</strong> image. The image URL
              must be publicly accessible. Use Cloudinary (set{" "}
              <code className="text-xs bg-muted px-1 rounded">
                CLOUDINARY_*
              </code>{" "}
              in .env) so Instagram gets a public URL, or set{" "}
              <code className="text-xs bg-muted px-1 rounded">
                NEXT_PUBLIC_APP_URL
              </code>{" "}
              to an ngrok URL when developing locally.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col p-4 rounded-xl border-2 border-dashed border-border">
                <label
                  htmlFor={scriptInputId}
                  className="text-sm font-medium text-foreground mb-2 block"
                >
                  Script / Caption
                </label>
                <textarea
                  id={scriptInputId}
                  placeholder="Type or paste your caption or script..."
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  className="min-h-[120px] w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
                />
                <span className="text-xs text-muted-foreground mt-1">
                  .txt or paste
                </span>
              </div>
              <div className="space-y-3">
                <input
                  id={imagesInputId}
                  type="file"
                  accept=".jpg,.jpeg,image/jpeg"
                  multiple
                  className="hidden"
                  onChange={e => {
                    const files = e.target.files
                      ? Array.from(e.target.files)
                      : [];
                    setImageFiles(prev => [...prev, ...files]);
                    e.target.value = "";
                  }}
                />
                <label
                  htmlFor={imagesInputId}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-border hover:border-accent/50 transition-colors cursor-pointer min-h-[120px]"
                >
                  <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-foreground">
                    Images
                  </span>
                  <span className="text-xs text-muted-foreground">
                    .jpg only (Instagram)
                  </span>
                </label>
                {imageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {imageFiles.map((file, i) => (
                      <div
                        key={`${file.name}-${i}`}
                        className="relative group rounded-lg overflow-hidden border border-border bg-secondary w-20 h-20 shrink-0"
                      >
                        <img
                          src={imagePreviewUrls[i]}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setImageFiles(prev =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                          className="absolute top-0.5 right-0.5 p-1 rounded-full bg-black/70 text-white hover:bg-black/90"
                          aria-label="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 truncate">
                          {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <input
                  id={clipsInputId}
                  type="file"
                  accept=".mp4,.mov,.webm"
                  multiple
                  className="hidden"
                  onChange={e => {
                    const files = e.target.files
                      ? Array.from(e.target.files)
                      : [];
                    setClipFiles(prev => [...prev, ...files]);
                    e.target.value = "";
                  }}
                />
                <label
                  htmlFor={clipsInputId}
                  className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-border hover:border-accent/50 transition-colors cursor-pointer min-h-[140px]"
                >
                  <Video className="w-10 h-10 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-foreground">
                    Clips
                  </span>
                  <span className="text-xs text-muted-foreground">
                    .mp4, short
                  </span>
                  {clipFiles.length > 0 && (
                    <span className="text-xs text-accent mt-2">
                      {clipFiles.length} file(s)
                    </span>
                  )}
                </label>
              </div>
            </div>
            {scheduleMessage && (
              <p
                className={cn(
                  "text-sm mt-2",
                  scheduleMessage.type === "success"
                    ? "text-green-500"
                    : "text-destructive"
                )}
              >
                {scheduleMessage.text}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Sparkles className="w-4 h-4 mr-2" /> Generate video
              </Button>
              <Button
                variant="outline"
                disabled={scheduleLoading || selectedPlatforms.length === 0}
                onClick={async () => {
                  setScheduleMessage(null);
                  if (selectedPlatforms.length === 0) return;
                  const hasInstagram = selectedPlatforms.includes("instagram");
                  const firstImage = imageFiles[0];
                  if (hasInstagram && firstImage) {
                    setScheduleLoading(true);
                    try {
                      const form = new FormData();
                      form.append("file", firstImage);
                      const uploadRes = await fetch("/api/upload", {
                        method: "POST",
                        body: form,
                      });
                      const uploadData = await uploadRes.json();
                      if (!uploadRes.ok)
                        throw new Error(uploadData.error ?? "Upload failed");
                      const raw =
                        typeof uploadData?.url === "string"
                          ? uploadData.url.trim()
                          : "";
                      // Use Cloudinary (or any absolute) URL as-is — never prepend localhost/base (Instagram needs raw public URL)
                      const isAbsolute =
                        /^https?:\/\//i.test(raw) ||
                        raw.includes("cloudinary.com");
                      const base =
                        typeof window !== "undefined"
                          ? process.env.NEXT_PUBLIC_APP_URL ||
                            window.location.origin
                          : "";
                      const imageUrl = isAbsolute ? raw : base + raw;
                      const publishRes = await fetch("/api/instagram/publish", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          imageUrl: String(imageUrl),
                          caption: caption || undefined,
                        }),
                      });
                      const publishData = await publishRes.json();
                      if (!publishRes.ok) {
                        const msg = publishData.error ?? "Publish failed";
                        const isLocalhost =
                          typeof window !== "undefined" &&
                          window.location.origin.includes("localhost");
                        const hint = isLocalhost
                          ? " Set NEXT_PUBLIC_APP_URL to your public URL (e.g. ngrok) in .env and restart the dev server so Meta can fetch the image."
                          : "";
                        throw new Error(msg + hint);
                      }
                      setScheduleMessage({
                        type: "success",
                        text: "Posted to Instagram.",
                      });
                    } catch (e) {
                      setScheduleMessage({
                        type: "error",
                        text:
                          e instanceof Error ? e.message : "Schedule failed",
                      });
                    } finally {
                      setScheduleLoading(false);
                    }
                  } else if (hasInstagram && !firstImage) {
                    setScheduleMessage({
                      type: "error",
                      text: "Add at least one image to post to Instagram.",
                    });
                  } else {
                    setScheduleMessage({
                      type: "error",
                      text: "Schedule to TikTok/Facebook coming soon.",
                    });
                  }
                }}
              >
                {scheduleLoading ? (
                  "Posting…"
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" /> Schedule post
                  </>
                )}
              </Button>
              {selectedPlatforms.length > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                  → Post to{" "}
                  {selectedPlatforms
                    .map(id => PLATFORMS.find(x => x.id === id)?.label)
                    .join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "generate" && (
        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Template-based AI video
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Automation: script → captions (OpenAI), voiceover (ElevenLabs /
            TTS), stock (Pexels). No AI avatar yet (Phase 2).
          </p>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Script or idea
              </label>
              <textarea
                placeholder="Paste or type your script..."
                className="w-full min-h-[120px] px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Sparkles className="w-4 h-4 mr-2" /> Generate video
              </Button>
              {selectedPlatforms.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  → Post to{" "}
                  {selectedPlatforms
                    .map(id => PLATFORMS.find(x => x.id === id)?.label)
                    .join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "drafts" && (
        <div className="bg-secondary rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Drafts</h2>
          <div className="space-y-2">
            {mockPosts
              .filter(p => p.status === "draft")
              .map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{p.caption}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.platform}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      <Calendar className="w-4 h-4 mr-1" /> Schedule
                    </Button>
                  </div>
                </div>
              ))}
            {mockPosts.filter(p => p.status === "draft").length === 0 && (
              <p className="text-muted-foreground py-8 text-center">
                No drafts yet.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

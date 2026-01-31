/**
 * Instagram (Meta Graph API) – server-side only.
 * Uses INSTAGRAM_ACCESS_TOKEN from .env. Never expose the token to the client.
 * Supports profile fetch and Content Publishing (create post on your Instagram).
 */

const API_VERSION = "v21.0";
const BASE = "https://graph.instagram.com";
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export function hasInstagramToken(): boolean {
  return Boolean(TOKEN?.trim());
}

function getToken(): string | null {
  return TOKEN?.trim() || null;
}

export interface InstagramProfile {
  id: string;
  username?: string;
  account_type?: string;
  media_count?: number;
}

/**
 * Fetches the Instagram user profile.
 * @param accessToken - Optional. When provided (e.g. from DB per user), uses it; otherwise uses INSTAGRAM_ACCESS_TOKEN from .env.
 */
export async function getInstagramProfile(
  accessToken?: string
): Promise<
  { ok: true; profile: InstagramProfile } | { ok: false; error: string }
> {
  const token = accessToken ?? getToken();
  if (!token) {
    return {
      ok: false,
      error:
        "No Instagram access token (connect Instagram or set INSTAGRAM_ACCESS_TOKEN)",
    };
  }

  try {
    const url = `${BASE}/${API_VERSION}/me?fields=id,username,account_type,media_count&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url);

    if (!res.ok) {
      const body = await res.text();
      return {
        ok: false,
        error: `Instagram API error: ${res.status} ${body.slice(0, 200)}`,
      };
    }

    const profile = (await res.json()) as InstagramProfile;
    return { ok: true, profile };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: message };
  }
}

/** Result of creating a media container (step 1 before publishing). */
export interface CreateContainerResult {
  ok: true;
  containerId: string;
}

/**
 * Creates a media container for a single image (Content Publishing API).
 * Image must be publicly accessible. Returns container ID to use with publishToInstagram.
 * @param tokenOverride - Optional. When provided (e.g. from DB), uses it; otherwise uses .env token.
 */
export async function createImageContainer(
  igUserId: string,
  imageUrl: string,
  caption?: string,
  tokenOverride?: string
): Promise<CreateContainerResult | { ok: false; error: string }> {
  const token = tokenOverride ?? getToken();
  if (!token) {
    return {
      ok: false,
      error:
        "No Instagram access token (connect Instagram or set INSTAGRAM_ACCESS_TOKEN)",
    };
  }

  try {
    const url = `${BASE}/${API_VERSION}/${igUserId}/media`;
    // Meta requires snake_case: image_url (not imageUrl)
    const body: { image_url: string; caption?: string } = {
      image_url: imageUrl,
    };
    if (caption != null && caption !== "") body.caption = caption;

    const res = await fetch(
      `${url}?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = (await res.json()) as {
      id?: string;
      error?: { message?: string };
    };
    if (!res.ok) {
      return {
        ok: false,
        error: data.error?.message ?? `HTTP ${res.status}`,
      };
    }
    if (!data.id) {
      return { ok: false, error: "No container ID in response" };
    }
    return { ok: true, containerId: data.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: message };
  }
}

/**
 * Publishes a container to Instagram (Content Publishing API step 2).
 * Use the container ID from createImageContainer. Container must be in FINISHED state.
 * @param tokenOverride - Optional. When provided (e.g. from DB), uses it; otherwise uses .env token.
 */
export async function publishContainer(
  igUserId: string,
  containerId: string,
  tokenOverride?: string
): Promise<{ ok: true; mediaId: string } | { ok: false; error: string }> {
  const token = tokenOverride ?? getToken();
  if (!token) {
    return {
      ok: false,
      error:
        "No Instagram access token (connect Instagram or set INSTAGRAM_ACCESS_TOKEN)",
    };
  }

  try {
    const url = `${BASE}/${API_VERSION}/${igUserId}/media_publish`;
    const res = await fetch(
      `${url}?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creation_id: containerId }),
      }
    );

    const data = (await res.json()) as {
      id?: string;
      error?: { message?: string };
    };
    if (!res.ok) {
      return {
        ok: false,
        error: data.error?.message ?? `HTTP ${res.status}`,
      };
    }
    if (!data.id) {
      return { ok: false, error: "No media ID in response" };
    }
    return { ok: true, mediaId: data.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: message };
  }
}

/**
 * Options for per-user Instagram publish (OAuth token from DB).
 */
export interface InstagramPublishOptions {
  accessToken: string;
  igUserId: string;
}

/**
 * Creates and publishes a single image post to Instagram (full flow).
 * imageUrl must be publicly accessible (Meta will fetch it).
 * @param options - Optional. When provided (per-user OAuth token + IG user id from DB), uses them; otherwise uses .env token and fetches profile.
 */
export async function publishImageToInstagram(
  imageUrl: string,
  caption?: string,
  options?: InstagramPublishOptions
): Promise<{ ok: true; mediaId: string } | { ok: false; error: string }> {
  let igUserId: string;
  let token: string;

  if (options?.accessToken && options?.igUserId) {
    igUserId = options.igUserId;
    token = options.accessToken;
  } else {
    const profileResult = await getInstagramProfile();
    if (!profileResult.ok) {
      return { ok: false, error: profileResult.error };
    }
    igUserId = profileResult.profile.id;
    token = getToken()!;
  }

  const containerResult = await createImageContainer(
    igUserId,
    imageUrl,
    caption,
    token
  );
  if (!containerResult.ok) {
    return { ok: false, error: containerResult.error };
  }

  // Containers can take a few seconds to be ready; retry publish briefly.
  let lastError = "";
  for (let i = 0; i < 5; i++) {
    const publishResult = await publishContainer(
      igUserId,
      containerResult.containerId,
      token
    );
    if (publishResult.ok) {
      return { ok: true, mediaId: publishResult.mediaId };
    }
    lastError = publishResult.error;
    if (i < 4) await new Promise(r => setTimeout(r, 2000));
  }

  return { ok: false, error: lastError || "Publish failed" };
}

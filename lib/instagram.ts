/**
 * Instagram (Meta Graph API) – server-side only.
 * Uses per-user OAuth token only (from SocialAccount). No hardcoded .env token.
 */

const API_VERSION = "v21.0";
const BASE = "https://graph.instagram.com";

export interface InstagramProfile {
  id: string;
  username?: string;
  account_type?: string;
  media_count?: number;
}

/**
 * Fetches the Instagram user profile. Requires per-user OAuth access token (from Connect Instagram).
 */
export async function getInstagramProfile(
  accessToken: string
): Promise<
  { ok: true; profile: InstagramProfile } | { ok: false; error: string }
> {
  if (!accessToken?.trim()) {
    return {
      ok: false,
      error: "Connect Instagram (Accounts → Connect Instagram)",
    };
  }
  const token = accessToken.trim();

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
 * Image must be publicly accessible. Requires per-user OAuth access token.
 */
export async function createImageContainer(
  igUserId: string,
  imageUrl: string,
  caption: string | undefined,
  accessToken: string
): Promise<CreateContainerResult | { ok: false; error: string }> {
  if (!accessToken?.trim()) {
    return {
      ok: false,
      error: "Connect Instagram (Accounts → Connect Instagram)",
    };
  }
  const token = accessToken.trim();

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
 * Requires per-user OAuth access token.
 */
export async function publishContainer(
  igUserId: string,
  containerId: string,
  accessToken: string
): Promise<{ ok: true; mediaId: string } | { ok: false; error: string }> {
  if (!accessToken?.trim()) {
    return {
      ok: false,
      error: "Connect Instagram (Accounts → Connect Instagram)",
    };
  }
  const token = accessToken.trim();

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
 * Requires per-user OAuth token and IG user id (from Connect Instagram).
 */
export async function publishImageToInstagram(
  imageUrl: string,
  caption: string | undefined,
  options: InstagramPublishOptions
): Promise<{ ok: true; mediaId: string } | { ok: false; error: string }> {
  const { accessToken, igUserId } = options;
  if (!accessToken?.trim() || !igUserId?.trim()) {
    return {
      ok: false,
      error: "Connect Instagram (Accounts → Connect Instagram)",
    };
  }

  const token = accessToken.trim();

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

# Instagram Connect & Publish (Meta Graph API)

This app can **connect** to your Instagram account and **publish posts** using the official **Instagram Content Publishing API** (Meta Graph API). The token must come from the **correct OAuth flow** — you can’t reuse just any token.

---

## 0. Per-user OAuth (recommended for production)

Each user can connect **their own** Instagram account via OAuth. No shared token.

1. **Set in `.env`** (same Meta app as Facebook Login):
   - `FACEBOOK_APP_ID` – your Meta App ID
   - `FACEBOOK_APP_SECRET` – your Meta App Secret
   - `NEXT_PUBLIC_APP_URL` – your app URL (e.g. `https://yourapp.com` or `http://localhost:3001`)

2. **In Meta for Developers** → Your App → **Facebook Login** → **Settings**:
   - **Valid OAuth Redirect URIs** must include:  
     `https://yourapp.com/api/auth/instagram/callback`  
     (or `http://localhost:3001/api/auth/instagram/callback` for local dev)

3. **User flow**: User is logged in → **Accounts** → **Connect** (Instagram) → redirects to Meta → user approves → redirects back to **Accounts** with Instagram connected. Token is stored **per user** in the database (`SocialAccount`).

4. **Publishing**: When a user posts from the Create page, the app uses **that user’s** stored token. No hardcoded token for other users.

5. **App Review**: For real users (not just test users), submit your app for **Meta App Review** and request `instagram_content_publish`, `instagram_basic`, `pages_show_list`, `pages_read_engagement`. Until then, only test users can connect.

**Dev fallback**: You can still set `INSTAGRAM_ACCESS_TOKEN` in `.env` for a single-account dev setup. If a user has connected via OAuth, their token is used instead.

---

## 1. Can you use an Instagram access token in this app?

**Yes**, if the token was:

- Generated through the **official Meta OAuth flow** for **your** Meta App
- Has **Instagram Graph API** (Business/Creator) permissions: `instagram_basic`, `instagram_content_publish`
- Is a **long-lived** user access token (or page access token with Instagram Business account linked)

**No**, if:

- You copied a token from browser dev tools
- You used a third-party site to generate it
- The token belongs to another app or is short-lived / expired

Those will fail or get your app blocked.

---

## 2. Requirements

- **Instagram Business or Creator account** (personal accounts need to be converted or use Basic Display, which has different limits)
- **Facebook Page** linked to that Instagram account (required for Content Publishing with Facebook Login)
- **Meta App** (Facebook Developer) with:
  - **Instagram Graph API** product
  - **Content Publishing** (and optionally Basic Display) enabled
  - Permissions: `instagram_basic`, `instagram_content_publish` (and for Facebook Login: `pages_show_list`, `pages_read_engagement`, etc. as per [Meta’s Content Publishing guide](https://developers.facebook.com/docs/instagram-api/guides/content-publishing))

---

## 3. Meta App setup (high level)

1. Go to [Meta for Developers](https://developers.facebook.com/) → **My Apps** → **Create App** (or use an existing one).
2. Add product **Instagram Graph API** (and **Facebook Login** if you use Facebook Login for Business).
3. Configure **Facebook Login** (e.g. Valid OAuth Redirect URIs) if you use OAuth in your app.
4. Request **Advanced Access** for:
   - `instagram_basic`
   - `instagram_content_publish`
5. Ensure the Instagram account is a **Business/Creator** account and is **linked to a Facebook Page** (required for publishing).

---

## 4. Getting a long-lived access token

You must obtain the token via **your** app’s OAuth flow (or Meta’s tools for testing):

- **Option A – Facebook Login for Business**  
  User logs in with Facebook; your app gets a Page access token for the Page connected to the Instagram account. Use that token with `graph.facebook.com` (see [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-api/instagram-api-with-facebook-login)).

- **Option B – Instagram Login / Basic Display**  
  User logs in with Instagram; your app gets an Instagram user access token. Exchange short-lived for long-lived and use with `graph.instagram.com`.

This app currently supports a **single token** in `.env` (see below). For multi-user, you would store one token per user (e.g. in `SocialAccount` or similar) and use that when calling the publish API.

---

## 5. Environment variable (single-account)

Store the token **only** in `.env` (never commit it):

```env
# Long-lived Instagram (or Page) access token with instagram_content_publish
INSTAGRAM_ACCESS_TOKEN="your-long-lived-access-token"
```

Restart the dev server after changing `.env`.

---

## 6. How this app uses the token

- **Server-side only**  
  The token is read from `process.env.INSTAGRAM_ACCESS_TOKEN` in API routes and in `lib/instagram.ts`. It is never sent to the browser.

- **Endpoints:**
  - **GET /api/instagram/profile**  
    Returns the Instagram account (id, username, etc.) for the configured token.
  - **POST /api/instagram/publish**  
    Publishes a single image to Instagram (Content Publishing API).

---

## 7. Publishing a post (create post in this app → upload to Instagram)

### API: POST /api/instagram/publish

**Body (JSON):**

```json
{
  "imageUrl": "https://example.com/public-image.jpg",
  "caption": "Optional caption text"
}
```

- **imageUrl** (required): Must be a **publicly accessible** URL. Meta’s servers fetch the image from this URL. Use HTTPS and a URL that returns the image with no auth. When developing locally, set **`NEXT_PUBLIC_APP_URL`** in `.env` to your public URL (e.g. ngrok) so the Create page sends a fetchable URL to Instagram.
- **caption** (optional): Caption for the post.

**Example (fetch):**

```js
const res = await fetch("/api/instagram/publish", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    imageUrl: "https://example.com/photo.jpg",
    caption: "Posted from Creator Studio",
  }),
});
const data = await res.json();
// { success: true, mediaId: "...", message: "Post published to Instagram" }
```

**Limitations (from Meta):**

- Image must be **publicly accessible** at publish time.
- Supported image format: **JPEG** (others may not work).
- Rate limits apply (e.g. 100 API-published posts per 24 hours per account).
- Container must be published within **24 hours** of creation.

---

## 8. Public image URL: Cloudinary (recommended)

Instagram requires a **publicly accessible** image URL. The app can upload images to **Cloudinary** so Meta can fetch them from anywhere (no ngrok or deploy needed).

1. Sign up at [cloudinary.com](https://cloudinary.com) and get your **Cloud name**, **API Key**, and **API Secret** from the dashboard.
2. Add to **`.env`**:
   - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
   - `CLOUDINARY_API_KEY=your_api_key`
   - `CLOUDINARY_API_SECRET=your_api_secret`
3. Restart the dev server. The **Create** page upload will then send images to Cloudinary and use the returned public URL for Instagram.

If Cloudinary is not configured, uploads go to local `public/uploads` and you must set **`NEXT_PUBLIC_APP_URL`** to a public URL (e.g. ngrok) for Instagram to work.

---

## 9. Flow summary

1. Create a **Meta App** and enable **Instagram Graph API** + **Content Publishing**.
2. Get a **long-lived** access token via **your** OAuth flow (or Meta’s tools for testing).
3. Put the token in **`.env`** as **`INSTAGRAM_ACCESS_TOKEN`**.
4. (Optional) Add **Cloudinary** credentials to `.env` so uploads are public; or set **`NEXT_PUBLIC_APP_URL`** for local dev.
5. Use **GET /api/instagram/profile** to confirm the account.
6. Use **POST /api/instagram/publish** (or the Create page) with a public **imageUrl** to post to your **actual Instagram** feed.

For full details and latest limits, see [Meta’s Content Publishing guide](https://developers.facebook.com/docs/instagram-api/guides/content-publishing) and [Error Codes](https://developers.facebook.com/docs/instagram-api/reference/error-codes).

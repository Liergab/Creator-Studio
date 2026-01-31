# OAuth Setup Guide (Google, Facebook)

This app supports OAuth authentication via **Google** and **Facebook** using Passport.js strategies.

---

## 1. Environment Variables

Add these to your `.env` file:

```env
# App URL (for OAuth callbacks)
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Change to your production URL

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-jwt-secret-key-change-in-production"

# Instagram uses the same Meta app (FACEBOOK_APP_ID / FACEBOOK_APP_SECRET) via OAuth; no separate token.
```

### Instagram (OAuth only)

Instagram is connected via **OAuth** only (Accounts → Connect Instagram). Use the same **FACEBOOK_APP_ID** and **FACEBOOK_APP_SECRET**. Add the Instagram callback to **Valid OAuth Redirect URIs** in Meta: `https://your-domain.com/api/auth/instagram/callback`. See **docs/INSTAGRAM_SETUP.md** for full setup.

---

## 2. Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**:
   - Navigate to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/google/callback
     https://yourdomain.com/api/auth/google/callback  (for production)
     ```
5. Copy the **Client ID** and **Client Secret** to your `.env`

---

## 3. Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Choose **Consumer** or **Business** type
4. Fill in app details (name, contact email)

### Step 2: Configure OAuth

1. In your app dashboard, go to **Settings** → **Basic**
2. Add **App Domains**: `localhost` (and your production domain)
3. Add **Website** → **Site URL**: `http://localhost:3000`
4. Go to **Products** → **Facebook Login** → **Settings**
5. Add **Valid OAuth Redirect URIs**:
   ```
   http://localhost:3000/api/auth/facebook/callback
   https://yourdomain.com/api/auth/facebook/callback  (for production)
   ```
6. Copy **App ID** and **App Secret** from **Settings** → **Basic** to your `.env`

---

## 4. How It Works

### Flow

1. **User clicks "Google" or "Facebook"** on login page
2. **Redirects to provider** (`/api/auth/google` or `/api/auth/facebook`)
3. **User authorizes** on provider's site
4. **Provider redirects back** to callback URL with authorization code
5. **Callback route** exchanges code for access token
6. **Fetches user profile** from provider API
7. **Creates/updates user** in MongoDB via Prisma
8. **Creates JWT session** stored in HTTP-only cookie
9. **Redirects user** to dashboard (or `/admin` for super_admin)

### User Model

Users created via OAuth have:

- `provider`: `"google"` or `"facebook"`
- `providerId`: Provider's unique user ID
- `email`, `name`, `avatar`: From provider profile
- `role`: Defaults to `"user"` (can be changed by admin)

### Session Management

- **JWT tokens** stored in HTTP-only cookies (7-day expiry)
- **Cookie name**: `creator-studio-session`
- **Client-side**: AuthContext checks `/api/auth/session` on mount
- **Server-side**: Use `getSessionCookie()` from `@/lib/oauth`

---

## 5. API Routes

| Route                         | Method | Description                       |
| ----------------------------- | ------ | --------------------------------- |
| `/api/auth/google`            | GET    | Initiate Google OAuth             |
| `/api/auth/google/callback`   | GET    | Handle Google OAuth callback      |
| `/api/auth/facebook`          | GET    | Initiate Facebook OAuth           |
| `/api/auth/facebook/callback` | GET    | Handle Facebook OAuth callback    |
| `/api/auth/session`           | GET    | Get current session (from cookie) |
| `/api/auth/logout`            | POST   | Clear session cookie              |

---

## 6. Testing

### Local Development

1. Set up OAuth apps (Google/Facebook) with `http://localhost:3000` as redirect URI
2. Add credentials to `.env`
3. Start dev server: `pnpm run dev`
4. Go to `/login`
5. Click **Google** or **Facebook** button
6. Authorize on provider's site
7. Should redirect back and log you in

### Production

1. Update `NEXT_PUBLIC_APP_URL` to your production domain
2. Add production redirect URIs to Google/Facebook apps
3. Ensure `JWT_SECRET` is a strong random string
4. Set `secure: true` in cookie settings (already handled in code)

---

## 7. Adding More Providers

To add more OAuth providers (e.g., GitHub, Twitter/X):

1. **Install strategy**: `pnpm add passport-github2` (or similar)
2. **Add env vars**: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
3. **Create routes**:
   - `app/api/auth/github/route.ts` (initiate)
   - `app/api/auth/github/callback/route.ts` (callback)
4. **Follow same pattern** as Google/Facebook routes
5. **Add button** to login page

---

## 8. Troubleshooting

### "OAuth not configured"

- Check `.env` has `GOOGLE_CLIENT_ID` / `FACEBOOK_APP_ID`
- Restart dev server after adding env vars

### "Redirect URI mismatch"

- Ensure callback URL in provider settings matches exactly:
  - `http://localhost:3000/api/auth/google/callback` (no trailing slash)
- Check `NEXT_PUBLIC_APP_URL` matches your dev server URL

### "No email in profile"

- Google: Ensure `profile email` scope is requested
- Facebook: Check app permissions include `email`

### Session not persisting

- Check browser allows cookies
- Verify `JWT_SECRET` is set
- Check cookie settings (httpOnly, sameSite)

---

## 9. Security Notes

- **Never commit** `.env` file (already in `.gitignore`)
- **Use strong JWT_SECRET** in production (32+ random bytes)
- **HTTPS required** in production (cookies use `secure: true`)
- **OAuth tokens** are not stored - only user profile data
- **Provider IDs** are unique per provider to prevent conflicts

---

## 10. Example: Using OAuth User in API Routes

```typescript
import { getSessionCookie } from "@/lib/oauth";

export async function GET(request: Request) {
  const user = await getSessionCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use user.id, user.email, user.role, etc.
  return NextResponse.json({ message: `Hello ${user.name}!` });
}
```

---

## Next Steps

- ✅ OAuth setup complete
- 🔄 Add password hashing for local auth (bcrypt)
- 🔄 Add email verification
- 🔄 Add "Remember me" option
- 🔄 Add account linking (connect multiple OAuth providers)

# Meta App Review – Legal URLs

For **Facebook Login** and **Instagram** (Meta) app review, you must provide publicly accessible URLs for:

- **Privacy Policy**
- **Terms of Service**
- **Data Deletion Instructions**

This app includes these pages. Use your **deployment base URL** (e.g. Vercel) when filling the Meta App Dashboard.

---

## URLs to paste in Meta App Dashboard

Replace `https://your-app-domain.com` with your actual app URL (e.g. `https://creator-studio-xxx.vercel.app` or your production domain).

| Field in Meta                      | URL                                         |
| ---------------------------------- | ------------------------------------------- |
| **Privacy Policy URL**             | `https://your-app-domain.com/privacy`       |
| **Terms of Service URL**           | `https://your-app-domain.com/terms`         |
| **Data Deletion Instructions URL** | `https://your-app-domain.com/data-deletion` |

---

## Where to add them in Meta for Developers

1. Go to [Meta for Developers](https://developers.facebook.com/) → **My Apps** → your app.
2. **App Review** (or **Use cases** / **Permissions and features**): when you add Facebook Login or Instagram, Meta may ask for these URLs.
3. **App Dashboard** → **Settings** → **Basic**: some sections ask for **Privacy Policy URL** and **Terms of Service URL**.
4. **Facebook Login** → **Settings** (or **App Review**): **Data Deletion Instructions URL** is often required; paste the `/data-deletion` URL.

---

## Local testing

- Local: `http://localhost:3001/privacy`, `http://localhost:3001/terms`, `http://localhost:3001/data-deletion`
- Meta requires **public** URLs, so use your deployed (e.g. Vercel) URLs in the dashboard, not localhost.

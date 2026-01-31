import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Creator Studio",
  description:
    "Privacy Policy for Creator Studio – how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to app
      </Link>
      <article className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>

        <h2>1. Introduction</h2>
        <p>
          Creator Studio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
          respects your privacy. This Privacy Policy explains how we collect,
          use, store, and protect your information when you use our app,
          including when you connect your Facebook, Google, or Instagram
          accounts.
        </p>

        <h2>2. Information We Collect</h2>
        <ul>
          <li>
            <strong>Account data:</strong> When you sign in with Google or
            Facebook, we receive your email, name, and profile picture from the
            provider. We store this to create and manage your account.
          </li>
          <li>
            <strong>Instagram / social data:</strong> If you connect Instagram
            (via Meta/Facebook), we receive and store the access token and
            Instagram business account ID needed to publish posts and read your
            profile on your behalf. We do not store your Instagram password.
          </li>
          <li>
            <strong>Content you create:</strong> Captions, scheduled posts, and
            uploaded media (e.g. images) that you submit through the app are
            stored so we can publish them to the platforms you choose.
          </li>
          <li>
            <strong>Usage data:</strong> We may log general usage (e.g. API
            errors) to improve the service. We do not sell your personal data.
          </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide login and account management</li>
          <li>
            Connect and manage your connected social accounts (e.g. Instagram)
          </li>
          <li>Publish content you schedule (e.g. posts to Instagram)</li>
          <li>Display your profile and connected accounts in the app</li>
          <li>Comply with law and protect our rights</li>
        </ul>

        <h2>4. Data Sharing</h2>
        <p>
          We do not sell your personal data. We share data only as needed to
          operate the service: for example, we send your content and credentials
          to Meta/Instagram and Google when you use their features. Those
          providers have their own privacy policies.
        </p>

        <h2>5. Data Retention & Deletion</h2>
        <p>
          We retain your account and connected-account data until you delete
          your account or disconnect a service. You may request deletion of your
          data at any time; see our{" "}
          <Link href="/data-deletion" className="text-primary underline">
            Data Deletion Instructions
          </Link>
          .
        </p>

        <h2>6. Security</h2>
        <p>
          We use industry-standard measures (e.g. HTTPS, secure storage of
          tokens) to protect your data. Access tokens are stored securely and
          used only to perform actions you authorize.
        </p>

        <h2>7. Your Rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, or
          delete your data, or to object to processing. Contact us using the
          details below to exercise these rights.
        </p>

        <h2>8. Changes</h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last
          updated&quot; date at the top will reflect the latest version. We
          encourage you to review this page periodically.
        </p>

        <h2>9. Contact</h2>
        <p>
          For privacy-related questions or requests, contact us at the support
          email or contact method provided in the app or on our website.
        </p>
      </article>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion Instructions | Creator Studio",
  description:
    "How to request deletion of your data from Creator Studio (required for Meta/Facebook app compliance).",
};

export default function DataDeletionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to app
      </Link>
      <article className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <h1 className="text-3xl font-bold">Data Deletion Instructions</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>

        <p>
          Creator Studio allows you to control and delete your data. This page
          explains how to delete your data from our app. This is required
          information for apps that use Facebook Login and the Meta (Instagram)
          platform.
        </p>

        <h2>What Data We Store</h2>
        <ul>
          <li>
            Your account info (email, name, profile picture) from Google or
            Facebook login
          </li>
          <li>Connected social accounts (e.g. Instagram) and related tokens</li>
          <li>
            Content you create (captions, scheduled posts, uploaded images)
          </li>
          <li>Usage-related data (e.g. logs) where applicable</li>
        </ul>

        <h2>How to Delete Your Data</h2>

        <h3>Option 1: Disconnect Instagram (or other connected accounts)</h3>
        <p>
          In the app, go to <strong>Accounts</strong>, find Instagram (or other
          connected platform), and click <strong>Disconnect</strong>. This
          removes the stored access token and connection from our system. We
          will no longer be able to post or read data for that account.
        </p>

        <h3>Option 2: Request full account and data deletion</h3>
        <p>To delete your entire account and all associated data:</p>
        <ol>
          <li>
            <strong>Contact us</strong> at the support email or contact method
            provided in the app or on our website. Use the same email address
            that you use to sign in to Creator Studio.
          </li>
          <li>
            <strong>Subject line:</strong> &quot;Data Deletion Request&quot; (or
            &quot;Account Deletion Request&quot;).
          </li>
          <li>
            <strong>In the message:</strong> Clearly state that you want to
            delete your Creator Studio account and all data associated with it.
            Include the email address linked to your account so we can identify
            it.
          </li>
          <li>
            We will process your request within a reasonable period (typically
            within 30 days). We will delete or anonymize your account and
            associated data, including connected social account tokens and
            content you created.
          </li>
        </ol>

        <h2>What We Delete</h2>
        <p>When you request account deletion, we will:</p>
        <ul>
          <li>Delete your user account and profile information</li>
          <li>
            Remove all stored tokens for connected platforms (Facebook,
            Instagram, etc.)
          </li>
          <li>
            Delete or anonymize content you created (e.g. captions, scheduled
            posts)
          </li>
          <li>
            Remove records linking your identity to the app, except where we
            must retain data for legal or legitimate operational reasons (e.g.
            backups for a limited period)
          </li>
        </ul>

        <h2>Facebook / Meta Users</h2>
        <p>
          If you signed in with Facebook or connected your Instagram account via
          Meta: after we delete your data, we will no longer have access to your
          Facebook or Instagram data. To revoke our app&apos;s access from
          Facebook&apos;s side, you can use Facebook&apos;s settings:{" "}
          <a
            href="https://www.facebook.com/settings?tab=applications"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Facebook → Settings → Apps and Websites
          </a>
          . Remove &quot;Creator Studio&quot; (or our app name) from your
          authorized apps.
        </p>

        <h2>Questions</h2>
        <p>
          For any questions about data deletion or your privacy, contact us at
          the support email or contact method provided in the app or on our
          website.
        </p>
      </article>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Creator Studio",
  description:
    "Terms of Service for Creator Studio – rules and conditions for using the app.",
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to app
      </Link>
      <article className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>

        <h2>1. Acceptance</h2>
        <p>
          By using Creator Studio (&quot;the App&quot;), you agree to these
          Terms of Service. If you do not agree, do not use the App.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Creator Studio lets you connect social accounts (e.g. Instagram via
          Meta/Facebook, and Google for login), create and schedule content, and
          manage your presence. We use official APIs (e.g. Meta Graph API,
          Google OAuth) in accordance with each platform&apos;s policies.
        </p>

        <h2>3. Your Account and Responsibilities</h2>
        <ul>
          <li>
            You must provide accurate information and keep your account secure.
          </li>
          <li>You are responsible for all activity under your account.</li>
          <li>
            You must comply with the terms and policies of Facebook, Instagram,
            Google, and any other platform you connect.
          </li>
          <li>
            You must not use the App for spam, illegal content, or to violate
            others&apos; rights.
          </li>
        </ul>

        <h2>4. Connected Platforms</h2>
        <p>
          When you connect Facebook, Google, or Instagram, you authorize us to
          access and use the data and permissions you grant (e.g. to publish
          posts). Your use of those platforms remains subject to their terms and
          policies. We are not responsible for their services or policies.
        </p>

        <h2>5. Content You Submit</h2>
        <p>
          You retain ownership of content you upload or create. By using the
          App, you grant us the rights necessary to store, process, and publish
          that content to the platforms you select. You must not submit content
          that infringes others&apos; rights or violates law or platform rules.
        </p>

        <h2>6. Acceptable Use</h2>
        <p>
          You may not use the App to: violate any law; abuse, harm, or attempt
          to gain unauthorized access to any system or account; distribute
          malware or spam; or scrape or automate access in ways not permitted by
          our or third-party terms.
        </p>

        <h2>7. Availability and Changes</h2>
        <p>
          We strive to keep the App available but do not guarantee uptime. We
          may change, suspend, or discontinue features with reasonable notice
          where feasible.
        </p>

        <h2>8. Disclaimer of Warranties</h2>
        <p>
          The App is provided &quot;as is.&quot; We disclaim warranties to the
          extent permitted by law. We do not guarantee that the App will be
          error-free or that results from connected platforms will meet your
          expectations.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, we are not liable for
          indirect, incidental, special, or consequential damages, or for loss
          of data or profits, arising from your use of the App or connected
          platforms.
        </p>

        <h2>10. Termination</h2>
        <p>
          We may suspend or terminate your access if you breach these Terms. You
          may stop using the App and request deletion of your data at any time
          (see our{" "}
          <Link href="/data-deletion" className="text-primary underline">
            Data Deletion Instructions
          </Link>
          ).
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We may update these Terms. The &quot;Last updated&quot; date will
          change. Continued use of the App after changes constitutes acceptance.
          We encourage you to review this page periodically.
        </p>

        <h2>12. Contact</h2>
        <p>
          For questions about these Terms, contact us at the support email or
          contact method provided in the App or on our website.
        </p>
      </article>
    </div>
  );
}

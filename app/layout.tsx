import type { Metadata } from "next";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Providers } from "@/components/Providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Creator Studio | Connect, Create, Schedule & Grow",
  description: "Connect TikTok & Instagram. Auto-create videos. Schedule & post daily. Track performance & income.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}

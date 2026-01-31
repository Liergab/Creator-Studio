"use client";

import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" switchable>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <Toaster />
          {process.env.NODE_ENV !== "production" && (
            <Script
              src="/__manus__/debug-collector.js"
              strategy="afterInteractive"
            />
          )}
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

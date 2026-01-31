"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser } from "@/lib/auth-credentials";
import {
  validateCredentials,
  getStoredUser,
  setStoredUser,
} from "@/lib/auth-credentials";

type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check localStorage first (for demo credentials)
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setIsReady(true);
      return;
    }

    // Check session cookie (for OAuth)
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setStoredUser(data.user); // Sync to localStorage
        }
        setIsReady(true);
      })
      .catch(() => setIsReady(true));
  }, []);

  const login = (email: string, password: string): LoginResult => {
    const u = validateCredentials(email, password);
    if (u) {
      setUser(u);
      setStoredUser(u);
      return { ok: true, user: u };
    }
    return { ok: false, error: "Invalid email or password." };
  };

  const logout = async () => {
    setUser(null);
    setStoredUser(null);
    // Clear session cookie
    await fetch("/api/auth/logout", { method: "POST" });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

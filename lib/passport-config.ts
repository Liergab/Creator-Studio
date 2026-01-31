import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "";
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

// Google OAuth Strategy
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${APP_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(
              new Error("No email found in Google profile"),
              undefined
            );
          }

          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || profile.name?.givenName || "User",
                avatar: profile.photos?.[0]?.value,
                provider: "google",
                providerId: profile.id,
                role: "user",
              },
            });
          } else if (!user.provider || user.provider !== "google") {
            // Update existing user with OAuth info
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                provider: "google",
                providerId: profile.id,
                avatar: profile.photos?.[0]?.value || user.avatar,
              },
            });
          }

          return done(null, {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as Role,
            avatar: user.avatar || undefined,
          });
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
}

// Facebook OAuth Strategy
if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: `${APP_URL}/api/auth/facebook/callback`,
        profileFields: ["id", "displayName", "email", "picture"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(
              new Error("No email found in Facebook profile"),
              undefined
            );
          }

          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || "User",
                avatar: profile.photos?.[0]?.value,
                provider: "facebook",
                providerId: profile.id,
                role: "user",
              },
            });
          } else if (!user.provider || user.provider !== "facebook") {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                provider: "facebook",
                providerId: profile.id,
                avatar: profile.photos?.[0]?.value || user.avatar,
              },
            });
          }

          return done(null, {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as Role,
            avatar: user.avatar || undefined,
          });
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
}

export default passport;

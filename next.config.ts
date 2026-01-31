import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve @/ and @shared aliases (tsconfig paths)
  transpilePackages: [],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
};

export default nextConfig;

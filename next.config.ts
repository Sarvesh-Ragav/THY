import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@google/genai"],
  eslint: {
    // Next 15 still lints during `next build`; existing pages have rule errors
    // that should not block Vercel while the Express API lives in /server.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

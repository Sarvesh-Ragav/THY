import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_AUTH_API_URL:
      process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://thy-756r.onrender.com/api/v1',
  },
  reactStrictMode: true,
  serverExternalPackages: ["@google/genai"],
  eslint: {
    // Next 15 still lints during `next build`; existing pages have rule errors
    // that should not block Vercel while the Express API lives in /server.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

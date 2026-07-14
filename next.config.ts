import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel handles deployment natively — no output config needed */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

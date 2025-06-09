import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  domains: ['images.unsplash.com'],
  env: {
    NEXT_GEMINI_KEY: process.env.NEXT_GEMINI_KEY,
  },
};

export default nextConfig;

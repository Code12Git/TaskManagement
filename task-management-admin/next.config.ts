import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_GEMINI_KEY: process.env.NEXT_GEMINI_KEY,
  },
  domains: ['images.unsplash.com'],
  
};

export default nextConfig;

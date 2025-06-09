import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_GEMINI_KEY: process.env.NEXT_GEMINI_KEY,
  },
  images: {
    domains: ['res.cloudinary.com','images.unsplash.com'],
  },
};

export default nextConfig;

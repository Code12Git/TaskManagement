import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_GEMINI_KEY: process.env.NEXT_GEMINI_KEY,
    NEXT_PUBLIC_API_BASE_URL : process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  images: {
    domains: ['res.cloudinary.com','images.unsplash.com'],
  },
};

export default nextConfig;

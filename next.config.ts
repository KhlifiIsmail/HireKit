import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for pdfjs-dist in Next.js
    if (isServer) {
      config.resolve.alias.canvas = false;
    }

    return config;
  },
};

export default nextConfig;

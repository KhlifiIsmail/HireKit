import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias.canvas = false;
      config.externals.push({
        canvas: 'canvas',
      });
    }
    
    return config;
  },
};

export default nextConfig;

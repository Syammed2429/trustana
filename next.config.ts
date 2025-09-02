import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // Optimize for production
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
  },

  // Enable static optimization
  trailingSlash: false,

  // Configure compression
  compress: true,
};

export default nextConfig;

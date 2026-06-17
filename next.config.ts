import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production build output
  distDir: ".next",
  
  // Use Turbopack (default in Next.js 16)
  turbopack: {},

  // Image optimization
  images: {
    remotePatterns: [],
    formats: ["image/webp", "image/avif"],
  },

  // Security headers for production
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ],
    },
  ],

  // Performance optimizations
  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  reactStrictMode: false,

  // Cache configuration for high-traffic
  onDemandEntries: {
    maxInactiveAge: 60000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;

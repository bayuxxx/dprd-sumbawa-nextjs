import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow accessing the dev server from local network IPs
  allowedDevOrigins: ['192.168.1.4', 'localhost'],

  // Allow serving uploaded images
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'dprd-sumbawabaratkab.go.id' },
    ],
  },
  // Serve /uploads from the public directory
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;

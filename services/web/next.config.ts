import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["[::1]"],
  // Poll for edits because Docker bind mounts can miss filesystem events.
  watchOptions: {
    pollIntervalMs: 500,
  },
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.API_URL ?? 'http://localhost:3001'}/:path*`, // Strips /api/proxy automatically
      },
    ];
  },
};

export default nextConfig;

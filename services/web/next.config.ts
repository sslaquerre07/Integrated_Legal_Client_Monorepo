import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["[::1]"],
  // Poll for edits because Docker bind mounts can miss filesystem events.
  watchOptions: {
    pollIntervalMs: 500,
  },
  output: "standalone",
};

export default nextConfig;

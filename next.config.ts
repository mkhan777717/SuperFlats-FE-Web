import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server in .next/standalone, for the Docker image (see Dockerfile and DEPLOY.md)
  output: "standalone",
  images: {
    // Listing, flat and profile photos are uploaded by the backend to Firebase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
    qualities: [60, 75, 90],
  },
};

export default nextConfig;

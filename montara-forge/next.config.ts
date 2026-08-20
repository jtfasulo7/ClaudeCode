import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // This project lives inside a larger workspace with its own lockfile;
  // pin the root so Turbopack doesn't trace the parent directory.
  turbopack: { root: path.resolve(__dirname) },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
};

export default nextConfig;

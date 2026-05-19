import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Lock the workspace root to this directory to avoid Next.js picking up
    // the parent ClaudeCode lockfile.
    root: path.resolve(),
  },
};

export default nextConfig;

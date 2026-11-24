import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Full client-side static export: no Node server needed at judging time.
  // cacheComponents/partialPrefetching (PPR) are intentionally omitted —
  // Next.js 16 fails the build with "PPR cannot be enabled in export mode".
  output: "export",
  images: { unoptimized: true },
  // Keep this block: Tailwind v4 is processed here (no postcss.config.mjs).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

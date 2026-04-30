import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  /* Turbopack resolve configuration for monorepo setup.
     Ensures CSS @import "tailwindcss" and other packages
     resolve from frontend/node_modules, not the monorepo root. */
  turbopack: {
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
      "tw-animate-css": path.resolve(__dirname, "node_modules/tw-animate-css"),
      "@tailwindcss/postcss": path.resolve(
        __dirname,
        "node_modules/@tailwindcss/postcss"
      ),
    },
  },
  /* Webpack resolve aliases — same fix for non-Turbopack builds. */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
      "tw-animate-css": path.resolve(__dirname, "node_modules/tw-animate-css"),
      "@tailwindcss/postcss": path.resolve(
        __dirname,
        "node_modules/@tailwindcss/postcss"
      ),
    };
    return config;
  },
};

export default nextConfig;

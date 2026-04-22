import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * React Compiler — stable in Next.js 16.
   * Automatically memoizes components and hooks.
   * Eliminates the need for useCallback, useMemo, React.memo.
   * Uses SWC-optimized analysis: only compiles relevant files.
   */
  reactCompiler: true,

  experimental: {
    typedRoutes: true,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "media.licdn.com" },
    ],
  },
};

export default nextConfig;

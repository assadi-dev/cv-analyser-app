import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],

  test: {
    /**
     * jsdom simulates the browser DOM environment for component tests.
     */
    environment: "jsdom",

    /**
     * Globals = true — vi, describe, it, expect, beforeEach, afterEach
     * are available without explicit imports in every test file.
     */
    globals: true,

    setupFiles: ["./vitest.setup.ts"],

    include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],

    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/app/api/**",
        "src/types/**",
      ],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

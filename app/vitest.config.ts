import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "server-only": "next/dist/compiled/server-only/empty.js" } },
  test: {
    environment: "node", setupFiles: ["./tests/offline-setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    clearMocks: true,
    // Bound Windows worker contention; retain existing test deadlines and isolation.
    maxWorkers: 2,
  },
});

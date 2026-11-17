import { defineConfig, devices } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "3100";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: Boolean(process.env.CI),
  use: { baseURL: "http://127.0.0.1:" + port, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    env: { CAPSTONE_OFFLINE_TESTS: "1" },
    command: "npm run start -- --hostname 127.0.0.1 --port " + port,
    url: "http://127.0.0.1:" + port,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});

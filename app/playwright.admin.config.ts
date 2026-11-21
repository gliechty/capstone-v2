import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
export default defineConfig({ testDir: './tests/admin-e2e', workers: 1, fullyParallel: false, retries: 0, timeout: 120000,
    use: { actionTimeout: 15000, baseURL: 'http://localhost:3207', trace: 'retain-on-failure' }, projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: { command: 'npm run dev -- --hostname 127.0.0.1 --port 3207', url: 'http://localhost:3207/admin', reuseExistingServer: false, timeout: 120000,
        env: { CAPSTONE_OFFLINE_TESTS: '1', RECOMMENDATION_PROVIDER: 'disabled', MOSAIC_ADMIN_ENABLED: '1', MOSAIC_DEV_IDENTITY: '1', MOSAIC_SUPER_ADMIN_EMAIL: 'owner@example.test', BETTER_AUTH_URL: 'http://localhost:3207', MOSAIC_NEXT_DIST: 'admin-test', MOSAIC_ADMIN_DATA_DIR: path.resolve('.local', 'admin-e2e-' + Date.now()), GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '' } } });


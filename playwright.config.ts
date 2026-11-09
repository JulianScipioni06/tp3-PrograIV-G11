import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 30000,
    use: {
    baseURL: 'http://localhost:5173',
    channel: 'chrome',
    },
    webServer: [
    {
        command: 'NODE_ENV=test pnpm_config_pm_on_fail=ignore pnpm tsx src/server.ts',
        url: 'http://localhost:3000/health',
        reuseExistingServer: true,
    },
    {
        command: 'pnpm_config_pm_on_fail=ignore pnpm --dir frontend dev',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
    },
    ],
})  
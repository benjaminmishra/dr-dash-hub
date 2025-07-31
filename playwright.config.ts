import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'playwright',
  fullyParallel: true,
  webServer: {
    command: 'npm run build && npx vite preview --port 12000',
    url: 'http://localhost:12000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  use: {
    baseURL: 'http://localhost:12000',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

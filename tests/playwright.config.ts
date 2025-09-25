import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // Run only Playwright specs inside this directory
  testDir: __dirname,
  testMatch: '**/*.spec.ts',
  // Ignore anything that looks like a unit test naming pattern globally
  testIgnore: ['**/*.test.*'],
  // Directory for snapshots (kept under tests/__snapshots__ for organization)
  snapshotDir: './__snapshots__',
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    cwd: __dirname.replace(/\\tests$/, ''),
  },
  reporter: [['list']],
})
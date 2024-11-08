import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 1500000,
  retries: 0,
  workers: 1, // Run tests serially
  reporter: [['html', { outputFolder: 'test-results', open: 'never' }]], // Generates HTML reports in `test-results` folder
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    screenshot: 'on', 
    trace: 'on' 
  },
});

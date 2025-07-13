const { defineConfig } = require('@playwright/test');
const { baseConfig } = require('@igautomation/agentsyncprofessionalservices/config');

module.exports = defineConfig({
  ...baseConfig,
  testDir: './tests',
  use: {
    ...baseConfig.use,
    baseURL: process.env.BASE_URL || 'https://example.com',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
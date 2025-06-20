const { defineConfig } = require('@playwright/test');
const { baseConfig } = require('@igautomation/agentsyncprofessionalservices/config');
const path = require('path');

module.exports = defineConfig({
  ...baseConfig,
  testDir: './tests',
  use: {
    ...baseConfig.use,
    storageState: './auth/salesforce-storage-state.json',
  },
  globalSetup: require.resolve('./global-setup.js'),
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
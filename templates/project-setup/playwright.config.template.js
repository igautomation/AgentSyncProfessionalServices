const { defineConfig, devices } = require('@playwright/test');
const { baseConfig } = require('@agentsync/test-framework/src/config/base.config');

module.exports = defineConfig({
  ...baseConfig,
  
  // Project-specific settings
  testDir: './tests',
  outputDir: './test-results',
  
  // Environment-specific configuration
  use: {
    ...baseConfig.browser,
    baseURL: process.env.BASE_URL || 'https://your-app.com',
    
    // Authentication
    storageState: process.env.STORAGE_STATE_PATH,
    
    // Custom headers
    extraHTTPHeaders: {
      'X-Test-Framework': 'AgentSync-Framework'
    }
  },
  
  // Test projects for different environments
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],
  
  // Reporters
  reporter: [
    ['html', { outputFolder: './reports/html' }],
    ['json', { outputFile: './reports/test-results.json' }],
    ['junit', { outputFile: './reports/junit-results.xml' }]
  ]
});
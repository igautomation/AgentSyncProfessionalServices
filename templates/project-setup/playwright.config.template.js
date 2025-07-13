/**
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const { defineConfig, devices } = require('@playwright/test');
const { baseConfig } = require('@agentsync/test-framework').config;
require('dotenv').config();

module.exports = defineConfig({
  // Extend base config from framework
  ...baseConfig,
  
  // Project-specific settings
  testDir: './tests',
  outputDir: './test-results',
  
  // Environment-specific configuration
  use: {
    baseURL: process.env.BASE_URL || 'https://your-app.com',
    
    // Authentication
    storageState: process.env.STORAGE_STATE_PATH,
    
    // Browser settings
    headless: process.env.HEADLESS === 'true',
    viewport: { width: 1280, height: 720 },
    
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
    },
    {
      name: 'api',
      use: { 
        baseURL: process.env.API_BASE_URL || 'https://api.your-app.com'
      }
    }
  ],
  
  // Reporters
  reporter: [
    ['html', { outputFolder: './reports/html' }],
    ['json', { outputFile: './reports/test-results.json' }],
    ['junit', { outputFile: './reports/junit-results.xml' }]
  ]
});
// Base configuration for the framework
module.exports = {
  // Test execution settings
  timeout: 30000,
  retries: 2,
  workers: process.env.CI ? 2 : undefined,
  
  // Self-healing locator settings
  selfHealing: {
    enabled: true,
    logLevel: 'info',
    timeout: 5000,
    maxRetries: 3
  },
  
  // Reporting settings
  reporting: {
    html: true,
    json: true,
    junit: true,
    allure: false
  },
  
  // Browser settings
  browser: {
    headless: process.env.CI ? true : false,
    slowMo: 0,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  
  // API testing settings
  api: {
    timeout: 10000,
    retries: 1,
    baseURL: process.env.API_BASE_URL
  },
  
  // Accessibility settings
  accessibility: {
    enabled: true,
    standards: ['wcag2a', 'wcag2aa'],
    reportFormat: 'html'
  },
  
  // Performance settings
  performance: {
    enabled: false,
    thresholds: {
      fcp: 2000,
      lcp: 2500,
      cls: 0.1
    }
  }
};
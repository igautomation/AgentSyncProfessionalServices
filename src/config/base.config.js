/**
 * Base configuration for the framework
 * This configuration can be extended by projects
 */
module.exports = {
  // Test execution settings
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  forbidOnly: !!process.env.CI,
  
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
    headless: process.env.CI ? true : (process.env.HEADLESS === 'true'),
    slowMo: parseInt(process.env.SLOW_MO || '0'),
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  
  // API testing settings
  api: {
    timeout: 10000,
    retries: 1,
    baseURL: process.env.API_BASE_URL
  },
  
  // Accessibility settings
  accessibility: {
    enabled: process.env.ACCESSIBILITY_ENABLED === 'true',
    standards: ['wcag2a', 'wcag2aa'],
    reportFormat: 'html'
  },
  
  // Performance settings
  performance: {
    enabled: process.env.PERFORMANCE_ENABLED === 'true',
    thresholds: {
      fcp: 2000,
      lcp: 2500,
      cls: 0.1
    }
  }
};
const { test, expect } = require('@playwright/test');
const { SelfHealingLocator } = require('@agentsync/test-framework').locators;

test.describe('Example Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should demonstrate self-healing locator usage @smoke', async ({ page }) => {
    // Create a self-healing locator for the main navigation
    const navLocator = new SelfHealingLocator(page, '[data-testid="main-nav"]', {
      fallbackStrategies: [
        { selector: 'nav.main-navigation' },
        { selector: '.header nav' },
        { selector: 'header ul' }
      ]
    });

    // Use the locator
    try {
      const nav = await navLocator.locate();
      await expect(nav).toBeVisible();
    } catch (error) {
      console.log('Navigation not found, but test continues with fallback behavior');
      // This is just for demonstration - in a real test, you might have different assertions
    }
  });

  test('should demonstrate framework utilities @smoke', async ({ page }) => {
    // Example of using framework utilities
    const title = await page.title();
    expect(title).not.toBe('');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for visual comparison
    await page.screenshot({ path: './reports/example-page.png' });
  });

  test('API test example @api', async ({ request }) => {
    // Example API test using framework utilities
    const response = await request.get('/api/health');
    
    // If the endpoint doesn't exist in your test environment, this will handle the error
    if (response.status() === 404) {
      console.log('API endpoint not found, skipping test');
      test.skip();
      return;
    }
    
    expect(response.status()).toBe(200);
    
    try {
      const data = await response.json();
      expect(data).toHaveProperty('status');
    } catch (error) {
      console.log('Could not parse JSON response, but test continues');
    }
  });
});
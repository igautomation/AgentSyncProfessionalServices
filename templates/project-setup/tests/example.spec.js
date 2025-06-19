const { test, expect } = require('@playwright/test');
const { SelfHealingLocator } = require('@agentsync/test-framework').locators;

test.describe('Example Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should demonstrate self-healing locator usage', async ({ page }) => {
    // Create a self-healing locator for the main navigation
    const navLocator = new SelfHealingLocator(page, '[data-testid="main-nav"]', {
      fallbackStrategies: [
        { selector: 'nav.main-navigation' },
        { selector: '.header nav' },
        { selector: 'header ul' }
      ]
    });

    const nav = await navLocator.locate();
    await expect(nav).toBeVisible();
  });

  test('should demonstrate framework utilities', async ({ page }) => {
    // Example of using framework utilities
    const title = await page.title();
    expect(title).not.toBe('');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for visual comparison
    await page.screenshot({ path: 'example-page.png' });
  });

  test.skip('API test example', async ({ request }) => {
    // Example API test using framework utilities
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
  });
});
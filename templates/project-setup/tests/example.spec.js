const { test, expect } = require('@playwright/test');
const { utils } = require('@igautomation/agentsyncprofessionalservices');

test.describe('Example Test Suite', () => {
  test('should navigate to the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Client Application/);
  });

  test('should use framework utilities', async ({ page }) => {
    // Using the framework's web utilities
    const { webInteractions } = utils.web;
    
    await page.goto('/');
    
    // Example of using framework utilities
    await webInteractions.waitForPageLoad(page);
    
    // Take a screenshot using framework utilities
    await utils.web.screenshotUtils.takeScreenshot(page, 'homepage');
  });

  test('should use self-healing locators', async ({ page }) => {
    const { SelfHealingLocator } = utils.web;
    
    await page.goto('/login');
    
    // Create a self-healing locator for the login button
    const loginButton = new SelfHealingLocator(page, {
      selector: 'button[type="submit"]',
      fallbackSelectors: [
        'button:has-text("Login")',
        '.login-button',
        '#login-btn'
      ],
      name: 'Login Button'
    });
    
    // Use the self-healing locator
    await loginButton.click();
  });
});
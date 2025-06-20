// @ts-check
const { test, expect } = require('@playwright/test');
const { BasePage, utils } = require('agentsync-test-framework');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = this.page.locator('h1');
    this.loginButton = this.page.locator('text=Login');
  }

  async navigate() {
    await this.page.goto('https://example.com');
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}

test.describe('Basic test example', () => {
  test('should navigate to homepage', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate to the homepage
    await homePage.navigate();
    
    // Verify the heading
    await expect(homePage.heading).toHaveText('Example Domain');
    
    // Take a screenshot
    await utils.common.takeScreenshot(page, 'homepage');
  });
});
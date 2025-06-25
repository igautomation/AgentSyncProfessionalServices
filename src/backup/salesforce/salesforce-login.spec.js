/**
 * Salesforce Login Test
 *
 * This test verifies that we can log into Salesforce with the provided credentials
 */
const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: '.env.dev' });

// For backwards compatibility, also try to load Salesforce-specific variables if the file exists
if (fs.existsSync('.env.salesforce')) {
  dotenv.config({ path: '.env.salesforce' });
}

// Ensure auth directory exists
const authDir = path.join(process.cwd(), 'auth');
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

test.describe('Salesforce Login Test', () => {
  test('should login to Salesforce successfully', async ({ page }) => {
    // Navigate to login page
    await page.goto(process.env.SF_LOGIN_URL);

    // Fill login form
    await page.fill('#username', process.env.SF_USERNAME);
    await page.fill('#password', process.env.SF_PASSWORD);

    // Click login button
    await page.click('#Login');

    // Wait for login to complete with better handling
    try {
      // Wait for redirect after login
      await page.waitForNavigation({ timeout: 30000 });
      
      // Wait additional time for the page to stabilize
      await page.waitForTimeout(5000);
      
      // Wait for any loading spinners to disappear
      const spinnerVisible = await page.locator('.slds-spinner').isVisible().catch(() => false);
      if (spinnerVisible) {
        await page.waitForSelector('.slds-spinner', { state: 'hidden', timeout: 30000 }).catch(() => {});
      }
    } catch (error) {
      console.log(`Navigation error: ${error.message}`);
    }

    // Take a screenshot for verification
    await page.screenshot({ path: './auth/salesforce-login-attempt.png' });

    // Check if we're still on the login page
    if (page.url().includes('login.salesforce.com')) {
      const errorElement = await page.$('#error');
      if (errorElement) {
        const errorText = await errorElement.textContent();
        throw new Error(`Login error: ${errorText}`);
      } else {
        throw new Error('Failed to login to Salesforce');
      }
    }

    // Save the authentication state for future tests
    await page.context().storageState({ path: './auth/salesforce-storage-state.json' });

    // Add assertions
    const pageTitle = await page.title();
    console.log(`Current page title: ${pageTitle}`);
    console.log(`Current URL: ${page.url()}`);
    
    // We've successfully logged in
    expect(page.url()).not.toContain('login.salesforce.com');
    console.log('✅ Successfully logged in to Salesforce and saved authentication state');
  });
});
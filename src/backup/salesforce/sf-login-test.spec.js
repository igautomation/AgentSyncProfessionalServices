const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.dev' });

test('Salesforce login test', async ({ page }) => {
  // Navigate to login page
  await page.goto(process.env.SF_LOGIN_URL);
  
  // Fill login form
  await page.fill('#username', process.env.SF_USERNAME);
  await page.fill('#password', process.env.SF_PASSWORD);
  
  // Click login button
  await page.click('#Login');
  
  // Wait for login to complete
  await page.waitForTimeout(10000);
  
  // Take screenshot
  await page.screenshot({ path: './auth/login-test.png' });
  
  // Check if login was successful
  expect(page.url()).not.toContain('login.salesforce.com');
  
  // Save authentication state
  await page.context().storageState({ path: './auth/salesforce-storage-state.json' });
  console.log('Salesforce authentication state saved');
});
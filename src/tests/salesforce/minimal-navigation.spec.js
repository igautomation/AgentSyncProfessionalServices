/**
 * Minimal Salesforce Navigation Test
 * This test focuses only on login and basic navigation to identify issues
 */
const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: '.env.dev' });
if (fs.existsSync('.env.salesforce')) {
  dotenv.config({ path: '.env.salesforce' });
}

test('Minimal Salesforce navigation test', async ({ page }) => {
  // Increase timeouts
  page.setDefaultTimeout(120000);
  
  // Step 1: Login (if not using storageState)
  if (!process.env.USE_STORAGE_STATE) {
    console.log('Logging in to Salesforce...');
    await page.goto(process.env.SF_LOGIN_URL, { timeout: 60000 });
    await page.fill('#username', process.env.SF_USERNAME);
    await page.fill('#password', process.env.SF_PASSWORD);
    await page.click('#Login');
    
    // Wait for login to complete
    try {
      await page.waitForNavigation({ timeout: 60000 });
      await page.waitForTimeout(10000);
    } catch (error) {
      console.log(`Navigation error: ${error.message}`);
    }
    
    // Save screenshot
    await page.screenshot({ path: './auth/minimal-login.png' });
    
    // Save auth state
    await page.context().storageState({ path: './auth/minimal-storage-state.json' });
  }
  
  // Step 2: Navigate to home page
  console.log('Navigating to home page...');
  await page.goto(process.env.SF_INSTANCE_URL + '/lightning/page/home', { timeout: 60000 });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: './auth/minimal-home.png' });
  
  // Step 3: Try to access App Launcher using different methods
  console.log('Attempting to access App Launcher...');
  
  // Method 1: Using role
  try {
    const appLauncherButton = page.getByRole('button', { name: 'App Launcher' });
    const isVisible = await appLauncherButton.isVisible({ timeout: 10000 }).catch(() => false);
    
    if (isVisible) {
      console.log('App Launcher button found by role');
      await appLauncherButton.click();
    } else {
      console.log('App Launcher button not visible by role');
    }
  } catch (error) {
    console.log(`Method 1 error: ${error.message}`);
  }
  
  // Method 2: Using CSS selector
  try {
    const appLauncherSelector = page.locator('button[aria-label="App Launcher"]');
    const isVisible = await appLauncherSelector.isVisible({ timeout: 10000 }).catch(() => false);
    
    if (isVisible) {
      console.log('App Launcher button found by CSS selector');
      await appLauncherSelector.click();
    } else {
      console.log('App Launcher button not visible by CSS selector');
    }
  } catch (error) {
    console.log(`Method 2 error: ${error.message}`);
  }
  
  // Method 3: Direct navigation to Accounts
  try {
    console.log('Trying direct navigation to Accounts...');
    await page.goto(process.env.SF_INSTANCE_URL + '/lightning/o/Account/list', { timeout: 60000 });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: './auth/minimal-accounts.png' });
    console.log('Direct navigation to Accounts completed');
  } catch (error) {
    console.log(`Direct navigation error: ${error.message}`);
  }
  
  // Final verification
  console.log(`Current URL: ${page.url()}`);
  console.log(`Page title: ${await page.title()}`);
});
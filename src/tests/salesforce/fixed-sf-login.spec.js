/**
 * Fixed Salesforce Login Test with improved reliability
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

test('Salesforce login test with improved reliability', async ({ page }) => {
  // Increase timeouts for this specific test
  page.setDefaultTimeout(120000);
  
  console.log('Starting Salesforce login test...');
  
  try {
    // Navigate to login page
    await page.goto(process.env.SF_LOGIN_URL, { timeout: 60000 });
    console.log('Navigated to login page');
    
    // Fill login form
    await page.fill('#username', process.env.SF_USERNAME);
    await page.fill('#password', process.env.SF_PASSWORD);
    console.log('Filled login credentials');
    
    // Click login button
    await page.click('#Login');
    console.log('Clicked login button');
    
    // Wait for login to complete with better handling
    try {
      // Wait for redirect after login
      await page.waitForNavigation({ timeout: 60000 });
      console.log('Navigation completed');
      
      // Wait additional time for the page to stabilize
      await page.waitForTimeout(10000);
      console.log('Additional wait completed');
    } catch (error) {
      console.log(`Navigation error: ${error.message}`);
      // Continue anyway as the page might have loaded
    }
    
    // Take a screenshot for verification
    await page.screenshot({ path: './auth/salesforce-login-attempt.png' });
    console.log('Screenshot taken');
    
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
    console.log('Authentication state saved');
    
    // Add assertions
    const pageTitle = await page.title();
    console.log(`Current page title: ${pageTitle}`);
    console.log(`Current URL: ${page.url()}`);
    
    // We've successfully logged in
    expect(page.url()).not.toContain('login.salesforce.com');
    console.log('✅ Successfully logged in to Salesforce and saved authentication state');
  } catch (error) {
    console.error(`Login test failed: ${error.message}`);
    await page.screenshot({ path: './auth/salesforce-login-error.png' });
    throw error;
  }
});
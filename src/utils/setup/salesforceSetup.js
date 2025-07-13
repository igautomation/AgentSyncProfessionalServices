/**
 * Salesforce Setup
 * 
 * This file handles Salesforce authentication and setup for tests
 */
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// For backwards compatibility, also try to load Salesforce-specific variables
if (fs.existsSync('.env.salesforce')) {
  dotenv.config({ path: '.env.salesforce' });
}

/**
 * Setup function for Salesforce tests
 */
async function setupSalesforce() {
  console.log('Starting Salesforce setup...');
  
  // Ensure auth directory exists
  const authDir = path.join(process.cwd(), 'auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  
  // Check if we need to refresh the auth state
  const authPath = path.join(authDir, 'salesforce-storage-state.json');
  const authFileExists = fs.existsSync(authPath);
  
  // If auth file exists and is less than 1 hour old, skip login
  if (authFileExists) {
    const stats = fs.statSync(authPath);
    const fileAgeHours = (Date.now() - stats.mtime) / (1000 * 60 * 60);
    
    if (fileAgeHours < 1) {
      console.log('Using existing Salesforce authentication (less than 1 hour old)');
      return;
    }
  }
  
  console.log('Performing Salesforce login to refresh authentication...');
  
  // Launch browser
  const browser = await chromium.launch({
    headless: true,
    slowMo: 100,
    args: ['--disable-dev-shm-usage']
  });
  
  // Create context and page
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to login page
    await page.goto(process.env.SF_LOGIN_URL);
    
    // Fill login form
    await page.fill('#username', process.env.SF_USERNAME);
    await page.fill('#password', process.env.SF_PASSWORD);
    
    // Click login button
    await page.click('#Login');
    
    // Wait for login to complete
    try {
      // Wait for redirect after login
      await page.waitForNavigation({ timeout: 30000 });
      
      // Wait additional time for the page to stabilize
      await page.waitForTimeout(5000);
    } catch (error) {
      console.log(`Navigation error: ${error.message}`);
    }
    
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
    
    // Save the authentication state
    await context.storageState({ path: authPath });
    
    console.log('Salesforce authentication refreshed successfully');
    console.log(`Current URL after login: ${page.url()}`);
  } catch (error) {
    console.error(`Salesforce setup error: ${error.message}`);
    throw error;
  } finally {
    // Close browser
    await browser.close();
  }
}

module.exports = setupSalesforce;
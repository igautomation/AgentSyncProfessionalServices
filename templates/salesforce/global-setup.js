const { chromium } = require('@playwright/test');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function globalSetup() {
  console.log('Running Salesforce authentication setup...');
  
  // Create auth directory if it doesn't exist
  const authDir = path.join(process.cwd(), 'auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Log into Salesforce
    await page.goto(process.env.SF_URL);
    await page.getByRole('textbox', { name: 'Username' }).fill(process.env.SF_USERNAME);
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.SF_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();
    
    // Wait for login to complete
    await page.waitForSelector('.slds-global-header, .tabsNewClass, #home_Tab', { timeout: 30000 });

    // Save browser state for reuse in tests
    await page.context().storageState({ path: './auth/salesforce-storage-state.json' });
    console.log('Salesforce authentication state saved');
  } catch (error) {
    console.error('Error during Salesforce authentication:', error);
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;
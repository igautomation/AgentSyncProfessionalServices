/**
 * Simplified Salesforce Account and Contact Creation Test
 */
const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.dev' });
// Try to load Salesforce-specific variables if available
try {
  if (require('fs').existsSync('.env.salesforce')) {
    dotenv.config({ path: '.env.salesforce' });
  }
} catch (error) {
  console.log('No Salesforce-specific env file found, using default');
}

// Test data
const testData = {
  account: {
    name: `AgentSync${Date.now()}`,
    rating: 'Hot',
    parentAccount: 'Postman',
    type: 'Customer - Direct',
    ownership: 'Public'
  },
  contact: {
    salutation: 'Mr.',
    lastName: `LN${Date.now()}`,
    leadSource: 'Partner Referral',
    level: 'Primary'
  }
};

// Test suite
test.describe('Salesforce Account and Contact Creation', () => {
  let accountName;
  
  test('should create a new account', async ({ page }) => {
    // Store account name for later tests
    accountName = testData.account.name;
    
    // Open App Launcher
    await page.getByRole('button', { name: 'App Launcher' }).click();
    
    // Search for and navigate to Accounts
    await page.getByRole('combobox', { name: 'Search apps and items...' }).fill('account');
    await page.getByRole('option', { name: 'Accounts' }).click();
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Click New button
    await page.getByRole('button', { name: 'New' }).click();
    
    // Wait for form to load
    await page.waitForLoadState('networkidle');
    
    // Fill account details
    await page.getByRole('textbox', { name: '*Account Name' }).fill(accountName);
    
    // Select Rating
    await page.getByRole('combobox', { name: 'Rating' }).click();
    await page.getByText(testData.account.rating).click();
    
    // Select Parent Account
    await page.getByRole('combobox', { name: 'Parent Account' }).click();
    await page.getByRole('option', { name: testData.account.parentAccount }).locator('span').nth(2).click();
    
    // Select Type
    await page.getByRole('combobox', { name: 'Type' }).click();
    await page.getByRole('option', { name: testData.account.type }).locator('span').nth(1).click();
    
    // Select Ownership
    await page.getByRole('combobox', { name: 'Ownership' }).click();
    await page.getByText(testData.account.ownership).click();
    
    // Save the account
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    
    // Wait for save to complete
    await page.waitForLoadState('networkidle');
    
    // Verify account was created
    const toast = page.locator('.slds-notify__content');
    await expect(toast).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: `./account-created-${Date.now()}.png` });
  });
  
  test('should create a contact under the account', async ({ page }) => {
    // Skip if account name is not available
    test.skip(!accountName, 'Account name not available, skipping test');
    
    // Open App Launcher
    await page.getByRole('button', { name: 'App Launcher' }).click();
    
    // Search for and navigate to Accounts
    await page.getByRole('combobox', { name: 'Search apps and items...' }).fill('account');
    await page.getByRole('option', { name: 'Accounts' }).click();
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Click on the account name
    await page.getByRole('link', { name: accountName }).click();
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Navigate to Contacts tab
    await page.getByRole('link', { name: 'Contacts', exact: true }).click();
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Click New button
    await page.getByRole('button', { name: 'New' }).click();
    
    // Wait for form to load
    await page.waitForLoadState('networkidle');
    
    // Fill contact details
    // Select Salutation
    await page.getByRole('combobox', { name: 'Salutation' }).click();
    await page.getByRole('option', { name: testData.contact.salutation }).locator('span').nth(1).click();
    
    // Fill Last Name
    await page.getByRole('textbox', { name: '*Last Name' }).fill(testData.contact.lastName);
    
    // Select Lead Source
    await page.getByRole('combobox', { name: 'Lead Source' }).click();
    await page.getByText(testData.contact.leadSource).click();
    
    // Select Level
    await page.getByRole('combobox', { name: 'Level' }).click();
    await page.getByRole('option', { name: testData.contact.level }).locator('span').nth(1).click();
    
    // Save the contact
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    
    // Wait for save to complete
    await page.waitForLoadState('networkidle');
    
    // Verify contact was created
    const toast = page.locator('.slds-notify__content');
    await expect(toast).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: `./contact-created-${Date.now()}.png` });
  });
});
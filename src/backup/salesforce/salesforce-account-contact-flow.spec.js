/**
 * Salesforce Account and Contact Creation Flow
 * 
 * This test demonstrates creating an account and contact in Salesforce
 * using the recorded Playwright codegen script but organized with better practices.
 */
const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.dev' });

// Test data from environment variables
const credentials = {
  username: process.env.SF_USERNAME,
  password: process.env.SF_PASSWORD,
  loginUrl: process.env.SF_LOGIN_URL
};

// Test data for account and contact
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
test.describe('Salesforce Account and Contact Creation Flow', () => {
  test('should create account and contact', async ({ page }) => {
    // Step 1: Login to Salesforce
    await loginToSalesforce(page);
    
    // Step 2: Create a new account
    await createAccount(page);
    
    // Step 3: Create a contact under the account
    await createContact(page);
  });
});

/**
 * Login to Salesforce
 * @param {import('@playwright/test').Page} page - Playwright page
 */
async function loginToSalesforce(page) {
  // Navigate to login page
  await page.goto(credentials.loginUrl);
  
  // Fill login form
  await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
  
  // Click login button
  await page.getByRole('button', { name: 'Log In' }).click();
  
  // Wait for login to complete and navigate to setup
  await page.waitForLoadState('networkidle');
  await page.goto(process.env.SF_INSTANCE_URL + '/lightning/setup/SetupOneHome/home');
}

/**
 * Create a new account
 * @param {import('@playwright/test').Page} page - Playwright page
 */
async function createAccount(page) {
  // Open App Launcher
  await page.getByRole('button', { name: 'App Launcher' }).click();
  
  // Search for and navigate to Accounts
  await page.getByRole('combobox', { name: 'Search apps and items...' }).fill('account');
  await page.getByRole('option', { name: 'Accounts' }).click();
  
  // Click New button
  await page.getByRole('button', { name: 'New' }).click();
  
  // Fill account details
  await page.getByRole('textbox', { name: '*Account Name' }).fill(testData.account.name);
  
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
  
  // Verify account was created by checking the link with account name
  await expect(page.getByRole('link', { name: testData.account.name })).toBeVisible();
}

/**
 * Create a new contact under the account
 * @param {import('@playwright/test').Page} page - Playwright page
 */
async function createContact(page) {
  // Click on the account name to navigate to account detail
  await page.getByRole('link', { name: testData.account.name }).click();
  
  // Navigate to Contacts related list
  await page.getByRole('link', { name: 'Contacts', exact: true }).click();
  
  // Click New button to create contact
  await page.getByRole('button', { name: 'New' }).click();
  
  // Fill contact details
  // Select Salutation
  await page.getByRole('combobox', { name: 'Salutation' }).click();
  await page.getByRole('option', { name: testData.contact.salutation }).locator('span').nth(1).click();
  
  // Fill Last Name
  await page.getByRole('textbox', { name: '*Last Name' }).fill(testData.contact.lastName);
  
  // Select Lead Source
  await page.getByRole('combobox', { name: 'Lead Source' }).click();
  await page.getByText(testData.contact.leadSource).click();
  
  // Verify Account Name is pre-filled with current account
  const accountField = page.getByRole('combobox', { name: 'Account Name' });
  await expect(accountField).toContainText(testData.account.name);
  
  // Select Level
  await page.getByRole('combobox', { name: 'Level' }).click();
  await page.getByRole('option', { name: testData.contact.level }).locator('span').nth(1).click();
  
  // Save the contact
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  
  // Wait for save to complete
  await page.waitForLoadState('networkidle');
  
  // Verify contact was created by checking the title contains the contact name
  const contactName = `${testData.contact.salutation} ${testData.contact.lastName}`;
  await expect(page.getByRole('link', { name: contactName })).toBeVisible();
}
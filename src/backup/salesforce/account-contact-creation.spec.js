/**
 * Salesforce Account and Contact Creation Test
 * 
 * This test demonstrates creating an account and contact in Salesforce
 * using the framework's page objects, utilities, and data providers.
 */
const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: '.env.dev' });
// Also try to load Salesforce-specific variables if the file exists
try {
  if (require('fs').existsSync('.env.salesforce')) {
    dotenv.config({ path: '.env.salesforce' });
  }
} catch (error) {
  console.log('No Salesforce-specific env file found, using default');
}

// Import page objects
const LoginPage = require('../../pages/salesforce/LoginPage');
const AccountPage = require('../../pages/salesforce/AccountPage');
const ContactPage = require('../../pages/salesforce/ContactPage');

// Import utilities and data providers
const salesforceData = require('../../utils/data/salesforceDataProvider');
const SalesforceTestHelper = require('../../utils/salesforce/SalesforceTestHelper');

// Test suite
test.describe('Salesforce Account and Contact Management', () => {
  // Variables to share data between tests
  let accountName;
  
  // Before each test
  test.beforeEach(async ({ page }) => {
    // Initialize test helper
    const sfHelper = new SalesforceTestHelper(page);
    
    // Check if we need to login (if not using storageState)
    const currentUrl = page.url();
    if (currentUrl === 'about:blank' || currentUrl.includes('login.salesforce.com')) {
      // Get login credentials
      const credentials = salesforceData.getLoginCredentials();
      
      // Login to Salesforce
      const loginPage = new LoginPage(page);
      await loginPage.navigate(credentials.loginUrl);
      await loginPage.login(credentials.username, credentials.password);
      
      // Wait for login to complete
      await sfHelper.waitForSalesforcePageLoad();
    }
  });
  
  test('should create a new account', async ({ page }) => {
    // Initialize test helper
    const sfHelper = new SalesforceTestHelper(page);
    
    // Generate account data
    const accountData = salesforceData.generateAccountData();
    accountName = accountData.name; // Save for later tests
    
    // Initialize account page
    const accountPage = new AccountPage(page);
    
    // Navigate to Accounts
    await accountPage.navigateToAccounts();
    
    // Create a new account
    await accountPage.createAccount(accountData);
    
    // Verify account was created successfully
    const isSuccess = await accountPage.verifyAccountCreated();
    expect(isSuccess).toBeTruthy();
    
    // Take a screenshot for verification
    await sfHelper.takeScreenshotWithContext('account-created');
  });
  
  test('should create a contact under the account', async ({ page }) => {
    // Skip if account name is not available
    test.skip(!accountName, 'Account name not available, skipping test');
    
    // Initialize test helper
    const sfHelper = new SalesforceTestHelper(page);
    
    // Initialize account and contact pages
    const accountPage = new AccountPage(page);
    const contactPage = new ContactPage(page);
    
    // Navigate to Accounts
    await accountPage.navigateToAccounts();
    
    // Navigate to the account's contacts tab
    await accountPage.navigateToAccountContacts(accountName);
    
    // Generate contact data
    const contactData = salesforceData.generateContactData({
      accountName: accountName
    });
    
    // Create a new contact
    await contactPage.createContact(contactData);
    
    // Verify contact was created successfully
    const isSuccess = await contactPage.verifyContactCreated();
    expect(isSuccess).toBeTruthy();
    
    // Take a screenshot for verification
    await sfHelper.takeScreenshotWithContext('contact-created');
  });
});
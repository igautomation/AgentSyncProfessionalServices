/**
 * Fixed Salesforce Account and Contact Creation Test
 * With improved error handling and direct navigation
 */
const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: '.env.dev' });
if (fs.existsSync('.env.salesforce')) {
  dotenv.config({ path: '.env.salesforce' });
}

// Test data
const testData = {
  account: {
    name: `AgentSync${Date.now()}`,
    rating: 'Hot',
    type: 'Customer - Direct',
    ownership: 'Public'
  },
  contact: {
    firstName: `FN${Date.now()}`,
    lastName: `LN${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    phone: '555-123-4567'
  }
};

// Helper function to wait for page load
async function waitForPageLoad(page) {
  try {
    await page.waitForLoadState('domcontentloaded');
    // Wait for any loading spinners to disappear
    const spinner = page.locator('.slds-spinner');
    if (await spinner.isVisible().catch(() => false)) {
      await spinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
    }
    // Small additional wait
    await page.waitForTimeout(2000);
  } catch (error) {
    console.log(`Wait error: ${error.message}`);
  }
}

test.describe('Fixed Salesforce Account and Contact Creation', () => {
  let accountName;
  
  test.beforeEach(async ({ page }) => {
    // Increase timeouts
    page.setDefaultTimeout(120000);
  });
  
  test('should create a new account using direct navigation', async ({ page }) => {
    // Store account name for later tests
    accountName = testData.account.name;
    console.log(`Using account name: ${accountName}`);
    
    try {
      // Direct navigation to Accounts
      console.log('Navigating directly to Accounts list view...');
      await page.goto(process.env.SF_INSTANCE_URL + '/lightning/o/Account/list', { timeout: 60000 });
      await waitForPageLoad(page);
      await page.screenshot({ path: './account-list-view.png' });
      
      // Click New button
      console.log('Clicking New button...');
      await page.getByRole('button', { name: 'New' }).click({ timeout: 30000 });
      await waitForPageLoad(page);
      
      // Fill account details
      console.log('Filling account details...');
      await page.getByRole('textbox', { name: '*Account Name' }).fill(accountName);
      
      // Select Rating if the field exists
      const ratingField = page.getByRole('combobox', { name: 'Rating' });
      if (await ratingField.isVisible().catch(() => false)) {
        await ratingField.click();
        await page.getByText(testData.account.rating).click().catch(() => {
          console.log('Could not select rating, continuing...');
        });
      }
      
      // Select Type if the field exists
      const typeField = page.getByRole('combobox', { name: 'Type' });
      if (await typeField.isVisible().catch(() => false)) {
        await typeField.click();
        await page.getByRole('option', { name: testData.account.type }).click().catch(() => {
          console.log('Could not select type, continuing...');
        });
      }
      
      // Save the account
      console.log('Saving account...');
      await page.getByRole('button', { name: 'Save', exact: true }).click();
      await waitForPageLoad(page);
      
      // Take screenshot
      await page.screenshot({ path: `./fixed-account-created.png` });
      console.log('Account creation completed');
      
      // Store account ID from URL for later use
      const url = page.url();
      const accountId = url.split('/').pop();
      console.log(`Account ID: ${accountId}`);
      
      // Write account info to file for other tests to use
      fs.writeFileSync('./account-info.json', JSON.stringify({
        name: accountName,
        id: accountId
      }));
      
    } catch (error) {
      console.error(`Account creation failed: ${error.message}`);
      await page.screenshot({ path: './account-creation-error.png' });
      throw error;
    }
  });
  
  test('should create a contact using direct navigation', async ({ page }) => {
    try {
      // Read account info from file
      let accountInfo;
      try {
        accountInfo = JSON.parse(fs.readFileSync('./account-info.json', 'utf8'));
        console.log(`Using account: ${accountInfo.name} (${accountInfo.id})`);
      } catch (error) {
        console.log('No account info found, test may fail');
        accountInfo = { name: 'Unknown', id: '' };
      }
      
      // Direct navigation to New Contact form
      console.log('Navigating directly to New Contact form...');
      await page.goto(process.env.SF_INSTANCE_URL + '/lightning/o/Contact/new', { timeout: 60000 });
      await waitForPageLoad(page);
      await page.screenshot({ path: './new-contact-form.png' });
      
      // Fill contact details
      console.log('Filling contact details...');
      await page.getByRole('textbox', { name: 'First Name' }).fill(testData.contact.firstName);
      await page.getByRole('textbox', { name: '*Last Name' }).fill(testData.contact.lastName);
      await page.getByRole('textbox', { name: 'Email' }).fill(testData.contact.email);
      
      // Use a more specific selector for Phone since there are multiple phone fields
      await page.locator('input[name="Phone"]').fill(testData.contact.phone);
      
      // Link to account if we have account info
      if (accountInfo.id) {
        const accountLookup = page.getByRole('textbox', { name: 'Account Name' });
        if (await accountLookup.isVisible().catch(() => false)) {
          await accountLookup.fill(accountInfo.name);
          // Wait for dropdown and select the account
          await page.waitForTimeout(2000);
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');
        }
      }
      
      // Save the contact
      console.log('Saving contact...');
      await page.getByRole('button', { name: 'Save', exact: true }).click();
      await waitForPageLoad(page);
      
      // Take screenshot
      await page.screenshot({ path: `./fixed-contact-created.png` });
      console.log('Contact creation completed');
      
    } catch (error) {
      console.error(`Contact creation failed: ${error.message}`);
      await page.screenshot({ path: './contact-creation-error.png' });
      throw error;
    }
  });
});
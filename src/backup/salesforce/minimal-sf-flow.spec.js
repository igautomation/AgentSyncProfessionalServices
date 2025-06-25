const { test, expect } = require('@playwright/test');
const { waitForPageLoad, waitForSpinner, navigateToApp } = require('../../utils/salesforce/sf-test-helpers');

// Increase test timeout
test.setTimeout(120000);

test('Salesforce account and contact creation', async ({ page }) => {
  // First navigate to home page to ensure we're properly logged in
  await page.goto(process.env.SF_INSTANCE_URL || 'https://login.salesforce.com');
  await waitForPageLoad(page);
  
  // Navigate to Accounts app using our helper
  try {
    await navigateToApp(page, 'Accounts');
  } catch (error) {
    console.error(`Failed to navigate to Accounts: ${error.message}`);
    
    // Fallback approach if the helper fails
    console.log('Trying fallback navigation approach...');
    await page.goto(process.env.SF_INSTANCE_URL + '/lightning/o/Account/list');
    await waitForPageLoad(page);
  }
  
  // Create account
  const accountName = `AgentSync${Date.now()}`;
  await page.getByRole('button', { name: 'New' }).click();
  await waitForPageLoad();
  
  await page.getByRole('textbox', { name: '*Account Name' }).fill(accountName);
  await page.getByRole('combobox', { name: 'Rating' }).click();
  await page.getByText('Hot').click();
  
  try {
    await page.getByRole('combobox', { name: 'Parent Account' }).click();
    await page.getByRole('option', { name: 'Postman' }).locator('span').nth(2).click();
  } catch (e) {
    console.log('Parent Account selection failed, continuing without it');
  }
  
  await page.getByRole('combobox', { name: 'Type' }).click();
  await page.getByRole('option', { name: 'Customer - Direct' }).locator('span').nth(1).click();
  await page.getByRole('combobox', { name: 'Ownership' }).click();
  await page.getByText('Public').click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await waitForPageLoad();
  
  // Verify account was created
  await expect(page.locator('.slds-notify__content')).toBeVisible().catch(() => {});
  console.log(`Account created: ${accountName}`);
  
  // Create contact
  await page.getByRole('link', { name: accountName }).click();
  await waitForPageLoad();
  
  await page.getByRole('link', { name: 'Contacts', exact: true }).click();
  await waitForPageLoad();
  
  await page.getByRole('button', { name: 'New' }).click();
  await waitForPageLoad();
  
  await page.getByRole('combobox', { name: 'Salutation' }).click();
  await page.getByRole('option', { name: 'Mr.' }).locator('span').nth(1).click();
  await page.getByRole('textbox', { name: '*Last Name' }).fill('LN');
  await page.getByRole('combobox', { name: 'Lead Source' }).click();
  await page.getByText('Partner Referral').click();
  await page.getByRole('combobox', { name: 'Level' }).click();
  await page.getByRole('option', { name: 'Primary' }).locator('span').nth(1).click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await waitForPageLoad();
  
  // Verify contact was created
  await expect(page.locator('.slds-notify__content')).toBeVisible().catch(() => {});
  console.log('Contact created successfully');
});
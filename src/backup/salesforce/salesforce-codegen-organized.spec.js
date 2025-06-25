/**
 * Salesforce Account and Contact Creation Flow
 */
const { test, expect } = require('@playwright/test');

test.describe('Salesforce Account and Contact Flow', () => {
  const accountName = `AgentSync${Date.now()}`;
  
  test('create account and contact', async ({ page }) => {
    // App Launcher navigation
    await page.getByRole('button', { name: 'App Launcher' }).click();
    await page.getByRole('combobox', { name: 'Search apps and items...' }).fill('account');
    await page.getByRole('option', { name: 'Accounts' }).click();
    
    // Create account
    await page.getByRole('button', { name: 'New' }).click();
    await page.getByRole('textbox', { name: '*Account Name' }).fill(accountName);
    await page.getByRole('combobox', { name: 'Rating' }).click();
    await page.getByText('Hot').click();
    await page.getByRole('combobox', { name: 'Parent Account' }).click();
    await page.getByRole('option', { name: 'Postman' }).locator('span').nth(2).click();
    await page.getByRole('combobox', { name: 'Type' }).click();
    await page.getByRole('option', { name: 'Customer - Direct' }).locator('span').nth(1).click();
    await page.getByRole('combobox', { name: 'Ownership' }).click();
    await page.getByText('Public').click();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    
    // Navigate to account and create contact
    await page.getByRole('link', { name: accountName }).click();
    await page.getByRole('link', { name: 'Contacts', exact: true }).click();
    await page.getByRole('button', { name: 'New' }).click();
    await page.getByRole('combobox', { name: 'Salutation' }).click();
    await page.getByRole('option', { name: 'Mr.' }).locator('span').nth(1).click();
    await page.getByRole('textbox', { name: '*Last Name' }).fill('LN');
    await page.getByRole('combobox', { name: 'Lead Source' }).click();
    await page.getByText('Partner Referral').click();
    await page.getByRole('combobox', { name: 'Level' }).click();
    await page.getByRole('option', { name: 'Primary' }).locator('span').nth(1).click();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    
    // Verify contact was created
    const contactName = 'Mr. LN';
    await expect(page.getByRole('link', { name: contactName })).toBeVisible();
  });
});
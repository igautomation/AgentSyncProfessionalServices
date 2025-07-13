const { test, expect } = require('@playwright/test');
const { utils } = require('@igautomation/agentsyncprofessionalservices');
const { salesforceUtils } = utils.salesforce;
const ContactPage = require('../pages/ContactPage');

test.describe('Salesforce Contacts', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Contacts tab
    await salesforceUtils.navigateToTab(page, 'Contacts');
  });

  test('should create a new contact', async ({ page }) => {
    const contactPage = new ContactPage(page);
    const toast = await contactPage.createContact('Automated', 'Test Contact', 'test@example.com');
    await expect(toast).toContainText('Contact');
  });
});
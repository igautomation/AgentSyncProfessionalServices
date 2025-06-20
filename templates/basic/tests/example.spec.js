const { test, expect } = require('@playwright/test');
const { utils } = require('@igautomation/agentsyncprofessionalservices');

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Use framework utilities
  const { webInteractions } = utils.web;
  await webInteractions.waitForPageLoad(page);
  
  await expect(page).toHaveTitle('Example Domain');
});
/**
 * Salesforce UI utilities
 */

const logger = require('../common/logger');

/**
 * Navigate to a Salesforce tab
 * @param {Page} page - Playwright page
 * @param {string} tabName - Tab name
 * @returns {Promise<void>}
 */
async function navigateToTab(page, tabName) {
  try {
    // Click on App Launcher
    await page.click('div.slds-icon-waffle');
    
    // Wait for App Launcher to open
    await page.waitForSelector('input.slds-input');
    
    // Search for the tab
    await page.fill('input.slds-input', tabName);
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Click on the tab
    await page.click(`a.slds-app-launcher__tile-body-title:text-is("${tabName}")`);
    
    // Wait for navigation
    await page.waitForNavigation();
    
    logger.info(`Navigated to ${tabName} tab`);
  } catch (error) {
    logger.error(`Error navigating to ${tabName} tab: ${error.message}`);
    throw error;
  }
}

/**
 * Fill a Lightning form field
 * @param {Page} page - Playwright page
 * @param {string} fieldLabel - Field label
 * @param {string} value - Field value
 * @returns {Promise<void>}
 */
async function fillLightningField(page, fieldLabel, value) {
  try {
    // Find the field by label
    const fieldContainer = await page.locator(`lightning-input-field:has-text("${fieldLabel}")`).first();
    
    // Fill the field based on its type
    const isCombobox = await fieldContainer.locator('lightning-combobox').count() > 0;
    const isTextarea = await fieldContainer.locator('textarea').count() > 0;
    const isCheckbox = await fieldContainer.locator('input[type="checkbox"]').count() > 0;
    
    if (isCombobox) {
      await fieldContainer.click();
      await page.waitForTimeout(500);
      await page.click(`lightning-base-combobox-item:has-text("${value}")`);
    } else if (isTextarea) {
      await fieldContainer.locator('textarea').fill(value);
    } else if (isCheckbox) {
      const isChecked = await fieldContainer.locator('input[type="checkbox"]').isChecked();
      if ((value === true && !isChecked) || (value === false && isChecked)) {
        await fieldContainer.click();
      }
    } else {
      await fieldContainer.locator('input').fill(value);
    }
    
    logger.info(`Filled ${fieldLabel} with ${value}`);
  } catch (error) {
    logger.error(`Error filling ${fieldLabel}: ${error.message}`);
    throw error;
  }
}

/**
 * Click a button in Salesforce Lightning
 * @param {Page} page - Playwright page
 * @param {string} buttonLabel - Button label
 * @returns {Promise<void>}
 */
async function clickButton(page, buttonLabel) {
  try {
    await page.click(`button:has-text("${buttonLabel}")`);
    logger.info(`Clicked ${buttonLabel} button`);
  } catch (error) {
    logger.error(`Error clicking ${buttonLabel} button: ${error.message}`);
    throw error;
  }
}

module.exports = {
  navigateToTab,
  fillLightningField,
  clickButton
};
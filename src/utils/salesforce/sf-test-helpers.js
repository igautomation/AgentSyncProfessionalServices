/**
 * Salesforce Test Helpers
 * 
 * Utility functions to improve Salesforce test reliability
 */

/**
 * Wait for page to load with improved error handling
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForPageLoad(page, timeout = 45000) {
  try {
    // First wait for DOM to be ready
    await page.waitForLoadState('domcontentloaded');
    
    // Then try to wait for network to be idle, but continue if it times out
    await page.waitForLoadState('networkidle', { timeout }).catch(() => {
      console.log('Network did not reach idle state, continuing anyway');
    });
  } catch (error) {
    console.log(`Page load error: ${error.message}`);
  }
}

/**
 * Wait for Salesforce spinner to disappear
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForSpinner(page, timeout = 30000) {
  try {
    // Check if spinner exists
    const spinnerExists = await page.locator('.slds-spinner').isVisible();
    
    if (spinnerExists) {
      // Wait for spinner to disappear
      await page.waitForSelector('.slds-spinner', { state: 'hidden', timeout });
    }
  } catch (error) {
    console.log(`Spinner wait error: ${error.message}`);
  }
}

/**
 * Click App Launcher and navigate to an app
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} appName - Name of the app to navigate to
 */
async function navigateToApp(page, appName) {
  try {
    // Wait for the page to be fully loaded
    await waitForPageLoad(page);
    
    // Click App Launcher using more reliable selector
    console.log(`Clicking App Launcher button`);
    await page.waitForSelector('button[aria-label="App Launcher"]', { state: 'visible', timeout: 30000 });
    await page.click('button[aria-label="App Launcher"]');
    
    // Search for the app
    console.log(`Searching for ${appName} app`);
    await page.waitForSelector('input[placeholder="Search apps and items..."]', { state: 'visible' });
    await page.fill('input[placeholder="Search apps and items..."]', appName);
    
    // Click on the app
    console.log(`Selecting ${appName} app`);
    await page.waitForSelector(`lightning-formatted-rich-text:has-text("${appName}")`, { state: 'visible' });
    await page.click(`lightning-formatted-rich-text:has-text("${appName}")`);
    
    // Wait for page to load after navigation
    await waitForPageLoad(page);
    await waitForSpinner(page);
  } catch (error) {
    console.error(`Error navigating to ${appName}: ${error.message}`);
    throw error;
  }
}

module.exports = {
  waitForPageLoad,
  waitForSpinner,
  navigateToApp
};
/**
 * Salesforce Test Helper
 * 
 * Provides helper methods for Salesforce tests
 */
const { expect } = require('@playwright/test');
const SalesforceInteractions = require('./SalesforceInteractions');
const logger = require('../common/logger');

/**
 * Salesforce Test Helper class
 */
class SalesforceTestHelper {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page
   */
  constructor(page) {
    this.page = page;
    this.sfInteractions = new SalesforceInteractions(page);
  }

  /**
   * Wait for Salesforce page to load completely
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForSalesforcePageLoad(timeout = 30000) {
    // Wait for network to be idle
    await this.page.waitForLoadState('networkidle', { timeout }).catch(() => {
      logger.warn('Network did not reach idle state, continuing anyway');
    });
    
    // Wait for DOM content to be loaded
    await this.page.waitForLoadState('domcontentloaded', { timeout });
    
    // Wait for Salesforce spinner to disappear if present
    await this.sfInteractions.waitForSpinner(timeout);
    
    // Small additional wait to ensure UI is stable
    await this.page.waitForTimeout(1000);
  }

  /**
   * Verify toast message appears
   * @param {string} type - Toast type: 'success', 'error', or 'info'
   * @param {string} [expectedMessage] - Expected message text (optional)
   * @param {number} timeout - Timeout in milliseconds
   */
  async verifyToastMessage(type = 'success', expectedMessage = null, timeout = 5000) {
    const toastAppeared = await this.sfInteractions.waitForToast(type, expectedMessage, timeout);
    expect(toastAppeared, `Expected ${type} toast to appear${expectedMessage ? ` with message containing "${expectedMessage}"` : ''}`).toBeTruthy();
  }

  /**
   * Take a screenshot with context information
   * @param {string} name - Screenshot name
   */
  async takeScreenshotWithContext(name) {
    await this.sfInteractions.takeScreenshotWithContext(name);
  }

  /**
   * Check for errors on the page
   */
  async checkForErrors() {
    const error = await this.sfInteractions.checkForErrors();
    expect(error, `Unexpected error on page: ${error}`).toBeNull();
  }

  /**
   * Navigate to a Salesforce tab
   * @param {string} tabName - Tab name
   */
  async navigateToTab(tabName) {
    await this.sfInteractions.navigateToTab(tabName);
  }

  /**
   * Navigate to object list view
   * @param {string} objectKey - Object key
   * @param {string} [filterName] - Optional filter name
   */
  async navigateToObjectList(objectKey, filterName = '__Recent') {
    await this.sfInteractions.navigateToObjectList(objectKey, filterName);
  }
}

module.exports = SalesforceTestHelper;
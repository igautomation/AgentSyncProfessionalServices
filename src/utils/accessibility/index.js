/**
 * Accessibility testing utilities for Playwright
 */
const { AccessibilityUtils } = require('./accessibilityUtils');

// Check if canvas is available
let canvasAvailable = true;
try {
  require('canvas');
} catch (error) {
  canvasAvailable = false;
  console.warn('Canvas library is not available. Some accessibility features may be limited.');
}

module.exports = {
  AccessibilityUtils,
  canvasAvailable,
  
  /**
   * Get accessibility violations
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @param {Object} options - Options for accessibility check
   * @returns {Promise<Array>} Array of accessibility violations
   */
  async getViolations(page, options = {}) {
    const accessibilityUtils = new AccessibilityUtils(page);
    return await accessibilityUtils.getViolations(options);
  },
  
  /**
   * Check accessibility with filtering by impact
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @param {Object} options - Options for accessibility check
   * @returns {Promise<{passes: boolean, violations: Array}>} Result of accessibility check
   */
  async checkAccessibility(page, options = {}) {
    const accessibilityUtils = new AccessibilityUtils(page);
    return await accessibilityUtils.checkAccessibility(options);
  },
  
  /**
   * Generate accessibility report
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @param {string} reportPath - Path to save report
   * @param {Object} options - Report options
   * @returns {Promise<string>} Path to the generated report
   */
  async generateAccessibilityReport(page, reportPath, options = {}) {
    const accessibilityUtils = new AccessibilityUtils(page);
    const result = await accessibilityUtils.audit(options);
    return await accessibilityUtils.generateReport(result, reportPath);
  }
};
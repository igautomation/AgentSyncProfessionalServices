/**
 * Salesforce utilities
 * Provides utilities for working with Salesforce
 */

module.exports = {
  // Authentication
  auth: require('./auth'),
  
  // API utilities
  api: require('./api'),
  
  // UI utilities
  ui: require('./ui'),
  
  // Data utilities
  data: require('./data'),
  
  // Global setup
  globalSetup: require('./global-setup'),
  
  /**
   * Login to Salesforce
   * @param {Page} page - Playwright page
   * @param {Object} options - Login options
   * @returns {Promise<void>}
   */
  login: async (page, options = {}) => {
    const auth = require('./auth');
    return auth.login(page, options);
  },
  
  /**
   * Navigate to a Salesforce tab
   * @param {Page} page - Playwright page
   * @param {string} tabName - Tab name
   * @returns {Promise<void>}
   */
  navigateToTab: async (page, tabName) => {
    const ui = require('./ui');
    return ui.navigateToTab(page, tabName);
  },
  
  /**
   * Create a Salesforce record
   * @param {Object} options - Record options
   * @returns {Promise<Object>} Created record
   */
  createRecord: async (options = {}) => {
    const api = require('./api');
    return api.createRecord(options);
  },
  
  /**
   * Query Salesforce records
   * @param {string} soql - SOQL query
   * @returns {Promise<Array>} Query results
   */
  query: async (soql) => {
    const api = require('./api');
    return api.query(soql);
  }
};
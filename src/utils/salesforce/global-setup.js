/**
 * Salesforce global setup
 * Used for setting up Salesforce environment before tests
 */

const auth = require('./auth');
const api = require('./api');
const logger = require('../common/logger');

/**
 * Setup Salesforce environment
 * @param {Object} options - Setup options
 * @returns {Promise<Object>} Setup result
 */
async function setup(options = {}) {
  try {
    // Login to Salesforce
    const conn = await auth.loginWithCredentials(options);
    
    // Store connection for later use
    global.__SALESFORCE_CONN__ = conn;
    
    logger.info('Salesforce global setup completed successfully');
    
    return {
      success: true,
      connection: conn
    };
  } catch (error) {
    logger.error(`Salesforce global setup failed: ${error.message}`);
    throw error;
  }
}

/**
 * Teardown Salesforce environment
 * @returns {Promise<void>}
 */
async function teardown() {
  try {
    // Logout from Salesforce if connection exists
    if (global.__SALESFORCE_CONN__) {
      await global.__SALESFORCE_CONN__.logout();
      delete global.__SALESFORCE_CONN__;
    }
    
    logger.info('Salesforce global teardown completed successfully');
  } catch (error) {
    logger.error(`Salesforce global teardown failed: ${error.message}`);
  }
}

module.exports = {
  setup,
  teardown
};
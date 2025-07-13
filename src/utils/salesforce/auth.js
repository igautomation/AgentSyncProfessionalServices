/**
 * Salesforce authentication utilities
 */

const jsforce = require('jsforce');
const logger = require('../common/logger');

/**
 * Login to Salesforce using username and password
 * @param {Object} options - Login options
 * @param {string} options.username - Salesforce username
 * @param {string} options.password - Salesforce password
 * @param {string} options.securityToken - Salesforce security token
 * @param {string} options.loginUrl - Salesforce login URL
 * @returns {Promise<Object>} Salesforce connection
 */
async function loginWithCredentials(options = {}) {
  const {
    username = process.env.SF_USERNAME,
    password = process.env.SF_PASSWORD,
    securityToken = process.env.SF_SECURITY_TOKEN || '',
    loginUrl = process.env.SF_LOGIN_URL || 'https://login.salesforce.com'
  } = options;

  if (!username || !password) {
    throw new Error('Salesforce username and password are required');
  }

  const conn = new jsforce.Connection({ loginUrl });
  
  try {
    await conn.login(username, password + securityToken);
    logger.info(`Logged in to Salesforce as ${username}`);
    return conn;
  } catch (error) {
    logger.error(`Salesforce login failed: ${error.message}`);
    throw error;
  }
}

/**
 * Login to Salesforce using Playwright
 * @param {Page} page - Playwright page
 * @param {Object} options - Login options
 * @returns {Promise<void>}
 */
async function login(page, options = {}) {
  const {
    username = process.env.SF_USERNAME,
    password = process.env.SF_PASSWORD,
    loginUrl = process.env.SF_LOGIN_URL || 'https://login.salesforce.com'
  } = options;

  if (!username || !password) {
    throw new Error('Salesforce username and password are required');
  }

  try {
    await page.goto(loginUrl);
    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('#Login');
    await page.waitForNavigation();
    logger.info(`Logged in to Salesforce UI as ${username}`);
  } catch (error) {
    logger.error(`Salesforce UI login failed: ${error.message}`);
    throw error;
  }
}

module.exports = {
  loginWithCredentials,
  login
};
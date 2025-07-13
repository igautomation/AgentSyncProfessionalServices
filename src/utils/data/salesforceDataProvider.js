/**
 * Salesforce Data Provider
 * 
 * Provides test data for Salesforce tests
 */
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: '.env.dev' });
// Also try to load Salesforce-specific variables if the file exists
try {
  if (require('fs').existsSync('.env.salesforce')) {
    dotenv.config({ path: '.env.salesforce' });
  }
} catch (error) {
  console.log('No Salesforce-specific env file found, using default');
}

/**
 * Salesforce Data Provider class
 */
class SalesforceDataProvider {
  constructor() {
    this.credentials = {
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASSWORD,
      loginUrl: process.env.SF_LOGIN_URL,
      instanceUrl: process.env.SF_INSTANCE_URL
    };
  }

  /**
   * Get login credentials
   * @returns {Object} Login credentials
   */
  getLoginCredentials() {
    return {
      username: this.credentials.username,
      password: this.credentials.password,
      loginUrl: this.credentials.loginUrl
    };
  }

  /**
   * Generate account data with unique name
   * @param {Object} options - Options for account data
   * @returns {Object} Account data
   */
  generateAccountData(options = {}) {
    const timestamp = Date.now();
    return {
      name: options.name || `AgentSync${timestamp}`,
      rating: options.rating || 'Hot',
      parentAccount: options.parentAccount || 'Postman',
      accountNumber: options.accountNumber || `AS-${timestamp}`,
      type: options.type || 'Customer - Direct',
      ownership: options.ownership || 'Public'
    };
  }

  /**
   * Generate contact data with unique values
   * @param {Object} options - Options for contact data
   * @returns {Object} Contact data
   */
  generateContactData(options = {}) {
    const timestamp = Date.now();
    return {
      salutation: options.salutation || 'Mr.',
      firstName: options.firstName || 'Test',
      lastName: options.lastName || `LN${timestamp}`,
      email: options.email || `test.ln${timestamp}@example.com`,
      phone: options.phone || `555-${timestamp.toString().slice(-7)}`,
      title: options.title || 'Manager',
      department: options.department || 'Sales',
      leadSource: options.leadSource || 'Partner Referral',
      level: options.level || 'Primary',
      accountName: options.accountName
    };
  }

  /**
   * Load test data from file
   * @param {string} fileName - Name of the file to load
   * @returns {Object} Test data
   */
  loadTestData(fileName) {
    try {
      const dataPath = path.join(process.cwd(), 'src', 'data', fileName);
      if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        
        if (fileName.endsWith('.json')) {
          return JSON.parse(fileContent);
        } else if (fileName.endsWith('.csv')) {
          // Simple CSV parsing (for more complex needs, use a CSV library)
          const lines = fileContent.split('\n');
          const headers = lines[0].split(',');
          return lines.slice(1).map(line => {
            const values = line.split(',');
            const record = {};
            headers.forEach((header, index) => {
              record[header.trim()] = values[index]?.trim() || '';
            });
            return record;
          });
        }
      }
      return null;
    } catch (error) {
      console.error(`Error loading test data: ${error.message}`);
      return null;
    }
  }
}

module.exports = new SalesforceDataProvider();
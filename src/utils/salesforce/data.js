/**
 * Salesforce data utilities
 */

const api = require('./api');
const logger = require('../common/logger');

/**
 * Generate test data for Salesforce objects
 * @param {string} objectName - Salesforce object name
 * @param {Object} template - Data template
 * @param {number} count - Number of records to generate
 * @returns {Array<Object>} Generated data
 */
function generateTestData(objectName, template = {}, count = 1) {
  const faker = require('@faker-js/faker').faker;
  const results = [];
  
  for (let i = 0; i < count; i++) {
    const record = { ...template };
    
    // Replace placeholders with faker data
    for (const key in record) {
      if (typeof record[key] === 'string' && record[key].startsWith('{{') && record[key].endsWith('}}')) {
        const fakerPath = record[key].substring(2, record[key].length - 2).trim();
        const parts = fakerPath.split('.');
        
        let fakerValue = faker;
        for (const part of parts) {
          fakerValue = fakerValue[part];
        }
        
        record[key] = typeof fakerValue === 'function' ? fakerValue() : fakerValue;
      }
    }
    
    results.push(record);
  }
  
  logger.info(`Generated ${count} test records for ${objectName}`);
  return results;
}

/**
 * Create test data in Salesforce
 * @param {string} objectName - Salesforce object name
 * @param {Array<Object>} data - Data to create
 * @returns {Promise<Array<Object>>} Created records
 */
async function createTestData(objectName, data) {
  const results = [];
  
  for (const record of data) {
    try {
      const result = await api.createRecord({ objectName, data: record });
      results.push(result);
    } catch (error) {
      logger.error(`Error creating test data for ${objectName}: ${error.message}`);
    }
  }
  
  logger.info(`Created ${results.length} test records for ${objectName}`);
  return results;
}

/**
 * Clean up test data from Salesforce
 * @param {string} objectName - Salesforce object name
 * @param {Array<string>} recordIds - Record IDs to delete
 * @returns {Promise<number>} Number of deleted records
 */
async function cleanupTestData(objectName, recordIds) {
  let deletedCount = 0;
  
  for (const recordId of recordIds) {
    try {
      await api.deleteRecord({ objectName, recordId });
      deletedCount++;
    } catch (error) {
      logger.error(`Error deleting test data for ${objectName}: ${error.message}`);
    }
  }
  
  logger.info(`Deleted ${deletedCount} test records for ${objectName}`);
  return deletedCount;
}

module.exports = {
  generateTestData,
  createTestData,
  cleanupTestData
};
/**
 * Salesforce API utilities
 */

const jsforce = require('jsforce');
const logger = require('../common/logger');
const auth = require('./auth');

let connection = null;

/**
 * Get Salesforce connection
 * @param {Object} options - Connection options
 * @returns {Promise<Object>} Salesforce connection
 */
async function getConnection(options = {}) {
  if (connection && connection.accessToken) {
    return connection;
  }
  
  connection = await auth.loginWithCredentials(options);
  return connection;
}

/**
 * Query Salesforce records
 * @param {string} soql - SOQL query
 * @param {Object} options - Connection options
 * @returns {Promise<Array>} Query results
 */
async function query(soql, options = {}) {
  const conn = await getConnection(options);
  
  try {
    const result = await conn.query(soql);
    logger.info(`Salesforce query returned ${result.records.length} records`);
    return result.records;
  } catch (error) {
    logger.error(`Salesforce query failed: ${error.message}`);
    throw error;
  }
}

/**
 * Create a Salesforce record
 * @param {Object} options - Record options
 * @param {string} options.objectName - Salesforce object name
 * @param {Object} options.data - Record data
 * @returns {Promise<Object>} Created record
 */
async function createRecord(options = {}) {
  const { objectName, data } = options;
  
  if (!objectName || !data) {
    throw new Error('Object name and data are required');
  }
  
  const conn = await getConnection();
  
  try {
    const result = await conn.sobject(objectName).create(data);
    
    if (result.success) {
      logger.info(`Created ${objectName} record with ID: ${result.id}`);
      return { id: result.id, ...data };
    } else {
      throw new Error(`Failed to create ${objectName} record: ${result.errors.join(', ')}`);
    }
  } catch (error) {
    logger.error(`Error creating ${objectName} record: ${error.message}`);
    throw error;
  }
}

/**
 * Update a Salesforce record
 * @param {Object} options - Record options
 * @param {string} options.objectName - Salesforce object name
 * @param {string} options.recordId - Record ID
 * @param {Object} options.data - Record data
 * @returns {Promise<Object>} Updated record
 */
async function updateRecord(options = {}) {
  const { objectName, recordId, data } = options;
  
  if (!objectName || !recordId || !data) {
    throw new Error('Object name, record ID, and data are required');
  }
  
  const conn = await getConnection();
  
  try {
    const result = await conn.sobject(objectName).update({ Id: recordId, ...data });
    
    if (result.success) {
      logger.info(`Updated ${objectName} record with ID: ${recordId}`);
      return { id: recordId, ...data };
    } else {
      throw new Error(`Failed to update ${objectName} record: ${result.errors.join(', ')}`);
    }
  } catch (error) {
    logger.error(`Error updating ${objectName} record: ${error.message}`);
    throw error;
  }
}

/**
 * Delete a Salesforce record
 * @param {Object} options - Record options
 * @param {string} options.objectName - Salesforce object name
 * @param {string} options.recordId - Record ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteRecord(options = {}) {
  const { objectName, recordId } = options;
  
  if (!objectName || !recordId) {
    throw new Error('Object name and record ID are required');
  }
  
  const conn = await getConnection();
  
  try {
    const result = await conn.sobject(objectName).destroy(recordId);
    
    if (result.success) {
      logger.info(`Deleted ${objectName} record with ID: ${recordId}`);
      return true;
    } else {
      throw new Error(`Failed to delete ${objectName} record: ${result.errors.join(', ')}`);
    }
  } catch (error) {
    logger.error(`Error deleting ${objectName} record: ${error.message}`);
    throw error;
  }
}

module.exports = {
  getConnection,
  query,
  createRecord,
  updateRecord,
  deleteRecord
};
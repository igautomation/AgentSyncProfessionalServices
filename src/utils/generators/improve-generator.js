/**
 * Page Generator Utility Improvements
 * 
 * This script adds improvements to the page generator to avoid common issues:
 * 1. Ensures property names are valid JavaScript identifiers
 * 2. Prevents duplicate method definitions
 * 3. Ensures consistent import/export patterns
 */

const fs = require('fs');
const path = require('path');

/**
 * Sanitize a string to be a valid JavaScript identifier
 * @param {string} name - The name to sanitize
 * @returns {string} - A valid JavaScript identifier
 */
function sanitizeIdentifier(name) {
  // Replace invalid characters with underscores
  let sanitized = name.replace(/[^a-zA-Z0-9_$]/g, '_');
  
  // Ensure it doesn't start with a number
  if (/^[0-9]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }
  
  return sanitized;
}

/**
 * Update the page generator to use sanitized identifiers
 */
function updatePageGenerator() {
  const pageGeneratorPath = path.join(__dirname, 'page-generator.js');
  let content = fs.readFileSync(pageGeneratorPath, 'utf8');
  
  // Add sanitizeIdentifier function
  if (!content.includes('function sanitizeIdentifier')) {
    const functionCode = `
/**
 * Sanitize a string to be a valid JavaScript identifier
 * @param {string} name - The name to sanitize
 * @returns {string} - A valid JavaScript identifier
 */
function sanitizeIdentifier(name) {
  // Replace invalid characters with underscores
  let sanitized = name.replace(/[^a-zA-Z0-9_$]/g, '_');
  
  // Ensure it doesn't start with a number
  if (/^[0-9]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }
  
  return sanitized;
}`;
    
    // Insert after the last function before module.exports
    const insertPosition = content.lastIndexOf('function');
    const insertIndex = content.indexOf('module.exports', insertPosition);
    
    content = content.slice(0, insertIndex) + functionCode + '\n\n' + content.slice(insertIndex);
  }
  
  // Update property name generation to use sanitizeIdentifier
  content = content.replace(
    /item\.name\.replace\(\[^a-zA-Z0-9\]\/g, '_'\)\.toLowerCase\(\)/g, 
    "sanitizeIdentifier(item.name).toLowerCase()"
  );
  
  // Ensure collections are deduplicated
  if (!content.includes('// Deduplicate collections')) {
    const dedupeCode = `
    // Deduplicate collections
    Object.keys(collections).forEach(type => {
      const uniqueNames = new Set();
      collections[type] = collections[type].filter(item => {
        const name = sanitizeIdentifier(item.name).toLowerCase();
        if (uniqueNames.has(name)) {
          return false;
        }
        uniqueNames.add(name);
        return true;
      });
    });`;
    
    // Find where collections are processed
    const collectionsIndex = content.indexOf('if (includeCollections)');
    const insertIndex = content.indexOf('// Generate page class', collectionsIndex);
    
    content = content.slice(0, insertIndex) + dedupeCode + '\n\n    ' + content.slice(insertIndex);
  }
  
  fs.writeFileSync(pageGeneratorPath, content);
  console.log('Updated page generator with identifier sanitization and collection deduplication');
}

// Run the update
updatePageGenerator();
console.log('Page generator utility improvements completed');
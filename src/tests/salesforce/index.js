/**
 * Salesforce Tests Index
 * 
 * This file serves as documentation for the Salesforce test files in this directory.
 */

module.exports = {
  // Test files
  fixedLogin: require('./fixed-sf-login.spec.js'),
  fixedAccountContact: require('./fixed-account-contact.spec.js'),
  minimalNavigation: require('./minimal-navigation.spec.js'),
  apiMock: require('./salesforce-api-mock.spec.js'),
  
  // Setup files
  globalSetup: require('./global-setup.js')
};
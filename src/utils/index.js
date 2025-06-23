/**
 * Framework Utilities
 * 
 * Exports all utility modules
 */

// API utilities
const api = require('./api');

// Common utilities
const common = require('./common');

// Web utilities
const web = require('./web');

// Reporting utilities
const reporting = require('./reporting');

// Database utilities
const database = require('./database');

// Visual testing utilities
const visual = require('./visual');

// Accessibility testing utilities
const accessibility = require('./accessibility');

// Performance testing utilities
const performance = require('./performance');

// Mobile testing utilities
const mobile = require('./mobile');

// Localization utilities
const localization = require('./localization');

// Security utilities
const security = require('./security');

// Test management utilities
const testrail = require('./testrail');

// Salesforce utilities
const salesforce = require('./salesforce');

// Scheduler utilities
const scheduler = require('./scheduler');

// Plugin utilities
const plugins = require('./plugins');

module.exports = {
  api,
  web,
  common,
  reporting,
  database,
  visual,
  accessibility,
  performance,
  mobile,
  localization,
  security,
  testrail,
  salesforce,
  scheduler,
  plugins
};
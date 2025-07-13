/**
 * AgentSync Master Test Framework
 * Main entry point combining Professional Services and Playwright specialization
 */

// Core utilities
const utils = require('./utils');
const config = require('./config');
const fixtures = require('./fixtures');
const pages = require('./pages');

// Specialized exports
const { 
  AccessibilityUtils,
  ApiClient,
  SalesforceTestHelper,
  TestRailIntegration,
  ReportingUtils,
  PerformanceUtils,
  ChartGenerator,
  DataGenerator
} = utils;

module.exports = {
  // Core modules
  utils,
  config,
  fixtures,
  pages,
  
  // Direct utility access
  AccessibilityUtils,
  ApiClient,
  SalesforceTestHelper,
  TestRailIntegration,
  ReportingUtils,
  PerformanceUtils,
  ChartGenerator,
  DataGenerator,
  
  // Framework metadata
  version: require('../package.json').version,
  name: 'AgentSync Master Test Framework'
};
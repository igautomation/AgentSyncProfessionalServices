/**
 * AgentSync Master Framework - Consolidated Utilities
 * Combines unique features from Professional Services and Playwright specialization
 */

// Professional Services Features
const accessibility = require('./accessibility');
const api = require('./api');
const ci = require('./ci');
const cli = require('./cli');
const common = require('./common');
const core = require('./core');
const data = require('./data');
const database = require('./database');
const generators = require('./generators');
const git = require('./git');
const localization = require('./localization');
const mobile = require('./mobile');
const performance = require('./performance');
const plugins = require('./plugins');
const reporting = require('./reporting');
const scheduler = require('./scheduler');
const security = require('./security');
const setup = require('./setup');
const testing = require('./testing');
const visual = require('./visual');
const visualization = require('./visualization');
const web = require('./web');
const xray = require('./xray');

// Enhanced Playwright Specialization Features
const salesforce = require('./salesforce');
const testrail = require('./testrail');

// Direct utility exports for convenience
const { AccessibilityUtils } = accessibility;
const { ApiClient, GraphQLUtils, RestUtils } = api;
const { SalesforceTestHelper, SalesforceApiUtils, SoqlBuilder } = salesforce;
const { TestRailIntegration, TestCaseMapper } = testrail;
const { ReportingUtils, CustomReporter } = reporting;
const { PerformanceUtils } = performance;
const { ChartGenerator, DataAnalyzer } = visualization;
const { DataGenerator } = data;
const { WebInteractions, SelfHealingLocator } = web;

module.exports = {
  // Module exports
  accessibility,
  api,
  ci,
  cli,
  common,
  core,
  data,
  database,
  generators,
  git,
  localization,
  mobile,
  performance,
  plugins,
  reporting,
  salesforce,
  scheduler,
  security,
  setup,
  testing,
  testrail,
  visual,
  visualization,
  web,
  xray,
  
  // Direct utility access
  AccessibilityUtils,
  ApiClient,
  GraphQLUtils,
  RestUtils,
  SalesforceTestHelper,
  SalesforceApiUtils,
  SoqlBuilder,
  TestRailIntegration,
  TestCaseMapper,
  ReportingUtils,
  CustomReporter,
  PerformanceUtils,
  ChartGenerator,
  DataAnalyzer,
  DataGenerator,
  WebInteractions,
  SelfHealingLocator
};
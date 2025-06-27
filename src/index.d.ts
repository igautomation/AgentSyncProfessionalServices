/**
 * Type definitions for @igautomation/agentsyncprofessionalservices
 */

declare module '@igautomation/agentsyncprofessionalservices' {
  import { test as playwrightTest } from '@playwright/test';

  export const utils: {
    api: any;
    web: any;
    common: any;
    reporting: any;
    database: any;
    visual: any;
    accessibility: any;
    performance: any;
    mobile: any;
    localization: any;
    security: any;
    testrail: any;
    salesforce: any;
    scheduler: any;
    plugins: any;
  };

  export const fixtures: any;
  export const customFixtures: any;

  export const pages: {
    BasePage: any;
  };

  export const locators: {
    SelfHealingLocator: any;
  };

  export const config: {
    baseConfig: any;
  };

  /**
   * Load framework configuration
   */
  export function loadFrameworkConfig(): any;

  /**
   * Load plugins
   */
  export function loadPlugins(): any;

  /**
   * Get plugin by name
   */
  export function getPlugin(name: string): any;

  /**
   * Create a custom reporter
   */
  export function createReporter(options?: any): any;

  /**
   * Create custom fixtures
   */
  export function createFixtures(fixtures?: any): typeof playwrightTest;

  /**
   * Initialize a new project
   */
  export function initProject(options?: any): Promise<void>;

  /**
   * Framework version
   */
  export const version: string;
}

// Add submodule declarations for all the exports in package.json
declare module '@igautomation/agentsyncprofessionalservices/cli' {
  const cli: any;
  export = cli;
}

declare module '@igautomation/agentsyncprofessionalservices/generate-page' {
  const generatePage: any;
  export = generatePage;
}

declare module '@igautomation/agentsyncprofessionalservices/generate-selectors' {
  const generateSelectors: any;
  export = generateSelectors;
}

declare module '@igautomation/agentsyncprofessionalservices/bin' {
  const bin: any;
  export = bin;
}

declare module '@igautomation/agentsyncprofessionalservices/setup' {
  const setup: any;
  export = setup;
}

declare module '@igautomation/agentsyncprofessionalservices/templates' {
  const templates: any;
  export = templates;
}

declare module '@igautomation/agentsyncprofessionalservices/playwright-config' {
  const playwrightConfig: any;
  export = playwrightConfig;
}

declare module '@igautomation/agentsyncprofessionalservices/salesforce-config' {
  const salesforceConfig: any;
  export = salesforceConfig;
}

declare module '@igautomation/agentsyncprofessionalservices/global-setup' {
  const globalSetup: any;
  export = globalSetup;
}

declare module '@igautomation/agentsyncprofessionalservices/utils/*' {
  const utils: any;
  export = utils;
}

declare module '@igautomation/agentsyncprofessionalservices/fixtures/*' {
  const fixtures: any;
  export = fixtures;
}

declare module '@igautomation/agentsyncprofessionalservices/pages/*' {
  const pages: any;
  export = pages;
}

declare module '@igautomation/agentsyncprofessionalservices/config/*' {
  const config: any;
  export = config;
}

declare module '@igautomation/agentsyncprofessionalservices/tests/*' {
  const tests: any;
  export = tests;
}

declare module '@igautomation/agentsyncprofessionalservices/examples/*' {
  const examples: any;
  export = examples;
}

declare module '@igautomation/agentsyncprofessionalservices/data' {
  const data: any;
  export = data;
}

declare module '@igautomation/agentsyncprofessionalservices/dashboard' {
  const dashboard: any;
  export = dashboard;
}

declare module '@igautomation/agentsyncprofessionalservices/helpers' {
  const helpers: any;
  export = helpers;
}

declare module '@igautomation/agentsyncprofessionalservices/templates/*' {
  const templates: any;
  export = templates;
}

declare module '@igautomation/agentsyncprofessionalservices/scripts/*' {
  const scripts: any;
  export = scripts;
}

declare module '@igautomation/agentsyncprofessionalservices/docs/*' {
  const docs: any;
  export = docs;
}

declare module '@igautomation/agentsyncprofessionalservices/locales' {
  const locales: any;
  export = locales;
}
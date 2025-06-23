/**
 * Project initialization utility
 * Creates necessary files and directories for a new project
 */

const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Initialize a new project with framework files
 * @param {Object} options - Project options
 * @param {string} options.projectName - Name of the project
 * @param {string} options.projectPath - Path to create the project
 * @param {boolean} options.includeSalesforce - Whether to include Salesforce templates
 * @returns {Promise<void>}
 */
async function initProject(options = {}) {
  const {
    projectName = 'agentsync-project',
    projectPath = process.cwd(),
    includeSalesforce = false
  } = options;

  const projectDir = path.join(projectPath, projectName);

  // Create project directory
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
    logger.info(`Created project directory: ${projectDir}`);
  }

  // Create basic directory structure
  const directories = [
    'tests',
    'tests/api',
    'tests/web',
    'pages',
    'fixtures',
    'utils',
    'config',
    'reports'
  ];

  if (includeSalesforce) {
    directories.push('tests/salesforce', 'pages/salesforce');
  }

  directories.forEach(dir => {
    const dirPath = path.join(projectDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });

  // Create basic configuration files
  const configFiles = [
    {
      path: 'playwright.config.js',
      content: getPlaywrightConfig(projectName)
    },
    {
      path: '.env.example',
      content: getEnvExample(includeSalesforce)
    },
    {
      path: 'package.json',
      content: getPackageJson(projectName)
    },
    {
      path: 'README.md',
      content: getReadme(projectName)
    }
  ];

  configFiles.forEach(file => {
    const filePath = path.join(projectDir, file.path);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      logger.info(`Created file: ${file.path}`);
    }
  });

  logger.info(`Project ${projectName} initialized successfully!`);
  logger.info(`Next steps:
  1. cd ${projectName}
  2. npm install
  3. cp .env.example .env
  4. Edit .env with your configuration
  5. npm test`);

  return {
    projectName,
    projectPath: projectDir,
    success: true
  };
}

/**
 * Get Playwright configuration template
 * @param {string} projectName - Project name
 * @returns {string} Configuration content
 */
function getPlaywrightConfig(projectName) {
  return `// @ts-check
const { defineConfig } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    actionTimeout: 0,
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium'
      },
    },
    {
      name: 'api',
      testMatch: /.*api\\/.*\\.spec\\.js/
    }
  ]
});
`;
}

/**
 * Get environment variables example template
 * @param {boolean} includeSalesforce - Whether to include Salesforce variables
 * @returns {string} Environment variables content
 */
function getEnvExample(includeSalesforce) {
  let content = `# Base URLs
BASE_URL=http://localhost:3000
API_URL=http://localhost:3000/api

# Authentication
USERNAME=admin
PASSWORD=admin123

# Test Configuration
HEADLESS=true
SLOW_MO=0
RETRY_COUNT=2
`;

  if (includeSalesforce) {
    content += `
# Salesforce Configuration
SF_USERNAME=your.username@example.com
SF_PASSWORD=yourpassword
SF_SECURITY_TOKEN=yoursecuritytoken
SF_LOGIN_URL=https://login.salesforce.com
`;
  }

  return content;
}

/**
 * Get package.json template
 * @param {string} projectName - Project name
 * @returns {string} Package.json content
 */
function getPackageJson(projectName) {
  return JSON.stringify({
    name: projectName,
    version: '0.1.0',
    description: 'Test automation project using AgentSync framework',
    scripts: {
      test: 'playwright test',
      'test:headed': 'playwright test --headed',
      'test:api': 'playwright test tests/api',
      'test:web': 'playwright test tests/web',
      report: 'playwright show-report'
    },
    dependencies: {
      '@agentsync/test-framework': '^1.0.0',
      '@playwright/test': '^1.53.1'
    }
  }, null, 2);
}

/**
 * Get README template
 * @param {string} projectName - Project name
 * @returns {string} README content
 */
function getReadme(projectName) {
  return `# ${projectName}

Test automation project using AgentSync framework.

## Setup

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Configure environment variables:
   \`\`\`
   cp .env.example .env
   \`\`\`
   Edit the .env file with your configuration.

3. Run tests:
   \`\`\`
   npm test
   \`\`\`

## Project Structure

- \`tests/\`: Test files
  - \`api/\`: API tests
  - \`web/\`: Web UI tests
- \`pages/\`: Page objects
- \`fixtures/\`: Test fixtures
- \`utils/\`: Utility functions
- \`config/\`: Configuration files
- \`reports/\`: Test reports

## Documentation

For more information, see the [AgentSync Framework documentation](https://docs.example.com/agentsync).
`;
}

module.exports = initProject;
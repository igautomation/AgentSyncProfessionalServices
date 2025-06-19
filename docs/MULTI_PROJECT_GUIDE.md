# Multi-Project Framework Usage Guide

This guide explains how to use the AgentSync Test Framework across multiple projects.

## Table of Contents

1. [Overview](#overview)
2. [Repository Structure](#repository-structure)
3. [Setting Up a New Project](#setting-up-a-new-project)
4. [Framework Updates](#framework-updates)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Overview

The AgentSync Test Framework is designed to be used across multiple projects, providing a consistent testing approach while allowing project-specific customizations.

### Key Benefits

- **Centralized Framework**: Single source of truth for test utilities
- **Easy Project Setup**: One command to initialize new projects
- **Version Management**: Semantic versioning with automated releases
- **Consistent Configuration**: Standardized setup across all projects
- **Self-Healing Locators**: Built-in resilience for UI changes

## Repository Structure

We recommend the following repository structure:

```
framework-repo/                      # Framework repository
├── src/                             # Framework source code
├── package.json                     # Framework package definition
└── README.md                        # Framework documentation

project-1-repo/                      # Project 1 repository
├── tests/                           # Test files
├── package.json                     # Project dependencies (includes framework)
└── playwright.config.js             # Project-specific configuration

project-2-repo/                      # Project 2 repository
├── tests/                           # Test files
├── package.json                     # Project dependencies (includes framework)
└── playwright.config.js             # Project-specific configuration
```

## Setting Up a New Project

### Using the CLI

The easiest way to set up a new project is using the framework CLI:

```bash
# Install the framework globally (one-time setup)
npm install -g @agentsync/test-framework

# Create a new project
mkdir my-new-project
cd my-new-project
agentsync-framework init --name "My New Project"
```

### Manual Setup

If you prefer to set up manually:

1. Create a new directory for your project
2. Create a `package.json` file:
   ```json
   {
     "name": "my-project-tests",
     "version": "1.0.0",
     "description": "Test automation for My Project",
     "scripts": {
       "test": "playwright test",
       "test:headed": "playwright test --headed",
       "test:debug": "playwright test --debug",
       "test:ui": "playwright test --ui",
       "report": "playwright show-report"
     },
     "dependencies": {
       "@agentsync/test-framework": "^1.0.0"
     },
     "devDependencies": {
       "@playwright/test": "^1.40.0",
       "dotenv": "^16.3.1"
     }
   }
   ```

3. Create a `playwright.config.js` file:
   ```javascript
   const { defineConfig, devices } = require('@playwright/test');
   const { baseConfig } = require('@agentsync/test-framework').config;
   require('dotenv').config();

   module.exports = defineConfig({
     ...baseConfig,
     testDir: './tests',
     use: {
       baseURL: process.env.BASE_URL || 'https://your-app.com',
     },
     projects: [
       {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'] }
       },
       {
         name: 'firefox',
         use: { ...devices['Desktop Firefox'] }
       }
     ]
   });
   ```

4. Create a `.env` file:
   ```
   BASE_URL=https://your-app.com
   HEADLESS=true
   ```

5. Install dependencies:
   ```bash
   npm install
   ```

## Framework Updates

### Updating the Framework

To update the framework in a project:

```bash
# Using the CLI
agentsync-framework update

# Or manually
npm update @agentsync/test-framework
```

### Version Management

The framework follows semantic versioning:

- **Major (X.0.0)**: Breaking changes
- **Minor (1.X.0)**: New features, backward compatible
- **Patch (1.2.X)**: Bug fixes

In your project's `package.json`, use the caret (`^`) to allow compatible updates:

```json
"dependencies": {
  "@agentsync/test-framework": "^1.0.0"
}
```

## Best Practices

### Project Structure

```
my-project/
├── tests/
│   ├── e2e/              # End-to-end tests
│   ├── api/              # API tests
│   ├── pages/            # Page objects
│   └── components/       # Reusable components
├── auth/                 # Authentication state
├── reports/              # Test reports
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── playwright.config.js  # Playwright configuration
```

### Using Self-Healing Locators

```javascript
const { test, expect } = require('@playwright/test');
const { SelfHealingLocator } = require('@agentsync/test-framework').locators;

test('should use self-healing locator', async ({ page }) => {
  const button = new SelfHealingLocator(page, '#submit-button', {
    fallbackStrategies: [
      { selector: 'button[type="submit"]' },
      { selector: 'text=Submit' }
    ]
  });
  
  const element = await button.locate();
  await element.click();
});
```

### Environment Variables

Store environment-specific configuration in `.env` files:

```
# .env.dev
BASE_URL=https://dev.your-app.com
API_BASE_URL=https://dev-api.your-app.com

# .env.prod
BASE_URL=https://your-app.com
API_BASE_URL=https://api.your-app.com
```

Load the appropriate environment:

```bash
# Load dev environment
cp .env.dev .env
npm test

# Load prod environment
cp .env.prod .env
npm test
```

### CI/CD Integration

Each project should have its own CI/CD workflow:

```yaml
# .github/workflows/project-tests.yml
name: Project Tests
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@agentsync'
      
      - name: Install dependencies
        run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Run tests
        run: npm test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
```

## Troubleshooting

### Common Issues

#### Authentication to GitHub Packages

If you see errors accessing the framework package:

1. Create a Personal Access Token (PAT) with `read:packages` scope
2. Add to your `.npmrc` file:
   ```
   //npm.pkg.github.com/:_authToken=YOUR_PAT
   @agentsync:registry=https://npm.pkg.github.com
   ```

#### Framework Version Conflicts

If you see errors about incompatible versions:

1. Check your project's `package.json` for the framework version
2. Update to the latest compatible version:
   ```bash
   npm update @agentsync/test-framework
   ```
3. If breaking changes are needed, consult the migration guide

#### Self-Healing Locator Issues

If self-healing locators aren't working as expected:

1. Check that you're importing correctly:
   ```javascript
   const { SelfHealingLocator } = require('@agentsync/test-framework').locators;
   ```
2. Ensure you're providing fallback strategies:
   ```javascript
   new SelfHealingLocator(page, '#primary-selector', {
     fallbackStrategies: [
       { selector: '.backup-selector' },
       { selector: 'text=Button Text' }
     ]
   });
   ```

### Getting Help

If you encounter issues:

1. Check the [framework documentation](https://github.com/agentsync/test-framework/blob/main/docs/CONSOLIDATED_FRAMEWORK_GUIDE.md)
2. Contact the framework team on Slack at #test-framework-support
3. Submit an issue on the [framework repository](https://github.com/agentsync/test-framework/issues)
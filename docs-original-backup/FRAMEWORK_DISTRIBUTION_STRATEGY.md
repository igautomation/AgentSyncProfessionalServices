# AgentSync Test Framework Distribution Strategy

## Overview

This document outlines the strategy for distributing the AgentSync Test Framework across multiple projects. The framework is designed to provide a consistent testing approach while allowing project-specific customizations.

## Distribution Approach

**Recommended Approach: NPM Package with GitHub Packages**

### Key Benefits

- ✅ **Centralized Maintenance**: Single source of truth for test utilities
- ✅ **Version Control**: Semantic versioning for controlled updates
- ✅ **Dependency Management**: Automatic updates across projects
- ✅ **Consistent Testing**: Standardized approach across all projects
- ✅ **Reduced Duplication**: Shared code and utilities

## Implementation Details

### 1. Package Distribution

- **Package Name**: `@agentsync/test-framework`
- **Registry**: GitHub Packages (private)
- **Versioning**: Semantic versioning (MAJOR.MINOR.PATCH)
- **Installation**: `npm install @agentsync/test-framework`

```json
// Framework package.json
{
  "name": "@agentsync/test-framework",
  "version": "1.0.0",
  "description": "AgentSync Test Automation Framework for multi-project distribution",
  "main": "src/index.js",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  },
  "peerDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

### 2. Repository Structure

**Option A: Separate Repositories (Recommended)**

```
agentsync-test-framework/        # Framework repository
├── src/                         # Framework source code
│   ├── config/                  # Configuration files
│   ├── pages/                   # Page objects
│   ├── utils/                   # Utility modules
│   └── index.js                 # Main exports
├── templates/                   # Project templates
├── bin/                         # CLI tools
├── package.json                 # Framework package definition
└── README.md                    # Framework documentation

project-1-repo/                  # Project 1 repository
├── tests/                       # Test files
│   ├── e2e/                     # End-to-end tests
│   ├── api/                     # API tests
│   └── pages/                   # Project-specific page objects
├── package.json                 # Project dependencies (includes framework)
└── playwright.config.js         # Project-specific configuration

project-2-repo/                  # Project 2 repository
├── tests/                       # Test files
├── package.json                 # Project dependencies (includes framework)
└── playwright.config.js         # Project-specific configuration
```

**Option B: Monorepo Structure (Alternative)**

```
agentsync-testing-ecosystem/
├── packages/
│   ├── test-framework/          # Framework package
│   ├── project-1-tests/         # Project 1 tests
│   ├── project-2-tests/         # Project 2 tests
│   └── shared-configs/          # Shared configurations
├── package.json                 # Root package.json
└── nx.json                      # Nx configuration
```

### 3. Branching Strategy

**Framework Repository:**
- `main` - Stable releases
- `develop` - Integration branch
- `feature/*` - New features
- `hotfix/*` - Critical fixes
- `release/*` - Release preparation

**Project Repositories:**
- `main` - Production tests
- `develop` - Test development
- `feature/*` - New test features

### 4. Version Management

**Versioning Rules:**
- **Major (X.0.0)**: Breaking changes
- **Minor (1.X.0)**: New features, backward compatible
- **Patch (1.2.X)**: Bug fixes

**Project Dependencies:**
```json
// Project package.json
{
  "dependencies": {
    "@agentsync/test-framework": "^1.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

### 5. CI/CD Integration

**Framework CI/CD:**
```yaml
# .github/workflows/framework-ci.yml
name: Framework CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  release:
    types: [published]

jobs:
  test-framework:
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
      - name: Run tests
        run: npm test
      
  publish-framework:
    needs: test-framework
    runs-on: ubuntu-latest
    if: github.event_name == 'release'
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
      - name: Build framework
        run: npm run build
      - name: Publish to GitHub Packages
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Project CI/CD:**
```yaml
# .github/workflows/project-tests.yml
name: Project Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox]
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
        run: npm test -- --project=${{ matrix.browser }}
```

### 6. Configuration Management

**Framework-level config:**
```javascript
// src/config/base.config.js
module.exports = {
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  selfHealing: {
    enabled: true,
    logLevel: 'info'
  },
  browser: {
    headless: process.env.CI ? true : (process.env.HEADLESS === 'true'),
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  }
};
```

**Project-level config:**
```javascript
// playwright.config.js
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
    }
  ]
});
```

### 7. CLI Tool for Project Setup

The framework includes a CLI tool for easy project setup:

```bash
# Install the framework globally
npm install -g @agentsync/test-framework

# Create a new project
agentsync-framework init --name "My Project"

# Generate components
agentsync-framework generate --page Login
agentsync-framework generate --test "User Authentication"

# Update framework
agentsync-framework update
```

### 8. Documentation Strategy

- **Framework Guide**: Comprehensive guide to all framework features
- **Multi-Project Guide**: Instructions for using the framework across projects
- **Project Templates**: README templates for new projects
- **CHANGELOG**: Detailed version history with migration notes
- **API Reference**: Documentation for all framework components

### 9. Quality Gates

- **Code Reviews**: Framework changes require approval from 2+ reviewers
- **Automated Testing**: Comprehensive test suite for framework components
- **Security Scanning**: Automated dependency vulnerability scanning
- **Performance Testing**: Regression testing for framework performance
- **Compatibility Testing**: Testing across supported Node.js versions

### 10. Communication Strategy

- **Release Announcements**: Notifications for new framework versions
- **Release Notes**: Detailed notes for each version
- **Migration Guides**: Step-by-step guides for major version upgrades
- **Support Channels**: Dedicated Slack channel for framework support
- **Office Hours**: Weekly support sessions for framework users

## Implementation Timeline

1. **Week 1**: Framework Package Setup
   - Configure package.json for GitHub Packages
   - Set up main exports and configuration templates
   - Create CLI tool for project setup

2. **Week 2**: CI/CD and Documentation
   - Set up GitHub Actions workflows
   - Create comprehensive documentation
   - Prepare release process

3. **Week 3**: Initial Release and Training
   - Publish initial version to GitHub Packages
   - Conduct training sessions
   - Assist with first project migration

4. **Week 4**: Monitoring and Optimization
   - Collect feedback from initial users
   - Address issues and optimize framework
   - Plan for future enhancements

## Quick Reference

### Installation

First, configure npm to use GitHub Packages (see [GitHub Packages Setup Guide](GITHUB_PACKAGES_SETUP.md)):

```bash
# Create or edit ~/.npmrc
echo "@agentsync:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc

# Install in a project
npm install @agentsync/test-framework

# Install globally for CLI access
npm install -g @agentsync/test-framework
```

### Project Setup

```bash
# Create new project
agentsync-framework init --name "My Project"

# Or manually
npm init
npm install @agentsync/test-framework
```

### Framework Updates

```bash
# Update framework in a project
npm update @agentsync/test-framework

# Or using CLI
agentsync-framework update
```

### Release Process

```bash
# Create a new release
npm run release
```

This distribution strategy ensures maintainability, scalability, and controlled distribution across multiple projects while leveraging GitHub's ecosystem effectively.
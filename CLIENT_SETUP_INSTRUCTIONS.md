# AgentSync Professional Services Framework Setup and Publishing Guide

This document provides step-by-step instructions for setting up and publishing the AgentSync Professional Services framework to your organization's GitHub repository.

## Prerequisites

1. GitHub account with admin access to your organization
2. Personal Access Token (PAT) with the following permissions:
   - `repo` (Full control of repositories)
   - `read:packages` (Download packages from GitHub Package Registry)
   - `write:packages` (Upload packages to GitHub Package Registry)
3. Node.js 16 or higher
4. npm 7 or higher

## Step 1: Create a Repository in Your Organization

1. Log in to GitHub
2. Navigate to your organization
3. Click "New repository"
4. Name the repository (e.g., `agentsync-test-framework`)
5. Set visibility to "Private" (recommended)
6. Click "Create repository"

## Step 2: Update Package Configuration

Update the `package.json` file to point to your organization's repository:

```json
{
  "name": "@your-org/agentsync-test-framework",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-org/agentsync-test-framework.git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

Replace `your-org` with your GitHub organization name.

## Step 3: Create a Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "npm-publish"
4. Select these scopes: `repo`, `read:packages`, `write:packages`
5. Click "Generate token" and copy the token

## Step 4: Set Up Publishing Authentication

Run the setup script:

```bash
npm run setup:publish-token
```

When prompted:
1. Enter your GitHub Personal Access Token
2. Choose how to set up your token:
   - Option 1: Update `.npmrc` directly with the token (quick but less secure)
   - Option 2: Use environment variable (recommended for security)

If you chose Option 2, add this to your shell profile (e.g., `~/.bash_profile`, `~/.zshrc`):
```bash
export GITHUB_TOKEN=your_github_token
```

## Step 5: Push Code to Your Repository

```bash
# Initialize git repository if not already done
git init

# Add your remote repository
git remote add origin https://github.com/your-org/agentsync-test-framework.git

# Add all files
git add .

# Commit changes
git commit -m "Initial commit of AgentSync test framework"

# Push to main branch
git push -u origin main
```

## Step 6: Publish the Package

Once your token is set up and code is pushed, publish the package:

```bash
npm run publish:framework
```

This script will:
1. Validate your token
2. Build the package
3. Ensure all necessary directories exist
4. Publish to GitHub Packages

## Step 7: Set Up GitHub Actions for Automatic Publishing (Optional)

Create a `.github/workflows/publish.yml` file:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@your-org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Step 8: Using the Framework in Client Projects

### Option 1: Using the Setup Script (Recommended)

1. Set your GitHub token:
```bash
export GITHUB_TOKEN=your_personal_access_token
```

2. Run the setup script:
```bash
npx @your-org/agentsync-test-framework setup:client-project
```

3. Follow the prompts to configure your project

### Option 2: Manual Setup

1. Create a new directory for your project:
```bash
mkdir my-client-project
cd my-client-project
```

2. Create a `.npmrc` file:
```
@your-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

3. Create a `package.json` file:
```json
{
  "name": "my-client-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed"
  },
  "dependencies": {
    "@your-org/agentsync-test-framework": "^1.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.53.1",
    "dotenv": "^16.3.1"
  }
}
```

4. Install dependencies:
```bash
export GITHUB_TOKEN=your_personal_access_token
npm install
```

5. Create a `playwright.config.js` file:
```javascript
const { defineConfig } = require('@playwright/test');
const { baseConfig } = require('@your-org/agentsync-test-framework/config');
const dotenv = require('dotenv');

dotenv.config();

module.exports = defineConfig({
  ...baseConfig,
  testDir: './tests',
  projects: [
    {
      name: 'chromium',
      use: { 
        ...baseConfig.use,
        browserName: 'chromium',
        baseURL: process.env.BASE_URL || 'https://your-app-url.com',
      },
    }
  ],
});
```

## Troubleshooting

### Authentication Error

If you see an error like:
```
npm error code E401
npm error 401 Unauthorized - PUT https://npm.pkg.github.com/@your-org%2fagentsync-test-framework
```

Check that:
1. Your GitHub token has the correct permissions
2. The token is correctly set in the environment
3. The package name in package.json matches your GitHub repository name exactly
4. You have write access to the repository

### Quick Fix for Publishing Issues

If you're experiencing authentication issues when publishing, run:
```bash
npm run publish:quick-fix
```

This script will temporarily update your `.npmrc` file, attempt to publish, and then restore your original `.npmrc` file.
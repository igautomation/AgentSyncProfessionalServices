# GitHub Packages Setup Guide

This guide explains how to set up and use the framework via GitHub Packages.

## Prerequisites

1. GitHub account with access to the igautomation organization
2. Personal Access Token with `read:packages` permission

## Setting Up Authentication

### 1. Create a Personal Access Token (PAT)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token"
3. Select these permissions:
   - `repo` (Full control of repositories)
   - `read:packages` (Download packages)
4. Copy the token

### 2. Configure npm to Use GitHub Packages

Create a `.npmrc` file in your project root:

```
@igautomation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 3. Set Your GitHub Token

```bash
export GITHUB_TOKEN=your_personal_access_token
```

On Windows:
```cmd
set GITHUB_TOKEN=your_personal_access_token
```

## Installing the Framework

```bash
npm install @igautomation/agentsyncprofessionalservices
```

## Creating a New Project

```bash
# Use the full package name with npx
npx @igautomation/agentsyncprofessionalservices init -t basic -d my-project
```

## Troubleshooting

### "Could not determine executable to run"

If you see this error, make sure to use the full package name:

```bash
# INCORRECT ❌
npx agentsync init -t basic -d my-project

# CORRECT ✅
npx @igautomation/agentsyncprofessionalservices init -t basic -d my-project
```

### "Not found in this registry"

If npm can't find the package:

1. Check that your `.npmrc` file is correctly set up
2. Verify your GitHub token has the correct permissions
3. Ensure you're using the correct package name: `@igautomation/agentsyncprofessionalservices`

### "Unauthorized"

If you get an unauthorized error:

1. Check that your GitHub token is correctly set
2. Verify you have access to the igautomation organization
3. Try regenerating your GitHub token

## CI/CD Integration

For GitHub Actions, add this to your workflow:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@igautomation'
      - name: Install dependencies
        run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Run tests
        run: npm test
```
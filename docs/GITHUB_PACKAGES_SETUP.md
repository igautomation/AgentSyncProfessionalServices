# GitHub Packages Setup Guide

This guide explains how to set up GitHub Packages for installing the AgentSync Test Framework.

## Prerequisites

1. GitHub account with access to the AgentSync organization
2. Personal Access Token (PAT) with `read:packages` scope

## Setup Instructions

### 1. Create a Personal Access Token (PAT)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "AgentSync Packages"
4. Select the `read:packages` scope
5. Click "Generate token"
6. **Copy the token** - you'll only see it once!

### 2. Configure npm to use GitHub Packages

Create or edit your `~/.npmrc` file:

```
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
@agentsync:registry=https://npm.pkg.github.com
```

Replace `YOUR_GITHUB_TOKEN` with the PAT you created.

### 3. Using Environment Variables (Recommended)

For better security, use an environment variable:

1. Add to your shell profile (`.bashrc`, `.zshrc`, etc.):
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

2. Update your `~/.npmrc`:
   ```
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   @agentsync:registry=https://npm.pkg.github.com
   ```

3. Reload your shell:
   ```bash
   source ~/.bashrc  # or ~/.zshrc
   ```

### 4. Project-Specific Configuration

For project-specific configuration, create a `.npmrc` file in your project root:

```
@agentsync:registry=https://npm.pkg.github.com
```

And run npm with the auth token:

```bash
GITHUB_TOKEN=your_token_here npm install
```

### 5. CI/CD Configuration

For GitHub Actions:

```yaml
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
```

## Troubleshooting

### Authentication Errors

If you see errors like:
```
npm ERR! Unable to authenticate, need: Basic realm="GitHub Package Registry"
```

Check that:
1. Your PAT has the correct permissions
2. Your PAT is correctly set in your `.npmrc` file
3. Your PAT hasn't expired

### Package Not Found

If you see errors like:
```
npm ERR! 404 Not Found - GET https://npm.pkg.github.com/@agentsync%2ftest-framework
```

Check that:
1. You have access to the repository
2. The package has been published
3. You're using the correct package name

## Further Help

If you continue to experience issues, contact the framework team on Slack at #test-framework-support.
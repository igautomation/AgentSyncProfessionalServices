# Publishing the Framework

This guide explains how to publish the AgentSync Test Framework to GitHub Packages.

## Prerequisites

1. GitHub account with write access to the AgentSync organization
2. Personal Access Token (PAT) with `write:packages` scope
3. Node.js and npm installed

## Publishing Process

### 1. Set up GitHub Token

Create a Personal Access Token (PAT) with the `write:packages` scope:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "AgentSync Packages"
4. Select the `write:packages` scope
5. Click "Generate token"
6. Copy the token

Set the token as an environment variable:

```bash
export GITHUB_TOKEN=your_token_here
```

### 2. Publish the Framework

Use the provided script to publish the framework:

```bash
npm run publish:framework
```

This script will:
1. Check if you're on the main branch
2. Check for uncommitted changes
3. Create a temporary .npmrc file
4. Build the framework
5. Publish to GitHub Packages
6. Clean up temporary files

### 3. Manual Publishing

If you prefer to publish manually:

```bash
# Set up .npmrc
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc
echo "@agentsync:registry=https://npm.pkg.github.com" >> .npmrc

# Build the framework
npm run build

# Publish to GitHub Packages
npm publish

# Clean up
rm .npmrc
```

### 4. Versioning

Before publishing a new version:

1. Update the version in package.json
2. Update the CHANGELOG.md
3. Commit and tag the changes

```bash
# Create a new version
npm version patch  # or minor or major

# Or run the release script
npm run release
```

## Troubleshooting

### Authentication Errors

If you see errors like:
```
npm ERR! Unable to authenticate, need: Basic realm="GitHub Package Registry"
```

Check that:
1. Your PAT has the correct permissions (`write:packages`)
2. Your PAT is correctly set as the GITHUB_TOKEN environment variable
3. Your PAT hasn't expired

### Package Already Exists

If you see errors like:
```
npm ERR! 403 403 Forbidden - PUT https://npm.pkg.github.com/@agentsync%2ftest-framework - You cannot publish over the previously published versions
```

You need to update the version in package.json before publishing.

## Further Help

If you continue to experience issues, contact the framework team on Slack at #test-framework-support.
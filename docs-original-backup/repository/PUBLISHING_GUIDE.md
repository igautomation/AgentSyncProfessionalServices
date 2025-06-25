# Publishing Guide for AgentSync Professional Services

This guide provides instructions for publishing the package to GitHub Packages.

## Quick Fix for Publishing Issues

If you're experiencing authentication issues when publishing, follow these steps:

1. Run the quick fix script:
   ```bash
   npm run publish:quick-fix
   ```

2. When prompted, enter a valid GitHub Personal Access Token with the following scopes:
   - `repo`
   - `read:packages`
   - `write:packages`

3. The script will temporarily update your `.npmrc` file, attempt to publish, and then restore your original `.npmrc` file.

## Setting Up for Publishing

For a more permanent solution:

1. Generate a new GitHub Personal Access Token:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name like "npm-publish"
   - Select these scopes: `repo`, `read:packages`, `write:packages`
   - Click "Generate token" and copy the token

2. Run the setup script:
   ```bash
   npm run setup:publish-token
   ```

3. Choose how you want to set up your token:
   - Option 1: Update `.npmrc` directly with the token (quick but less secure)
   - Option 2: Use environment variable (recommended for security)

4. If you chose Option 2, add this to your shell profile (e.g., `~/.bash_profile`, `~/.zshrc`):
   ```bash
   export GITHUB_TOKEN=your_github_token
   ```

## Publishing the Package

Once your token is set up, you can publish the package:

```bash
npm run publish:framework
```

This script will:
1. Validate your token
2. Build the package
3. Ensure all necessary directories exist
4. Publish to GitHub Packages

## Troubleshooting

If you encounter issues:

1. **Authentication errors (401 Unauthorized)**:
   - Your token may be invalid or expired
   - Run `npm run setup:publish-token` to set up a new token

2. **Permission errors (403 Forbidden)**:
   - Your token may not have the required scopes
   - You may not have write access to the repository
   - Ensure your token has the `write:packages` scope

3. **Other issues**:
   - Check that the package name in `package.json` matches your GitHub organization name
   - Verify that the version in `package.json` is not already published
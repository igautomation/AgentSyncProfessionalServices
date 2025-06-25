# NPM Setup Guide

## GitHub Package Registry Authentication

This project uses GitHub Package Registry for publishing and consuming packages. To authenticate with GitHub Package Registry, you need to set up a GitHub Personal Access Token.

### Setting up the GitHub Token

1. Create a GitHub Personal Access Token with the following scopes:
   - `repo`
   - `read:packages`
   - `write:packages`

2. Set the token as an environment variable:

   ```bash
   # For macOS/Linux
   export GITHUB_TOKEN=your_github_token

   # For Windows Command Prompt
   set GITHUB_TOKEN=your_github_token

   # For Windows PowerShell
   $env:GITHUB_TOKEN="your_github_token"
   ```

3. To make this permanent, add the export command to your shell profile file (e.g., `~/.bash_profile`, `~/.zshrc`, etc.)

### Alternative: Manual .npmrc Setup

If you prefer not to use environment variables, you can manually create an `.npmrc` file in your home directory:

```
@igautomation:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=your_github_token
```

**IMPORTANT: Never commit your GitHub token to version control.**

The `.npmrc` file is added to `.gitignore` to prevent accidental commits of your token.
# Instructions to Publish to GitHub Packages

Your publish attempt failed because the GitHub token in your `.npmrc` file is invalid or revoked. Follow these steps to fix it:

## Option 1: Update .npmrc with a New Token (Quick Fix)

1. Generate a new GitHub Personal Access Token:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name like "npm-publish"
   - Select these scopes: `repo`, `read:packages`, `write:packages`
   - Click "Generate token" and copy the token

2. Update your .npmrc file with the new token:
   ```bash
   echo "@igautomation:registry=https://npm.pkg.github.com/" > .npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_NEW_TOKEN" >> .npmrc
   ```
   (Replace YOUR_NEW_TOKEN with the actual token)

3. Try publishing again:
   ```bash
   npm publish --access=restricted
   ```

## Option 2: Use Environment Variables (Recommended)

1. Generate a new GitHub Personal Access Token (as described above)

2. Set the token as an environment variable:
   ```bash
   export GITHUB_TOKEN=YOUR_NEW_TOKEN
   ```

3. Update your .npmrc to use the environment variable:
   ```bash
   echo "@igautomation:registry=https://npm.pkg.github.com/" > .npmrc
   echo "//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}" >> .npmrc
   ```

4. Try publishing again:
   ```bash
   npm publish --access=restricted
   ```

## Troubleshooting

If you still have issues:

1. Verify your token has the correct permissions (`repo`, `read:packages`, `write:packages`)
2. Make sure you're logged in to the correct GitHub account
3. Check that the package name in package.json matches your GitHub organization name
4. Try logging in explicitly:
   ```bash
   npm login --registry=https://npm.pkg.github.com/ --scope=@igautomation
   ```
   (Use your GitHub username and the new token as the password)
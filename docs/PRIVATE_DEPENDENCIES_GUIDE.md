# Working with Private GitHub Dependencies

This guide explains how to work with private GitHub dependencies in your Node.js project.

## Prerequisites

1. A GitHub account with access to the private repository
2. A Personal Access Token (PAT) with `read:packages` scope
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token
   - Select at least `read:packages` scope

## Method 1: Using .npmrc with GitHub Authentication

This is the recommended approach for most projects.

### Setup

1. Create a `.npmrc` file in your project root:

```
@igautomation:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2. Set your GitHub token as an environment variable:

```bash
# For bash/zsh
export GITHUB_TOKEN=your_github_token

# For Windows Command Prompt
set GITHUB_TOKEN=your_github_token

# For PowerShell
$env:GITHUB_TOKEN="your_github_token"
```

3. Reference the dependency in your package.json:

```json
{
  "dependencies": {
    "@igautomation/agentsyncprofessionalservices": "github:igautomation/agentsyncprofessionalservices#main"
  }
}
```

4. Run `npm install`

### For CI/CD Environments

For GitHub Actions:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@igautomation'
      - run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

For other CI systems, set the `GITHUB_TOKEN` environment variable.

## Method 2: Using Git URLs Directly

You can reference Git repositories directly in your package.json:

```json
{
  "dependencies": {
    "private-framework": "git+https://github.com/igautomation/agentsyncprofessionalservices.git#main",
    "private-framework-with-auth": "git+https://${GITHUB_TOKEN}:x-oauth-basic@github.com/igautomation/agentsyncprofessionalservices.git#main"
  }
}
```

## Method 3: Using Git Submodules

For more complex scenarios or when you need to modify the dependency:

```bash
# Add the submodule
git submodule add https://github.com/igautomation/agentsyncprofessionalservices.git vendor/framework

# Reference it in package.json
# "dependencies": {
#   "private-framework": "file:./vendor/framework"
# }
```

## Method 4: Using Docker

When using Docker, pass the GitHub token as a build argument:

```bash
docker build --build-arg GITHUB_TOKEN=your_github_token -t your-image-name .
```

Or with docker-compose:

```bash
GITHUB_TOKEN=your_github_token docker-compose up
```

## Troubleshooting

### Authentication Issues

- Verify your token has the correct scopes (`read:packages`)
- Check that your token hasn't expired
- Ensure you're using the correct registry URL

### Package Not Found

- Verify you have access to the repository
- Check the package name and version/branch
- Try clearing npm cache: `npm cache clean --force`

### Docker Build Issues

- Make sure the `.npmrc` file is created during the build process
- Verify the token is passed correctly as a build argument

## Security Best Practices

- Never commit tokens to your repository
- Use environment variables or secrets management
- Consider using token scopes that provide only the necessary access
- Rotate tokens periodically
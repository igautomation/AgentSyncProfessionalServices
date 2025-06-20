# Client Test Automation Project

This project uses the AgentSync Test Framework to automate testing for the client application.

## Setup

1. **Authentication Setup**

   Create a `.npmrc` file in the project root with the following content:

   ```
   @agentsync:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

   You'll need a GitHub Personal Access Token with `read:packages` scope.

2. **Environment Setup**

   Copy the `.env.template` file to `.env` and update the values:

   ```bash
   cp .env.template .env
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Install Playwright Browsers**

   ```bash
   npx playwright install
   ```

## Running Tests

Run all tests:

```bash
npm test
```

Run tests in headed mode:

```bash
npm run test:headed
```

Run tests in debug mode:

```bash
npm run test:debug
```

Run tests with Playwright UI:

```bash
npm run test:ui
```

## Viewing Reports

```bash
npm run report
```

## GitHub Actions Integration

This project includes a GitHub Actions workflow that runs tests automatically:

- On push to main and develop branches
- On pull requests to main
- Daily at 2 AM

To set up GitHub Actions:

1. Add a `GITHUB_TOKEN` secret in your repository settings
2. Push the code to GitHub

## Framework Documentation

For more information about the AgentSync Test Framework, refer to the [framework documentation](https://github.com/agentsync/test-framework).
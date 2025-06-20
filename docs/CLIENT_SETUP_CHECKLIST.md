# Client Setup Checklist

Use this checklist to ensure proper setup of the AgentSync Test Framework in client projects.

## Initial Setup

- [ ] **GitHub Access**
  - [ ] Client has GitHub account
  - [ ] Client has access to the AgentSync repository
  - [ ] Client has created a Personal Access Token with `read:packages` scope

- [ ] **Project Structure**
  - [ ] Created project directory
  - [ ] Created `.npmrc` file with GitHub Packages configuration
  - [ ] Created `package.json` with framework dependency
  - [ ] Created `playwright.config.js` extending framework configuration

- [ ] **Environment Setup**
  - [ ] Created `.env` file with required environment variables
  - [ ] Set up `GITHUB_TOKEN` environment variable

## Installation

- [ ] **Dependencies**
  - [ ] Run `npm install` successfully
  - [ ] Framework package installed correctly
  - [ ] Run `npx playwright install` to install browsers

- [ ] **Verification**
  - [ ] Run a simple test to verify framework installation
  - [ ] Verify framework utilities are accessible
  - [ ] Verify self-healing locators work correctly

## GitHub Actions Integration

- [ ] **Workflow Setup**
  - [ ] Created `.github/workflows/tests.yml` file
  - [ ] Added `GITHUB_TOKEN` secret in repository settings
  - [ ] Pushed code to GitHub repository

- [ ] **Verification**
  - [ ] GitHub Actions workflow runs successfully
  - [ ] Tests pass in CI environment
  - [ ] Test reports are generated correctly

## Project Configuration

- [ ] **Test Structure**
  - [ ] Created `tests` directory
  - [ ] Created example test files
  - [ ] Created page objects (if needed)

- [ ] **Framework Configuration**
  - [ ] Customized framework configuration as needed
  - [ ] Set up environment-specific configurations
  - [ ] Configured reporting options

## Documentation

- [ ] **Project Documentation**
  - [ ] Created README.md with setup instructions
  - [ ] Documented test structure and organization
  - [ ] Documented custom utilities and extensions

- [ ] **Team Onboarding**
  - [ ] Provided framework documentation to team
  - [ ] Conducted training session on framework usage
  - [ ] Set up support channels for questions

## Ongoing Maintenance

- [ ] **Update Strategy**
  - [ ] Defined process for updating framework version
  - [ ] Set up notification for new framework releases
  - [ ] Documented breaking changes and migration steps

- [ ] **Monitoring**
  - [ ] Set up test result monitoring
  - [ ] Configured notifications for test failures
  - [ ] Established process for addressing flaky tests

## Security

- [ ] **Token Management**
  - [ ] Documented token rotation process
  - [ ] Set up secure storage for tokens
  - [ ] Limited token permissions to minimum required

- [ ] **Sensitive Data**
  - [ ] Ensured no credentials in code
  - [ ] Set up secure environment variable handling
  - [ ] Configured proper gitignore for sensitive files
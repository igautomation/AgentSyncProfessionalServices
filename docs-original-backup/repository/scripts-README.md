# Scripts Directory

This directory contains various scripts for the AgentSync Test Framework.

## Directory Structure

- **build/** - Scripts for building and bundling the framework
  - `create-bundle.js` - Creates a distributable bundle of the framework
  - `build-docs.sh` - Builds documentation
  - `deploy-docs.sh` - Deploys documentation

- **ci-cd/** - Scripts for CI/CD pipelines and releases
  - `publish.sh` - Publishes the framework to GitHub Packages
  - `release.js` - Manages framework versioning and release process
  - `setup-branches.sh` - Sets up Git branches for development

- **docs/** - Documentation-related scripts
  - `consolidate-docs.js` - Consolidates Markdown documentation into a single directory
  - `README.md` - Original documentation for scripts

- **runners/** - Test runner scripts
  - `run-api-tests.sh` - Runs API tests
  - `run-e2e-tests.sh` - Runs end-to-end tests
  - `run-salesforce-test.js` - Runs Salesforce-specific tests
  - `run-sf-workflow.sh` - Runs Salesforce workflow tests
  - `run-simple-salesforce-test.js` - Runs simplified Salesforce tests
  - `run-tests.sh` - General test runner
  - `test-runner.sh` - Interactive test runner CLI

- **setup/** - Setup and initialization scripts
  - `setup-hooks.js` - Sets up Git hooks
  - `setup.js` - General setup script

- **utils/** - Utility scripts
  - `.eslintrc.js` - ESLint configuration for scripts
  - `coverage.js` - Generates test coverage reports
  - `framework-health-check.js` - Checks framework health
  - `naming-convention-check.js` - Validates naming conventions
  - `validate-framework.js` - Validates framework integrity
  - `validate-tests.js` - Validates test structure and quality
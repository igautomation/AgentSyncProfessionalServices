# AgentSync Professional Services Framework

This repository contains the AgentSync Professional Services test automation framework, designed for multi-project distribution via GitHub Packages.

## Quick Start Guide

Follow these steps to set up and publish the framework to your organization's GitHub repository:

### 1. Update Organization Information

Run the organization setup script:

```bash
npm run setup:org-info
```

This script will:
- Update the package name in package.json to use your organization
- Update the repository URL to point to your GitHub repository
- Update the .npmrc file with your organization scope

### 2. Set Up GitHub Token for Publishing

Create a GitHub Personal Access Token with these permissions:
- `repo` (Full control of repositories)
- `read:packages` (Download packages)
- `write:packages` (Upload packages)

Then run:

```bash
npm run setup:publish-token
```

### 3. Push to Your Repository

```bash
git init
git add .
git commit -m "Initial commit of AgentSync test framework"
git remote add origin https://github.com/your-org/your-repo-name.git
git push -u origin main
```

### 4. Publish the Package

```bash
npm run publish:framework
```

## Detailed Setup Instructions

For more detailed instructions, refer to these documents:

- [Client Setup Instructions](./CLIENT_SETUP_INSTRUCTIONS.md) - Comprehensive guide for setting up and publishing
- [Client Setup Checklist](./CLIENT_SETUP_CHECKLIST.md) - Step-by-step checklist to track your progress

## Using the Framework in Client Projects

Once published, you can use the framework in client projects:

```bash
# Create a new directory for your project
mkdir my-client-project
cd my-client-project

# Create .npmrc file
echo "@your-org:registry=https://npm.pkg.github.com" > .npmrc
echo "//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}" >> .npmrc

# Create package.json
npm init -y

# Install the framework
export GITHUB_TOKEN=your_github_token
npm install @your-org/your-repo-name
```

## Framework Features

- End-to-end testing with Playwright
- API testing utilities
- Accessibility testing
- Salesforce integration
- Test reporting and visualization
- CI/CD integration
- Page object model support
- Self-healing locators
- Data-driven testing

## Documentation

For more information about using the framework, refer to the documentation in the `docs` directory.

## Support

If you encounter any issues or have questions, please contact the AgentSync Professional Services team.
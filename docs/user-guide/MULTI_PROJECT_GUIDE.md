# Multi-Project Guide

This guide explains how to use the framework across multiple projects and teams.

## Framework Distribution Strategy

The AgentSync Test Framework is distributed as a private GitHub NPM package, allowing multiple teams to use the same framework while maintaining consistency and enabling centralized updates.

## Setting Up Teams

### 1. Grant Repository Access

Ensure all team members have access to the repository:

1. Go to https://github.com/igautomation/AgentSyncProfessionalServices/settings/access
2. Add teams or individual users who need access

### 2. Create Team Setup Guide

Create a team-specific setup guide with:

1. Instructions for creating GitHub Personal Access Tokens
2. `.npmrc` configuration
3. Project initialization steps
4. Team-specific conventions and standards

### 3. Schedule Training Session

Organize a brief training session covering:
- Framework features
- Authentication setup
- Common usage patterns
- Best practices

## Project Setup for Teams

Each team should follow these steps:

1. Set up GitHub Packages authentication
2. Create a new project using templates
3. Customize the project for their specific needs
4. Set up CI/CD integration

## Maintaining Consistency

### Shared Configuration

Create shared configuration files that teams can extend:

```javascript
// team-config.js
const { baseConfig } = require('@igautomation/agentsyncprofessionalservices/config');

module.exports = {
  ...baseConfig,
  // Team-specific configuration
  timeout: 60000,
  retries: 2,
};
```

### Shared Page Objects

Create shared page objects for common components:

```javascript
// shared-components.js
const { BasePage } = require('@igautomation/agentsyncprofessionalservices/pages');

class Header extends BasePage {
  constructor(page) {
    super(page);
    this.logo = page.locator('.header-logo');
    this.menuButton = page.locator('.menu-button');
  }
  
  async openMenu() {
    await this.menuButton.click();
  }
}

module.exports = { Header };
```

## Version Management

### Framework Versioning

When updating the framework:

1. Increment the version number in package.json
2. Publish the new version
3. Notify teams of the update

### Project Versioning

Teams should specify the framework version in their package.json:

```json
"dependencies": {
  "@igautomation/agentsyncprofessionalservices": "^1.0.2"
}
```

## Support and Collaboration

### Support Channel

Create a Slack channel or Teams chat for framework support questions.

### Knowledge Sharing

Encourage teams to:
- Share custom utilities they've created
- Report bugs and issues
- Suggest improvements to the framework

## Monitoring and Metrics

Track framework usage across teams:

- Number of tests created
- Test execution metrics
- Framework version adoption

This helps identify areas for improvement and ensures all teams are benefiting from the framework.
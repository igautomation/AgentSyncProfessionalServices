#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Get package version
const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description('AgentSync Test Framework CLI');

program
  .command('init')
  .description('Initialize a new AgentSync Test Framework project')
  .option('-n, --name <name>', 'Project name')
  .option('-t, --template <template>', 'Template to use (basic, full)', 'basic')
  .option('-d, --dir <directory>', 'Target directory', '.')
  .option('--no-install', 'Skip dependency installation')
  .action(async (options) => {
    console.log('🚀 Initializing new AgentSync Test Framework project...');
    
    const projectName = options.name || path.basename(process.cwd());
    const templateDir = path.join(__dirname, '../templates/project-setup');
    const targetDir = path.resolve(process.cwd(), options.dir);
    
    try {
      // Create project structure
      console.log('📁 Creating project structure...');
      
      // Create directories
      const dirs = ['tests', 'tests/e2e', 'tests/api', 'auth', 'reports'];
      dirs.forEach(dir => {
        const dirPath = path.join(targetDir, dir);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      });
      
      // Copy and customize template files
      copyAndCustomizeTemplate(templateDir, targetDir, projectName);
      
      // Install dependencies if not skipped
      if (options.install) {
        console.log('📦 Installing dependencies...');
        try {
          execSync('npm install', { stdio: 'inherit', cwd: targetDir });
          
          // Install Playwright browsers
          console.log('🌐 Installing Playwright browsers...');
          execSync('npx playwright install', { stdio: 'inherit', cwd: targetDir });
        } catch (error) {
          console.warn('⚠️ Dependency installation failed. You may need to run npm install manually.');
          console.warn('⚠️ Error:', error.message);
        }
      }
      
      console.log('✅ Project initialized successfully!');
      console.log('\nNext steps:');
      console.log('  1. Configure your environment variables in .env');
      console.log('  2. Review the configuration in playwright.config.js');
      console.log('  3. Run your first test: npm test');
      console.log('  4. Generate a report: npm run report');
    } catch (error) {
      console.error('❌ Error initializing project:', error.message);
      process.exit(1);
    }
  });

program
  .command('generate')
  .description('Generate framework components')
  .option('-p, --page <name>', 'Generate a page object')
  .option('-t, --test <name>', 'Generate a test file')
  .option('-c, --component <name>', 'Generate a component')
  .option('-d, --dir <directory>', 'Target directory', '.')
  .action((options) => {
    const targetDir = path.resolve(process.cwd(), options.dir);
    
    if (options.page) {
      generatePage(options.page, targetDir);
    } else if (options.test) {
      generateTest(options.test, targetDir);
    } else if (options.component) {
      generateComponent(options.component, targetDir);
    } else {
      console.error('Please specify what to generate (--page, --test, or --component)');
    }
  });

program
  .command('docs')
  .description('Open framework documentation')
  .action(() => {
    console.log('Opening documentation...');
    const docsUrl = 'https://github.com/agentsync/test-framework/blob/main/docs/CONSOLIDATED_FRAMEWORK_GUIDE.md';
    
    const open = (process.platform === 'win32') ? 'start' : 
                (process.platform === 'darwin') ? 'open' : 'xdg-open';
    
    try {
      execSync(`${open} ${docsUrl}`);
    } catch (error) {
      console.log(`Documentation available at: ${docsUrl}`);
    }
  });

program
  .command('update')
  .description('Update framework to latest version')
  .action(() => {
    console.log('Updating framework to latest version...');
    
    try {
      execSync('npm update @agentsync/test-framework', { stdio: 'inherit' });
      console.log('✅ Framework updated successfully!');
    } catch (error) {
      console.error('❌ Error updating framework:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// Helper functions
function copyAndCustomizeTemplate(templateDir, targetDir, projectName) {
  // Copy package.json template
  const packageTemplate = path.join(templateDir, 'package.template.json');
  const packageTarget = path.join(targetDir, 'package.json');
  
  if (fs.existsSync(packageTemplate)) {
    let packageContent = fs.readFileSync(packageTemplate, 'utf8');
    packageContent = packageContent.replace(/PROJECT_NAME/g, projectName);
    packageContent = packageContent.replace(/project-name-tests/g, `${projectName.toLowerCase().replace(/\s+/g, '-')}-tests`);
    fs.writeFileSync(packageTarget, packageContent);
    console.log(`📄 Created package.json`);
  }
  
  // Copy playwright config template
  const configTemplate = path.join(templateDir, 'playwright.config.template.js');
  const configTarget = path.join(targetDir, 'playwright.config.js');
  
  if (fs.existsSync(configTemplate)) {
    fs.copyFileSync(configTemplate, configTarget);
    console.log(`📄 Created playwright.config.js`);
  }
  
  // Copy environment template
  const envTemplate = path.join(templateDir, '.env.template');
  const envTarget = path.join(targetDir, '.env');
  
  if (fs.existsSync(envTemplate)) {
    fs.copyFileSync(envTemplate, envTarget);
    console.log(`📄 Created .env file`);
  }
  
  // Copy GitHub Actions workflow
  const workflowTemplate = path.join(templateDir, '.github-workflows-project-tests.yml');
  const workflowDir = path.join(targetDir, '.github/workflows');
  const workflowTarget = path.join(workflowDir, 'project-tests.yml');
  
  if (fs.existsSync(workflowTemplate)) {
    if (!fs.existsSync(workflowDir)) {
      fs.mkdirSync(workflowDir, { recursive: true });
    }
    fs.copyFileSync(workflowTemplate, workflowTarget);
    console.log(`📄 Created GitHub Actions workflow`);
  }
  
  // Copy README template
  const readmeTemplate = path.join(templateDir, 'README.md');
  const readmeTarget = path.join(targetDir, 'README.md');
  
  if (fs.existsSync(readmeTemplate)) {
    let readmeContent = fs.readFileSync(readmeTemplate, 'utf8');
    readmeContent = readmeContent.replace(/PROJECT_NAME/g, projectName);
    fs.writeFileSync(readmeTarget, readmeContent);
    console.log(`📄 Created README.md`);
  }
  
  // Copy example test files
  const testsDir = path.join(templateDir, 'tests');
  const targetTestsDir = path.join(targetDir, 'tests');
  
  if (fs.existsSync(testsDir)) {
    const testFiles = fs.readdirSync(testsDir);
    testFiles.forEach(file => {
      const sourcePath = path.join(testsDir, file);
      const targetPath = path.join(targetTestsDir, file);
      
      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`📄 Created test file: ${file}`);
      }
    });
  }
}

function generatePage(name, targetDir) {
  const pageName = name.charAt(0).toUpperCase() + name.slice(1) + 'Page';
  const pagesDir = path.join(targetDir, 'tests/pages');
  const targetFile = path.join(pagesDir, `${pageName}.js`);
  
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  const template = `/**
 * ${pageName} - Page Object for ${name} page
 * @class
 */
const { SelfHealingLocator } = require('@agentsync/test-framework').locators;

class ${pageName} {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Define selectors
    this.selectors = {
      // Add your selectors here
    };
  }

  /**
   * Navigate to the page
   * @param {string} [path=''] - Additional path to append to base URL
   */
  async navigate(path = '') {
    await this.page.goto(\`\${path}\`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if page is loaded
   * @returns {Promise<boolean>}
   */
  async isLoaded() {
    // Implement page-specific loading check
    return true;
  }
}

module.exports = ${pageName};
`;

  fs.writeFileSync(targetFile, template);
  console.log(`✅ Generated page object: ${targetFile}`);
}

function generateTest(name, targetDir) {
  const testName = name.toLowerCase().replace(/\s+/g, '-');
  const testsDir = path.join(targetDir, 'tests/e2e');
  const targetFile = path.join(testsDir, `${testName}.spec.js`);
  
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir, { recursive: true });
  }
  
  const template = `const { test, expect } = require('@playwright/test');
const { SelfHealingLocator } = require('@agentsync/test-framework').locators;

test.describe('${name} Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup for each test
    await page.goto('/');
  });

  test('should load the page correctly', async ({ page }) => {
    // Test implementation
    const title = await page.title();
    expect(title).not.toBe('');
  });

  test('should perform basic functionality', async ({ page }) => {
    // Create a self-healing locator
    const button = new SelfHealingLocator(page, '#submit-button', {
      fallbackStrategies: [
        { selector: 'button[type="submit"]' },
        { selector: 'text=Submit' }
      ]
    });
    
    // Use the locator
    const element = await button.locate();
    await element.click();
    
    // Add assertions
    // expect(...).toBeVisible();
  });
});
`;

  fs.writeFileSync(targetFile, template);
  console.log(`✅ Generated test file: ${targetFile}`);
}

function generateComponent(name, targetDir) {
  const componentName = name.charAt(0).toUpperCase() + name.slice(1);
  const componentsDir = path.join(targetDir, 'tests/components');
  const targetFile = path.join(componentsDir, `${componentName}.js`);
  
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  const template = `/**
 * ${componentName} - Reusable component
 * @class
 */
const { SelfHealingLocator } = require('@agentsync/test-framework').locators;

class ${componentName} {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Define selectors
    this.selectors = {
      // Add your selectors here
    };
  }

  /**
   * Check if component is visible
   * @returns {Promise<boolean>}
   */
  async isVisible() {
    // Implement component-specific visibility check
    return true;
  }
}

module.exports = ${componentName};
`;

  fs.writeFileSync(targetFile, template);
  console.log(`✅ Generated component: ${targetFile}`);
}
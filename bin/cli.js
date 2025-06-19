#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Get package version
const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description('Playwright Framework CLI');

program
  .command('init')
  .description('Initialize a new Playwright Framework project')
  .option('-n, --name <name>', 'Project name')
  .option('-t, --template <template>', 'Template to use (basic, full)', 'basic')
  .action(async (options) => {
    console.log('🎭 Initializing new AgentSync Test Framework project...');
    
    const projectName = options.name || path.basename(process.cwd());
    const templateDir = path.join(__dirname, '../templates/project-setup');
    const targetDir = process.cwd();
    
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
      
      // Install dependencies
      console.log('📦 Installing dependencies...');
      execSync('npm install', { stdio: 'inherit', cwd: targetDir });
      
      // Install Playwright browsers
      console.log('🌐 Installing Playwright browsers...');
      execSync('npx playwright install', { stdio: 'inherit', cwd: targetDir });
      
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
  .action((options) => {
    if (options.page) {
      generatePage(options.page);
    } else if (options.test) {
      generateTest(options.test);
    } else if (options.component) {
      generateComponent(options.component);
    } else {
      console.error('Please specify what to generate (--page, --test, or --component)');
    }
  });

program
  .command('docs')
  .description('Open framework documentation')
  .action(() => {
    console.log('Opening documentation...');
    const docsUrl = 'https://your-org.github.io/playwright-framework';
    
    const open = (process.platform === 'win32') ? 'start' : 
                (process.platform === 'darwin') ? 'open' : 'xdg-open';
    
    try {
      execSync(`${open} ${docsUrl}`);
    } catch (error) {
      console.log(`Documentation available at: ${docsUrl}`);
    }
  });

program.parse(process.argv);

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// Helper functions
function copyDirectorySync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectorySync(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function copyAndCustomizeTemplate(templateDir, targetDir, projectName) {
  // Copy package.json template
  const packageTemplate = path.join(templateDir, 'package.template.json');
  const packageTarget = path.join(targetDir, 'package.json');
  
  if (fs.existsSync(packageTemplate)) {
    let packageContent = fs.readFileSync(packageTemplate, 'utf8');
    packageContent = packageContent.replace(/PROJECT_NAME/g, projectName);
    packageContent = packageContent.replace(/project-name-tests/g, `${projectName.toLowerCase()}-tests`);
    fs.writeFileSync(packageTarget, packageContent);
  }
  
  // Copy playwright config template
  const configTemplate = path.join(templateDir, 'playwright.config.template.js');
  const configTarget = path.join(targetDir, 'playwright.config.js');
  
  if (fs.existsSync(configTemplate)) {
    fs.copyFileSync(configTemplate, configTarget);
  }
  
  // Copy environment template
  const envTemplate = path.join(templateDir, '.env.template');
  const envTarget = path.join(targetDir, '.env');
  
  if (fs.existsSync(envTemplate)) {
    fs.copyFileSync(envTemplate, envTarget);
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
  }
}

function generatePage(name) {
  const pageName = name.charAt(0).toUpperCase() + name.slice(1) + 'Page';
  const targetDir = path.join(process.cwd(), 'src/pages');
  const targetFile = path.join(targetDir, `${pageName}.js`);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const template = `/**
 * ${pageName} - Page Object for ${name} page
 * @class
 */
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
    await this.page.goto(\`\${process.env.BASE_URL || ''}\${path}\`);
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

function generateTest(name) {
  const testName = name.toLowerCase().replace(/\s+/g, '-');
  const targetDir = path.join(process.cwd(), 'src/tests');
  const targetFile = path.join(targetDir, `${testName}.spec.js`);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const template = `const { test, expect } = require('@playwright/test');

test.describe('${name} Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup for each test
    await page.goto(process.env.BASE_URL || 'https://example.com');
  });

  test('should load the page correctly', async ({ page }) => {
    // Test implementation
    const title = await page.title();
    expect(title).not.toBe('');
  });

  test('should perform basic functionality', async ({ page }) => {
    // Test implementation
    // Add your test steps here
  });
});
`;

  fs.writeFileSync(targetFile, template);
  console.log(`✅ Generated test file: ${targetFile}`);
}

function generateComponent(name) {
  const componentName = name.charAt(0).toUpperCase() + name.slice(1);
  const targetDir = path.join(process.cwd(), 'src/components');
  const targetFile = path.join(targetDir, `${componentName}.js`);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const template = `/**
 * ${componentName} - Reusable component
 * @class
 */
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
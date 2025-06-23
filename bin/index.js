#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

program
  .name('@igautomation/agentsyncprofessionalservices')
  .description('AgentSync Test Framework CLI')
  .version('1.0.1');

program
  .command('init')
  .description('Initialize a new test project')
  .option('-t, --template <template>', 'Template to use (basic, salesforce)', 'basic')
  .option('-d, --directory <directory>', 'Target directory', '.')
  .action((options) => {
    const templatePath = path.join(__dirname, '../templates', options.template);
    const targetPath = path.resolve(options.directory);
    
    if (!fs.existsSync(templatePath)) {
      console.error(`Template not found: ${options.template}`);
      process.exit(1);
    }
    
    console.log(`Initializing project from ${options.template} template...`);
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }
    
    // Copy template files
    copyDirectory(templatePath, targetPath);
    
    // Create auth directory for Salesforce
    if (options.template === 'salesforce') {
      const authDir = path.join(targetPath, 'auth');
      if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
      }
    }
    
    console.log('Project initialized successfully!');
    console.log('\nNext steps:');
    console.log('1. cd', options.directory !== '.' ? options.directory : '');
    console.log('2. npm install');
    console.log('3. cp .env.example .env');
    console.log('4. Edit .env with your credentials');
    if (options.template === 'salesforce') {
      console.log('5. npm run setup');
      console.log('6. npm test');
    } else {
      console.log('5. npm test');
    }
  });

function copyDirectory(source, destination) {
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

program.parse();
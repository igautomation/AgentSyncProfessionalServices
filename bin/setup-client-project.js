#!/usr/bin/env node

/**
 * Client Project Setup Script
 * 
 * This script sets up a new client project using the AgentSync Test Framework.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get the template directory
const templateDir = path.join(__dirname, '..', 'templates', 'project-setup');

// Function to prompt for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to copy a file with replacements
function copyFileWithReplacements(source, destination, replacements) {
  let content = fs.readFileSync(source, 'utf8');
  
  // Replace placeholders
  for (const [placeholder, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(placeholder, 'g'), value);
  }
  
  // Create directory if it doesn't exist
  const dir = path.dirname(destination);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write the file
  fs.writeFileSync(destination, content);
}

// Function to copy a directory recursively
function copyDirectoryRecursive(source, destination, replacements) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  // Read directory contents
  const files = fs.readdirSync(source);
  
  // Process each file/directory
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file.replace('.template', ''));
    
    // Check if it's a directory
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectoryRecursive(sourcePath, destPath, replacements);
    } else {
      // Copy file with replacements
      copyFileWithReplacements(sourcePath, destPath, replacements);
    }
  }
}

// Main function
async function main() {
  console.log('🚀 AgentSync Test Framework - Client Project Setup\n');
  
  // Get project information
  const projectName = await prompt('Project name: ');
  const projectDescription = await prompt('Project description: ');
  const baseUrl = await prompt('Base URL (default: https://client-app-url.com): ') || 'https://client-app-url.com';
  const apiUrl = await prompt('API URL (default: https://client-api-url.com): ') || 'https://client-api-url.com';
  
  // Create destination directory
  const destDir = path.join(process.cwd(), projectName);
  
  // Check if directory already exists
  if (fs.existsSync(destDir)) {
    const overwrite = await prompt(`Directory ${projectName} already exists. Overwrite? (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }
  
  // Create replacements object
  const replacements = {
    'client-project-name': projectName,
    'Client-specific test automation project using AgentSync Test Framework': projectDescription,
    'https://client-app-url.com': baseUrl,
    'https://client-api-url.com': apiUrl,
    '@igautomation/test-framework': '@igautomation/agentsyncprofessionalservices',
    '@igautomation/agentsyncprofessionalservices': '@igautomation/agentsyncprofessionalservices'
  };
  
  // Copy template files
  console.log(`\nCreating project in ${destDir}...`);
  copyDirectoryRecursive(templateDir, destDir, replacements);
  
  console.log('\n✅ Project created successfully!');
  console.log('\nNext steps:');
  console.log('1. Create a GitHub Personal Access Token with read:packages scope');
  console.log('2. Set up your .npmrc file with the token');
  console.log('3. Run: cd ' + projectName);
  console.log('4. Run: npm install');
  console.log('5. Run: npx playwright install');
  
  rl.close();
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
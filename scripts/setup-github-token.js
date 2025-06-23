#!/usr/bin/env node

/**
 * Script to help users set up their GitHub token for npm authentication
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('GitHub Token Setup Script');
console.log('=========================');
console.log('This script will help you set up your GitHub token for npm authentication.');
console.log('');

const askForToken = () => {
  rl.question('Enter your GitHub Personal Access Token (or press Enter to skip): ', (token) => {
    if (!token) {
      console.log('\nSkipping token setup. You will need to set up your token manually.');
      console.log('See docs/npm-setup.md for instructions.');
      rl.close();
      return;
    }

    rl.question('\nHow would you like to set up your token?\n1. Create/update .npmrc in project directory\n2. Set as environment variable\n3. Create/update .npmrc in home directory\nEnter choice (1-3): ', (choice) => {
      switch (choice) {
        case '1':
          setupProjectNpmrc(token);
          break;
        case '2':
          setupEnvironmentVariable(token);
          break;
        case '3':
          setupHomeNpmrc(token);
          break;
        default:
          console.log('Invalid choice. Please try again.');
          askForToken();
      }
    });
  });
};

const setupProjectNpmrc = (token) => {
  const npmrcContent = `@igautomation:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}`;
  
  try {
    fs.writeFileSync(path.join(process.cwd(), '.npmrc'), npmrcContent);
    console.log('\nCreated .npmrc file in project directory.');
    console.log('IMPORTANT: Make sure to set the GITHUB_TOKEN environment variable:');
    console.log(`\nexport GITHUB_TOKEN=${token}\n`);
    console.log('Add this to your shell profile file to make it permanent.');
    rl.close();
  } catch (error) {
    console.error('Error creating .npmrc file:', error);
    rl.close();
  }
};

const setupEnvironmentVariable = (token) => {
  const isWindows = process.platform === 'win32';
  const profileFile = isWindows ? 'N/A' : (process.env.SHELL?.includes('zsh') ? '~/.zshrc' : '~/.bash_profile');
  
  console.log('\nTo set up the environment variable:');
  
  if (isWindows) {
    console.log('\nFor Windows Command Prompt:');
    console.log(`set GITHUB_TOKEN=${token}`);
    console.log('\nFor Windows PowerShell:');
    console.log(`$env:GITHUB_TOKEN="${token}"`);
    console.log('\nTo make it permanent, add it to your system environment variables.');
  } else {
    console.log(`\nexport GITHUB_TOKEN=${token}`);
    console.log(`\nAdd this line to your ${profileFile} file to make it permanent.`);
  }
  
  console.log('\nThen create a .npmrc file with:');
  console.log('@igautomation:registry=https://npm.pkg.github.com/');
  console.log('//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}');
  
  rl.close();
};

const setupHomeNpmrc = (token) => {
  const homeDir = os.homedir();
  const npmrcPath = path.join(homeDir, '.npmrc');
  
  let npmrcContent = '';
  
  try {
    if (fs.existsSync(npmrcPath)) {
      npmrcContent = fs.readFileSync(npmrcPath, 'utf8');
      
      // Check if registry config already exists
      if (npmrcContent.includes('@igautomation:registry=')) {
        // Update existing config
        npmrcContent = npmrcContent
          .replace(/@igautomation:registry=.*(\r?\n|$)/, '@igautomation:registry=https://npm.pkg.github.com/\n')
          .replace(/\/\/npm\.pkg\.github\.com\/:_authToken=.*(\r?\n|$)/, `//npm.pkg.github.com/:_authToken=${token}\n`);
      } else {
        // Add new config
        npmrcContent += `\n@igautomation:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=${token}\n`;
      }
    } else {
      npmrcContent = `@igautomation:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=${token}\n`;
    }
    
    fs.writeFileSync(npmrcPath, npmrcContent);
    console.log(`\nUpdated .npmrc file in your home directory (${npmrcPath}).`);
    console.log('You should now be able to install and publish packages from GitHub Package Registry.');
    rl.close();
  } catch (error) {
    console.error('Error updating .npmrc file:', error);
    rl.close();
  }
};

askForToken();
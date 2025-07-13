#!/usr/bin/env node

/**
 * Script to publish the package to GitHub Packages
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Function to check if token is valid
function checkTokenValidity(token) {
  try {
    // Create a temporary .npmrc file
    const tempNpmrc = path.join(__dirname, '.temp-npmrc');
    fs.writeFileSync(tempNpmrc, `@igautomation:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${token}`);
    
    // Try to access the registry
    const result = spawnSync('npm', ['whoami', '--registry=https://npm.pkg.github.com/', '--userconfig', tempNpmrc], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    // Clean up
    fs.unlinkSync(tempNpmrc);
    
    // Check if the command was successful
    return result.status === 0;
  } catch (error) {
    return false;
  }
}

// Check if GITHUB_TOKEN is set
if (!process.env.GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN is not set. Please set it before running this script.');
  console.error('Example: export GITHUB_TOKEN=your_personal_access_token');
  console.error('\nAlternatively, run: npm run setup:publish-token');
  process.exit(1);
}

// Validate the token
if (!checkTokenValidity(process.env.GITHUB_TOKEN)) {
  console.error('❌ The provided GITHUB_TOKEN is invalid or does not have the required permissions.');
  console.error('Please ensure your token has the following scopes: repo, read:packages, write:packages');
  console.error('\nRun npm run setup:publish-token to set up a new token.');
  process.exit(1);
}

// Create .npmrc file for GitHub Packages
const npmrcContent = `@igautomation:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${process.env.GITHUB_TOKEN}`;

// Backup existing .npmrc if it exists
let npmrcBackup = null;
if (fs.existsSync('.npmrc')) {
  npmrcBackup = fs.readFileSync('.npmrc', 'utf8');
}

fs.writeFileSync('.npmrc', npmrcContent);

try {
  // Build the package
  console.log('🔨 Building package...');
  execSync('npm run build', { stdio: 'inherit' });

  // Ensure all necessary directories exist
  const dirs = ['templates', 'docs', 'config'];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Create dist directory if it doesn't exist
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Copy index.js to dist if it doesn't exist
  if (!fs.existsSync('dist/index.js') && fs.existsSync('index.js')) {
    fs.copyFileSync('index.js', 'dist/index.js');
  }

  // Publish to GitHub Packages
  console.log('📦 Publishing to GitHub Packages...');
  execSync('npm publish --access=restricted', { stdio: 'inherit' });

  console.log('✅ Package published successfully!');
  console.log('You can now install it with: npm install @igautomation/agentsyncprofessionalservices');
} catch (error) {
  console.error('❌ Failed to publish package:', error.message);
  
  if (error.message.includes('401 Unauthorized')) {
    console.error('\nAuthentication failed. Your token may be invalid or expired.');
    console.error('Run npm run setup:publish-token to set up a new token.');
  } else if (error.message.includes('403 Forbidden')) {
    console.error('\nYou do not have permission to publish this package.');
    console.error('Make sure your token has the write:packages scope and you have write access to the repository.');
  }
  
  process.exit(1);
} finally {
  // Restore original .npmrc if it existed
  if (npmrcBackup) {
    fs.writeFileSync('.npmrc', npmrcBackup);
  } else if (fs.existsSync('.npmrc')) {
    fs.unlinkSync('.npmrc');
  }
}
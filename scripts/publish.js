#!/usr/bin/env node

/**
 * Script to publish the package to GitHub Packages
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if GITHUB_TOKEN is set
if (!process.env.GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN is not set. Please set it before running this script.');
  console.error('Example: export GITHUB_TOKEN=your_personal_access_token');
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
  if (!fs.existsSync('dist/index.js')) {
    fs.copyFileSync('index.js', 'dist/index.js');
  }

  // Publish to GitHub Packages
  console.log('📦 Publishing to GitHub Packages...');
  execSync('npm publish --access=restricted', { stdio: 'inherit' });

  console.log('✅ Package published successfully!');
  console.log('You can now install it with: npm install @igautomation/agentsyncprofessionalservices');
} catch (error) {
  console.error('❌ Failed to publish package:', error.message);
  process.exit(1);
} finally {
  // Restore original .npmrc if it existed
  if (npmrcBackup) {
    fs.writeFileSync('.npmrc', npmrcBackup);
  } else {
    fs.unlinkSync('.npmrc');
  }
}
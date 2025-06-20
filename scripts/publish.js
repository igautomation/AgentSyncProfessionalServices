#!/usr/bin/env node

/**
 * Simple script to publish the package to GitHub Packages
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

fs.writeFileSync('.npmrc', npmrcContent);

try {
  // Build the package
  console.log('🔨 Building package...');
  execSync('npm run build', { stdio: 'inherit' });

  // Publish to GitHub Packages
  console.log('📦 Publishing to GitHub Packages...');
  execSync('npm publish', { stdio: 'inherit' });

  console.log('✅ Package published successfully!');
  console.log('You can now install it with: npm install @igautomation/agentsyncprofessionalservices');
} catch (error) {
  console.error('❌ Failed to publish package:', error.message);
  process.exit(1);
} finally {
  // Clean up .npmrc
  fs.unlinkSync('.npmrc');
}
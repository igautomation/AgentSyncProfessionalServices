#!/usr/bin/env node

/**
 * Quick fix script to publish to GitHub Packages
 * This script directly updates the .npmrc file with a token provided by the user
 */

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Quick Publish Fix');
console.log('================');
console.log('This script will help you quickly publish to GitHub Packages by updating your .npmrc file.');
console.log('');

rl.question('Enter your GitHub Personal Access Token: ', (token) => {
  if (!token) {
    console.error('Token is required for publishing.');
    rl.close();
    process.exit(1);
  }

  // Create .npmrc file with the token
  const npmrcContent = `@igautomation:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=${token}`;
  
  // Backup existing .npmrc if it exists
  let npmrcBackup = null;
  if (fs.existsSync('.npmrc')) {
    npmrcBackup = fs.readFileSync('.npmrc', 'utf8');
  }
  
  try {
    // Write the new .npmrc
    fs.writeFileSync('.npmrc', npmrcContent);
    console.log('\nUpdated .npmrc file with your token.');
    
    // Try to publish
    console.log('\nAttempting to publish...');
    execSync('npm publish --access=restricted', { stdio: 'inherit' });
    console.log('\nPackage published successfully!');
  } catch (error) {
    console.error('\nFailed to publish package. Error:', error.message);
    
    if (error.message.includes('401 Unauthorized')) {
      console.error('\nAuthentication failed. Your token may be invalid or expired.');
      console.error('Make sure your token has the repo, read:packages, and write:packages scopes.');
    } else if (error.message.includes('403 Forbidden')) {
      console.error('\nYou do not have permission to publish this package.');
      console.error('Make sure your token has the write:packages scope and you have write access to the repository.');
    }
  } finally {
    // Restore original .npmrc if it existed
    if (npmrcBackup) {
      fs.writeFileSync('.npmrc', npmrcBackup);
      console.log('\nRestored original .npmrc file.');
    } else {
      fs.unlinkSync('.npmrc');
      console.log('\nRemoved temporary .npmrc file.');
    }
    
    rl.close();
  }
});
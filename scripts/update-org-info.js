#!/usr/bin/env node

/**
 * Script to update package.json with client organization information
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Update Organization Information');
console.log('==============================');
console.log('This script will update package.json with your organization information.');
console.log('');

// Function to update package.json
const updatePackageJson = (orgName, repoName) => {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Backup original package.json
    fs.writeFileSync(`${packageJsonPath}.backup`, JSON.stringify(packageJson, null, 2));
    
    // Update package name
    packageJson.name = `@${orgName}/${repoName}`;
    
    // Update repository URL
    if (packageJson.repository && packageJson.repository.url) {
      packageJson.repository.url = `git+https://github.com/${orgName}/${repoName}.git`;
    } else {
      packageJson.repository = {
        type: 'git',
        url: `git+https://github.com/${orgName}/${repoName}.git`
      };
    }
    
    // Update publishConfig
    packageJson.publishConfig = {
      registry: 'https://npm.pkg.github.com'
    };
    
    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    console.log('\n✅ Successfully updated package.json with your organization information.');
    console.log(`\nPackage name: @${orgName}/${repoName}`);
    console.log(`Repository URL: https://github.com/${orgName}/${repoName}`);
    
    // Update .npmrc file
    const npmrcPath = path.join(process.cwd(), '.npmrc');
    const npmrcContent = `@${orgName}:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}`;
    fs.writeFileSync(npmrcPath, npmrcContent);
    
    console.log('\n✅ Updated .npmrc file with your organization scope.');
    
    // Check if README.md exists and update it
    const readmePath = path.join(process.cwd(), 'README.md');
    if (fs.existsSync(readmePath)) {
      let readmeContent = fs.readFileSync(readmePath, 'utf8');
      
      // Replace any occurrences of @igautomation with the new org name
      readmeContent = readmeContent.replace(/@igautomation\/agentsyncprofessionalservices/g, `@${orgName}/${repoName}`);
      
      fs.writeFileSync(readmePath, readmeContent);
      console.log('\n✅ Updated README.md with your organization name.');
    }
    
    console.log('\n🎉 All done! Next steps:');
    console.log('1. Review the changes to ensure they are correct');
    console.log('2. Set up your GitHub token: npm run setup:publish-token');
    console.log('3. Push the code to your repository');
    console.log('4. Publish the package: npm run publish:framework');
    
  } catch (error) {
    console.error('\n❌ Error updating package.json:', error.message);
    console.log('Please update package.json manually with your organization information.');
  }
};

// Ask for organization name
rl.question('Enter your GitHub organization name: ', (orgName) => {
  if (!orgName) {
    console.log('\n❌ Organization name is required.');
    rl.close();
    return;
  }
  
  // Ask for repository name
  rl.question(`Enter repository name (default: agentsync-test-framework): `, (repoName) => {
    // Use default if not provided
    repoName = repoName || 'agentsync-test-framework';
    
    // Confirm changes
    rl.question(`\nUpdate package.json with the following information?\n- Organization: ${orgName}\n- Repository: ${repoName}\n- Package name: @${orgName}/${repoName}\n\nProceed? (y/n): `, (answer) => {
      if (answer.toLowerCase() === 'y') {
        updatePackageJson(orgName, repoName);
      } else {
        console.log('\nOperation cancelled. No changes were made.');
      }
      rl.close();
    });
  });
});
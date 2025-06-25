#!/usr/bin/env node

/**
 * Script to help users set up their GitHub token for npm publishing
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');
const https = require('https');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('GitHub Publish Token Setup Script');
console.log('================================');
console.log('This script will help you set up your GitHub token for publishing to GitHub Packages.');
console.log('');

// Function to validate GitHub token has correct permissions
const validateGitHubToken = (token) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: '/user',
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js',
        'Authorization': `token ${token}`
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const userData = JSON.parse(data);
            resolve(userData);
          } catch (e) {
            reject(new Error('Failed to parse GitHub API response'));
          }
        });
      } else {
        reject(new Error(`GitHub API returned status code ${res.statusCode}`));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

const askForToken = () => {
  rl.question('Enter your GitHub Personal Access Token: ', async (token) => {
    if (!token) {
      console.log('\nToken is required for publishing. Please generate a token with repo, read:packages, and write:packages scopes.');
      askForToken();
      return;
    }

    try {
      // Validate token before proceeding
      await validateGitHubToken(token);
      console.log('\n✅ Token authentication successful!');
      
      rl.question('\nHow would you like to set up your token?\n1. Update .npmrc directly with token\n2. Use environment variable (recommended)\nEnter choice (1-2): ', (choice) => {
        switch (choice) {
          case '1':
            setupDirectToken(token);
            break;
          case '2':
            setupEnvironmentVariable(token);
            break;
          default:
            console.log('Invalid choice. Please try again.');
            rl.close();
            process.exit(1);
        }
      });
    } catch (error) {
      console.error('\n❌ Token validation failed:', error.message);
      console.log('Please ensure your token has the following scopes: repo, read:packages, write:packages');
      console.log('You can create a new token at: https://github.com/settings/tokens');
      askForToken();
    }
  });
};

const setupDirectToken = (token) => {
  try {
    const npmrcContent = `@igautomation:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=${token}`;
    fs.writeFileSync(path.join(process.cwd(), '.npmrc'), npmrcContent);
    console.log('\nUpdated .npmrc file with your token.');
    console.log('\nWARNING: This token is now in your .npmrc file. Make sure not to commit this file to version control.');
    
    rl.question('\nWould you like to try publishing now? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        try {
          console.log('\nAttempting to publish...');
          execSync('npm publish --access=restricted', { stdio: 'inherit' });
          console.log('\nPackage published successfully!');
        } catch (error) {
          console.error('\nFailed to publish package. Please check the error message above.');
        }
      }
      rl.close();
    });
  } catch (error) {
    console.error('Error updating .npmrc file:', error);
    rl.close();
  }
};

const setupEnvironmentVariable = (token) => {
  try {
    // Set the environment variable for the current process
    process.env.GITHUB_TOKEN = token;
    
    // Update .npmrc to use the environment variable
    const npmrcContent = `@igautomation:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}`;
    fs.writeFileSync(path.join(process.cwd(), '.npmrc'), npmrcContent);
    
    console.log('\nUpdated .npmrc file to use GITHUB_TOKEN environment variable.');
    console.log(`\nThe GITHUB_TOKEN environment variable has been set for this session.`);
    console.log('\nTo make this permanent, add the following to your shell profile:');
    console.log(`\nexport GITHUB_TOKEN=${token}`);
    
    rl.question('\nWould you like to try publishing now? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        try {
          console.log('\nAttempting to publish...');
          execSync('npm publish --access=restricted', { stdio: 'inherit' });
          console.log('\nPackage published successfully!');
        } catch (error) {
          console.error('\nFailed to publish package. Please check the error message above.');
        }
      }
      rl.close();
    });
  } catch (error) {
    console.error('Error setting up environment variable:', error);
    rl.close();
  }
};

askForToken();
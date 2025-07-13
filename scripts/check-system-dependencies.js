#!/usr/bin/env node

/**
 * Script to check system dependencies required for canvas
 */
const { execSync } = require('child_process');
const os = require('os');
const chalk = require('chalk');

// Determine the operating system
const platform = os.platform();

console.log(chalk.blue('Checking system dependencies for canvas...'));

let canvasSupported = false;
let missingDependencies = [];
let installCommand = '';

try {
  // Try to require canvas
  require('canvas');
  console.log(chalk.green('✓ Canvas is installed and working correctly.'));
  canvasSupported = true;
} catch (error) {
  console.log(chalk.yellow('⚠ Canvas is not installed or has installation issues.'));
  
  // Check for system dependencies based on platform
  if (platform === 'darwin') {
    // macOS
    try {
      execSync('brew --version', { stdio: 'ignore' });
      
      try {
        execSync('pkg-config --version', { stdio: 'ignore' });
      } catch (e) {
        missingDependencies.push('pkg-config');
      }
      
      const libraries = ['cairo', 'pango', 'libpng', 'jpeg', 'giflib', 'librsvg'];
      for (const lib of libraries) {
        try {
          execSync(`brew list ${lib}`, { stdio: 'ignore' });
        } catch (e) {
          missingDependencies.push(lib);
        }
      }
      
      if (missingDependencies.length > 0) {
        installCommand = `brew install ${missingDependencies.join(' ')}`;
      }
    } catch (e) {
      console.log(chalk.red('✗ Homebrew is not installed. Please install Homebrew first.'));
      console.log(chalk.blue('   Visit: https://brew.sh/'));
    }
  } else if (platform === 'linux') {
    // Linux (assuming Debian/Ubuntu)
    try {
      execSync('apt-get --version', { stdio: 'ignore' });
      
      const packages = [
        'build-essential',
        'libcairo2-dev',
        'libpango1.0-dev',
        'libjpeg-dev',
        'libgif-dev',
        'librsvg2-dev'
      ];
      
      for (const pkg of packages) {
        try {
          execSync(`dpkg -s ${pkg}`, { stdio: 'ignore' });
        } catch (e) {
          missingDependencies.push(pkg);
        }
      }
      
      if (missingDependencies.length > 0) {
        installCommand = `sudo apt-get update && sudo apt-get install -y ${missingDependencies.join(' ')}`;
      }
    } catch (e) {
      console.log(chalk.yellow('⚠ Could not check for Debian/Ubuntu packages. You might be using a different Linux distribution.'));
    }
  } else if (platform === 'win32') {
    // Windows
    console.log(chalk.yellow('⚠ Windows requires manual installation of dependencies:'));
    console.log('  1. Install Microsoft Visual C++ Build Tools');
    console.log('  2. Install GTK 2');
    console.log('  3. Install libjpeg-turbo');
    console.log(chalk.blue('   See docs/SYSTEM_DEPENDENCIES.md for more details'));
  }
}

// Display results
if (!canvasSupported) {
  if (missingDependencies.length > 0) {
    console.log(chalk.yellow(`⚠ Missing dependencies: ${missingDependencies.join(', ')}`));
    console.log(chalk.blue('To install missing dependencies, run:'));
    console.log(chalk.green(`   ${installCommand}`));
  }
  
  console.log(chalk.blue('\nAlternative: Install without canvas'));
  console.log('If you cannot install the system dependencies, you can reinstall the package with:');
  console.log(chalk.green('   npm install github:igautomation/AgentSyncProfessionalServices --no-optional'));
  console.log('Note: Some features like accessibility testing and chart generation may not work fully.');
}

console.log(chalk.blue('\nFor more information, see docs/SYSTEM_DEPENDENCIES.md'));
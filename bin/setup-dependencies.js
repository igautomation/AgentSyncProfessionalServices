#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('AgentSync Test Framework - System Dependencies Setup');
console.log('===================================================\n');

// Function to check if a command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Function to install dependencies based on OS
async function installDependencies() {
  const platform = os.platform();
  
  if (platform === 'darwin') {
    // macOS
    console.log('Detected macOS system');
    
    const hasHomebrew = commandExists('brew');
    if (!hasHomebrew) {
      console.log('Homebrew not found. Installing Homebrew...');
      console.log('Please follow the prompts to install Homebrew:');
      
      try {
        execSync('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', 
          { stdio: 'inherit' });
      } catch (error) {
        console.error('Failed to install Homebrew. Please install it manually from https://brew.sh');
        return false;
      }
    }
    
    console.log('Installing required dependencies with Homebrew...');
    try {
      execSync('brew install pkg-config cairo pango libpng jpeg giflib librsvg', 
        { stdio: 'inherit' });
      return true;
    } catch (error) {
      console.error('Failed to install dependencies with Homebrew.');
      return false;
    }
  } 
  else if (platform === 'linux') {
    // Linux
    console.log('Detected Linux system');
    
    // Try to determine Linux distribution
    let distro = '';
    try {
      if (fs.existsSync('/etc/os-release')) {
        const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
        if (osRelease.includes('ID=ubuntu') || osRelease.includes('ID=debian')) {
          distro = 'debian';
        } else if (osRelease.includes('ID=centos') || osRelease.includes('ID=rhel') || osRelease.includes('ID=fedora')) {
          distro = 'rhel';
        }
      }
    } catch (error) {
      // Ignore errors reading os-release
    }
    
    if (distro === 'debian') {
      console.log('Installing dependencies for Ubuntu/Debian...');
      try {
        execSync('sudo apt-get update && sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev', 
          { stdio: 'inherit' });
        return true;
      } catch (error) {
        console.error('Failed to install dependencies with apt-get.');
        return false;
      }
    } 
    else if (distro === 'rhel') {
      console.log('Installing dependencies for CentOS/RHEL/Fedora...');
      try {
        execSync('sudo yum install -y gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel', 
          { stdio: 'inherit' });
        return true;
      } catch (error) {
        console.error('Failed to install dependencies with yum.');
        return false;
      }
    } 
    else {
      console.log('Unable to determine Linux distribution.');
      console.log('Please install the required dependencies manually:');
      console.log('For Ubuntu/Debian: sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev');
      console.log('For CentOS/RHEL/Fedora: sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel');
      return false;
    }
  } 
  else if (platform === 'win32') {
    // Windows
    console.log('Detected Windows system');
    console.log('Windows requires manual installation of dependencies:');
    console.log('1. Install Visual Studio Build Tools with C++ support');
    console.log('2. Install GTK 2 for canvas support');
    console.log('Please follow the guide at: https://github.com/Automattic/node-canvas/wiki/Installation:-Windows');
    return false;
  } 
  else {
    console.log(`Unsupported platform: ${platform}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('This script will check and install system dependencies required for the AgentSync Test Framework.');
  
  rl.question('Do you want to proceed with installation? (y/n): ', async (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      const success = await installDependencies();
      
      if (success) {
        console.log('\n✅ Dependencies installed successfully!');
      } else {
        console.log('\n⚠️ Some dependencies could not be installed automatically.');
        console.log('Please refer to the documentation for manual installation instructions:');
        console.log(path.join(__dirname, '..', 'docs', 'SYSTEM_DEPENDENCIES.md'));
      }
    } else {
      console.log('Installation cancelled.');
    }
    
    rl.close();
  });
}

main();
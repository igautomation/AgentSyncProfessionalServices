#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

console.log('Checking system dependencies for canvas and chart.js...');

// Function to check if a command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Check OS type
const platform = os.platform();

if (platform === 'darwin') {
  // macOS
  console.log('Detected macOS system');
  
  const hasPkgConfig = commandExists('pkg-config');
  
  if (!hasPkgConfig) {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: pkg-config not found. This is required for canvas package.');
    console.log('\x1b[36m%s\x1b[0m', 'To install required dependencies, run:');
    console.log('brew install pkg-config cairo pango libpng jpeg giflib librsvg');
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✓ pkg-config found');
  }
} else if (platform === 'linux') {
  // Linux
  console.log('Detected Linux system');
  
  const hasPkgConfig = commandExists('pkg-config');
  
  if (!hasPkgConfig) {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: pkg-config not found. This is required for canvas package.');
    console.log('\x1b[36m%s\x1b[0m', 'To install required dependencies on Ubuntu/Debian, run:');
    console.log('sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev');
    console.log('\x1b[36m%s\x1b[0m', 'For other Linux distributions, please check the canvas documentation.');
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✓ pkg-config found');
  }
} else if (platform === 'win32') {
  // Windows
  console.log('Detected Windows system');
  console.log('\x1b[36m%s\x1b[0m', 'For Windows, please ensure you have the following:');
  console.log('1. Visual Studio Build Tools with C++ support');
  console.log('2. GTK 2 for canvas support');
  console.log('See: https://github.com/Automattic/node-canvas/wiki/Installation:-Windows');
}

console.log('\x1b[36m%s\x1b[0m', '\nNote: This framework uses chart.js v4.x with chartjs-node-canvas.');
console.log('If you encounter peer dependency warnings, they can be safely ignored as overrides are configured in package.json.');
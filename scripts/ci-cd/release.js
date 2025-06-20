#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function releaseFramework() {
  console.log('🚀 AgentSync Test Framework Release Process\n');

  try {
    // Check if we're on main branch
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    if (currentBranch !== 'main' && currentBranch !== 'master') {
      console.error('❌ Please switch to main branch before releasing');
      process.exit(1);
    }

    // Check for uncommitted changes
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.error('❌ Please commit all changes before releasing');
      process.exit(1);
    }

    // Get current version
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const currentVersion = packageJson.version;
    console.log(`Current version: ${currentVersion}`);

    // Ask for new version
    const newVersion = await question('Enter new version (e.g., 1.2.3): ');
    if (!newVersion.match(/^\d+\.\d+\.\d+$/)) {
      console.error('❌ Invalid version format. Use semantic versioning (e.g., 1.2.3)');
      process.exit(1);
    }

    // Ask for release type
    console.log('\nRelease type:');
    console.log('1. Patch (bug fixes)');
    console.log('2. Minor (new features, backward compatible)');
    console.log('3. Major (breaking changes)');
    const releaseType = await question('Select release type (1-3): ');
    
    // Ask for release notes
    console.log('\nEnter release notes (press Enter, then Ctrl+D when done):');
    let releaseNotes = '';
    for await (const line of rl) {
      releaseNotes += line + '\n';
    }
    
    // Reopen readline interface
    rl.close();
    const rl2 = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Confirm release
    const confirm = await new Promise((resolve) => {
      rl2.question(`\nRelease v${newVersion}? (y/N): `, resolve);
    });
    
    if (confirm.toLowerCase() !== 'y') {
      console.log('Release cancelled');
      rl2.close();
      process.exit(0);
    }

    console.log('\n📝 Updating version...');
    
    // Update package.json version
    packageJson.version = newVersion;
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');

    // Update CHANGELOG.md
    updateChangelog(newVersion, releaseNotes, releaseType);

    // Run tests
    console.log('🧪 Running tests...');
    execSync('npm test', { stdio: 'inherit' });

    // Build framework
    console.log('🔨 Building framework...');
    execSync('npm run build', { stdio: 'inherit' });

    // Commit changes
    console.log('📝 Committing changes...');
    execSync(`git add package.json CHANGELOG.md`);
    execSync(`git commit -m "Release v${newVersion}"`);

    // Create tag
    console.log('🏷️  Creating tag...');
    execSync(`git tag -a v${newVersion} -m "Release v${newVersion}"`);

    // Push changes
    console.log('📤 Pushing changes...');
    execSync('git push origin main');
    execSync(`git push origin v${newVersion}`);

    // Create GitHub release
    console.log('🎉 Creating GitHub release...');
    try {
      execSync(`gh release create v${newVersion} --title "v${newVersion}" --notes "${releaseNotes.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
    } catch (error) {
      console.warn('⚠️  Could not create GitHub release. Please create manually.');
    }

    // Publish to GitHub Packages
    console.log('📦 Publishing to GitHub Packages...');
    try {
      execSync('npm publish', { stdio: 'inherit' });
    } catch (error) {
      console.warn('⚠️  Could not publish to GitHub Packages. Please publish manually.');
      console.warn('⚠️  Error:', error.message);
    }

    console.log(`\n✅ Successfully released v${newVersion}!`);
    console.log('\nNext steps:');
    console.log('1. Notify teams about the new release');
    console.log('2. Update project dependencies: npm update @agentsync/test-framework');
    console.log('3. Review the release on GitHub');

  } catch (error) {
    console.error('❌ Release failed:', error.message);
    process.exit(1);
  } finally {
    if (rl2) rl2.close();
  }
}

function updateChangelog(version, notes, releaseType) {
  const changelogPath = 'CHANGELOG.md';
  const date = new Date().toISOString().split('T')[0];
  
  let changelog = '';
  if (fs.existsSync(changelogPath)) {
    changelog = fs.readFileSync(changelogPath, 'utf8');
  } else {
    changelog = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
  }

  // Determine release type label
  let releaseTypeLabel = '';
  switch (releaseType) {
    case '1':
      releaseTypeLabel = '### 🐛 Bug Fixes';
      break;
    case '2':
      releaseTypeLabel = '### ✨ New Features';
      break;
    case '3':
      releaseTypeLabel = '### 💥 Breaking Changes';
      break;
    default:
      releaseTypeLabel = '### Changes';
  }

  const newEntry = `## [${version}] - ${date}\n\n${releaseTypeLabel}\n\n${notes}\n\n`;
  
  // Insert new entry after the header
  const lines = changelog.split('\n');
  const headerEndIndex = lines.findIndex(line => line.startsWith('## '));
  
  if (headerEndIndex === -1) {
    // No existing entries, add after header
    changelog += newEntry;
  } else {
    // Insert before first existing entry
    lines.splice(headerEndIndex, 0, ...newEntry.split('\n'));
    changelog = lines.join('\n');
  }

  fs.writeFileSync(changelogPath, changelog);
}

// Run if called directly
if (require.main === module) {
  releaseFramework();
}

module.exports = { releaseFramework };
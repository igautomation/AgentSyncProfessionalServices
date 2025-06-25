# Publishing Guide

This guide explains how to publish the framework to GitHub Packages.

## Prerequisites

1. GitHub Personal Access Token with the following permissions:
   - `repo` (Full control of private repositories)
   - `write:packages` (Upload packages to GitHub Package Registry)
   - `read:packages` (Download packages from GitHub Package Registry)

## Automatic Publishing (Recommended)

The framework is automatically published when a new GitHub release is created:

1. Go to the GitHub repository
2. Click on "Releases" in the right sidebar
3. Click "Create a new release"
4. Enter a version tag (e.g., `v1.0.1`)
5. Add release notes
6. Click "Publish release"

The GitHub Actions workflow will automatically build and publish the package.

## Manual Publishing

If you need to publish manually:

1. Set your GitHub token:

```bash
export GITHUB_TOKEN=your_personal_access_token
```

2. Run the publish script:

```bash
npm run publish:framework
```

## Troubleshooting

### Authentication Error

If you see an error like:

```
npm error code E401
npm error 401 Unauthorized - PUT https://npm.pkg.github.com/@igautomation%2fagentsyncprofessionalservices
```

Check that:
1. Your GitHub token has the correct permissions
2. The token is correctly set in the environment
3. The package name in package.json matches your GitHub repository name exactly
4. You have write access to the repository
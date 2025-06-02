<!-- Source: /Users/mzahirudeen/playwright-framework-dev/docs-backup/consolidated-docs/.github-pages-README.md -->

<!-- Source: /Users/mzahirudeen/playwright-framework/.github/pages/README.md -->

# GitHub Pages Deployment Configuration

This directory contains scripts and configuration for deploying static content to GitHub Pages.

## Contents

- `deploy-docusaurus.sh`: A script to build and deploy the Docusaurus site from `docs/docusaurus/` to GitHub Pages.

## Deployment Process

1. Ensure the Docusaurus site is set up in `docs/docusaurus/`.
2. The GitHub Actions workflow (in `.github/workflows/`) calls `deploy-docusaurus.sh` to build and deploy the site.
3. The site is published to the `gh-pages` branch and hosted on GitHub Pages.

## Notes

- The repository must have GitHub Pages enabled in the settings, with the source set to the `gh-pages` branch.
- If using a custom domain, update the repository settings accordingly.

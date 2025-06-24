# AgentSync Framework Setup Checklist

Use this checklist to track your progress in setting up the AgentSync Professional Services framework in your organization.

## Initial Setup

- [ ] Create a new repository in your GitHub organization
  - Repository name: `agentsync-test-framework` (or your preferred name)
  - Visibility: Private (recommended)

- [ ] Create a GitHub Personal Access Token (PAT)
  - Go to: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Required scopes: `repo`, `read:packages`, `write:packages`
  - Token expiration: Set appropriate expiration (90 days recommended)

## Repository Configuration

- [ ] Clone the provided framework code to your local machine
  ```bash
  git clone /path/to/AgentSyncProfessionalServices your-repo-name
  ```

- [ ] Update package.json with your organization details
  ```json
  "name": "@your-org/agentsync-test-framework",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-org/agentsync-test-framework.git"
  }
  ```

- [ ] Set up your Git remote
  ```bash
  git remote set-url origin https://github.com/your-org/agentsync-test-framework.git
  ```

## Publishing Setup

- [ ] Run the token setup script
  ```bash
  npm run setup:publish-token
  ```

- [ ] Choose your token storage method
  - [ ] Option 1: Direct .npmrc update (quick)
  - [ ] Option 2: Environment variable (recommended)
    ```bash
    export GITHUB_TOKEN=your_github_token
    ```

- [ ] Add token to your shell profile (if using Option 2)
  ```bash
  echo 'export GITHUB_TOKEN=your_github_token' >> ~/.bash_profile  # or ~/.zshrc
  source ~/.bash_profile  # or source ~/.zshrc
  ```

## Initial Publication

- [ ] Push code to your repository
  ```bash
  git add .
  git commit -m "Initial commit of AgentSync test framework"
  git push -u origin main
  ```

- [ ] Publish the package
  ```bash
  npm run publish:framework
  ```

- [ ] Verify package appears in your GitHub Packages
  - Go to: Your repository → Packages tab

## Automated Publishing (Optional)

- [ ] Set up GitHub Actions workflow
  - [ ] Create `.github/workflows/publish.yml`
  - [ ] Configure workflow to publish on release creation

## Client Project Setup

- [ ] Create a test client project
  ```bash
  mkdir test-client-project
  cd test-client-project
  ```

- [ ] Set up authentication
  ```
  # .npmrc file
  @your-org:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
  ```

- [ ] Install the framework
  ```bash
  npm install @your-org/agentsync-test-framework
  ```

- [ ] Verify installation works
  ```bash
  npx playwright test
  ```

## Documentation

- [ ] Update documentation with your organization details
  - [ ] README.md
  - [ ] docs/INSTALLATION.md
  - [ ] docs/CLIENT_SETUP.md

- [ ] Share documentation with your team

## Team Access

- [ ] Grant team members access to the repository
- [ ] Ensure team members have appropriate GitHub Packages access
- [ ] Share PAT creation instructions with team members who need to publish
# Using Git Submodules for Private Dependencies

Git submodules allow you to include other Git repositories within your project. This is useful for private dependencies that you want to include directly in your project.

## Adding a Submodule

```bash
# Add the submodule to a specific directory
git submodule add https://github.com/igautomation/agentsyncprofessionalservices.git vendor/framework

# Initialize and update the submodule
git submodule update --init --recursive
```

## Using the Submodule in Your Project

Once you've added the submodule, you can reference it in your package.json:

```json
{
  "dependencies": {
    "private-framework": "file:./vendor/framework"
  }
}
```

## Updating Submodules

```bash
# Pull latest changes for all submodules
git submodule update --remote

# Or for a specific submodule
git submodule update --remote vendor/framework
```

## Cloning a Repository with Submodules

```bash
# Clone the main repository and all submodules
git clone --recursive https://github.com/your-org/your-repo.git

# Or if you already cloned without --recursive
git submodule update --init --recursive
```

## CI/CD Configuration

For CI/CD environments, make sure your CI system has access to the private repository. You may need to:

1. Use deploy keys
2. Use a machine user with read-only access
3. Use a personal access token with appropriate scopes
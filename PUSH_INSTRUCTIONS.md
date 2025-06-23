# Instructions to Push Changes

GitHub has detected a secret (GitHub Personal Access Token) in your commit history. To push your changes, you need to follow these steps:

## Option 1: Allow the Secret via GitHub UI (Quickest Solution)

1. Visit the following URL to allow the secret:
   https://github.com/igautomation/AgentSyncProfessionalServices/security/secret-scanning/unblock-secret/2yv59BXtZoWt6Nho5hNinUlJCNL

2. Select a reason for allowing the secret (e.g., "Secret is no longer valid")

3. Click "Allow secret"

4. Try pushing again:
   ```
   git push origin main
   ```

## Option 2: Rewrite Git History (More Complex)

If you prefer to completely remove the secret from the Git history:

1. Create a backup of your repository first:
   ```
   cp -r /Users/mzahirudeen/Desktop/AgentSync/Client\ Deliverable/AgentSyncProfessionalServices /Users/mzahirudeen/Desktop/AgentSync/Client\ Deliverable/AgentSyncProfessionalServices_backup
   ```

2. Use the BFG Repo-Cleaner tool to remove the secret:
   ```
   # Install BFG
   brew install bfg

   # Create a text file with the secret
   echo "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" > secrets.txt

   # Run BFG to replace the secret with "***REMOVED***"
   bfg --replace-text secrets.txt

   # Remove the secrets file
   rm secrets.txt

   # Clean up the repository
   git reflog expire --expire=now --all && git gc --prune=now --aggressive

   # Force push the changes
   git push origin --force
   ```

## Important Next Steps

1. **Revoke the exposed token immediately** by going to GitHub Settings > Developer Settings > Personal Access Tokens

2. **Create a new token** to replace the old one

3. **Update any systems or services** that were using the old token

4. **Use environment variables** for storing tokens in the future, as implemented in the recent changes

Remember: Never commit secrets or credentials to version control!
# Branch Protection Setup Guide

To ensure that pull requests cannot be merged if tests fail, you need to set up branch protection rules in your GitHub repository settings. Follow these steps:

1. Go to your repository on GitHub
2. Click on "Settings"
3. In the left sidebar, click on "Branches"
4. Under "Branch protection rules", click "Add rule"
5. In the "Branch name pattern" field, enter `main`
6. Enable the following options:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
7. In the "Status checks that are required" search box, search for and select:
   - `build-and-test` (from the PR Checks workflow)
8. Click "Create" or "Save changes"

This configuration will:
- Require pull requests for any changes to the main branch
- Prevent merging of pull requests until the CI tests pass
- Ensure branches are up to date with the main branch before merging

Note: You need to have admin access to the repository to configure branch protection rules.
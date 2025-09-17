# NPM Release Setup

This repository now has automated NPM releases configured via GitHub Actions.

## Setup Required (One-time)

To enable automated NPM publishing, you need to configure an NPM token:

1. **Generate an NPM token:**
   - Log in to [npmjs.com](https://npmjs.com)
   - Go to "Access Tokens" in your account settings
   - Click "Generate New Token"
   - Choose "Automation" type for CI/CD usage
   - Copy the generated token

2. **Add the token to GitHub:**
   - Go to your repository settings on GitHub
   - Navigate to "Secrets and variables" → "Actions"
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: paste the NPM token from step 1
   - Click "Add secret"

## How to Release

Once the setup is complete, releasing a new version is simple:

1. **Update the version in package.json:**
   ```bash
   npm version patch    # for bug fixes
   npm version minor    # for new features
   npm version major    # for breaking changes
   ```

2. **Create a GitHub release:**
   - Go to [Releases](https://github.com/albertorestifo/node-dijkstra/releases)
   - Click "Create a new release"
   - Create a new tag that matches your package.json version (e.g., `v2.5.1`)
   - Add release notes describing the changes
   - Click "Publish release"

3. **Automated publishing:**
   - The GitHub Actions workflow will automatically trigger
   - It will install dependencies, run tests, and publish to NPM
   - You can monitor the progress in the "Actions" tab

## Workflow Details

The release workflow (`.github/workflows/release.yml`):
- Triggers on GitHub release publication
- Uses Node.js 18.x
- Installs dependencies with `npm ci`
- Runs the full test suite (`npm test`)
- Publishes to NPM only if tests pass
- Uses the `NPM_TOKEN` secret for authentication

## Troubleshooting

- **Release fails:** Check the Actions tab for error logs
- **Authentication issues:** Verify the `NPM_TOKEN` secret is correctly set
- **Version conflicts:** Ensure the package.json version hasn't been published before
- **Test failures:** Fix any failing tests before the release will proceed
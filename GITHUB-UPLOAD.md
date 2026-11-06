# Upload and publish this portfolio

This package contains the editable source and the finished website in dist.
You do not need to install packages or run a build for the first publication.

## Upload

1. Extract the ZIP on your computer.
2. Create a GitHub repository named portfolio. Choose Public for GitHub Free Pages hosting. Leave the optional README, gitignore and license additions off; this package contains its own files.
3. Open the new repository and choose uploading an existing file (or Add file > Upload files).
4. Drag ALL contents of the extracted folder into the upload area, including .github and .gitignore. Do not upload the ZIP or an extra enclosing folder.
5. Commit the files to the main branch.
6. The repository root must contain .github, dist, src, scripts, reference, package.json, server.mjs and these instructions.

## Make the website live with GitHub Pages

1. Open repository Settings > Pages.
2. Under Build and deployment, set Source to GitHub Actions.
3. Open Actions > Publish portfolio > Run workflow. Select main and click Run workflow.
4. Wait for upload and deploy to finish successfully. If the first automatic run failed before Pages was enabled, run it again now.
5. Open Settings > Pages and click Visit site. Your project address normally looks like https://YOUR-USERNAME.github.io/portfolio/.
6. Leave Custom domain empty until you buy one. Use the HTTPS address.

If the workflow does not appear, check that .github/workflows/publish-website.yml exists in the repository. A Pages deployment has not been tested in your GitHub account yet.

## Updates

The workflow publishes the existing dist folder. It does not rebuild source files.
For HTML and main site styles, edit dist/index.html and dist/css/styles.css.
For folder names or images, edit src/folder-entry.jsx, rebuild locally with npm run build:folders after installing the package.json dependencies, then upload BOTH the updated source and generated dist files.
Each push to main starts a new publication. Keep all asset subfolders intact.

## Preview locally

With Node.js available, double-click Start preview.cmd, or run node server.mjs and open its printed address. Do not open index.html directly: the animation modules need an HTTP server.

## Current limitations

- Email delivery is not connected. Both forms need the user's verified Formspree endpoint.
- Only Kopp has supplied project images. Other folders still contain sample text and a missing sample pier image reference; these need real project content.
- The later proposed personal brand kit has not been created or applied to the site. Existing page metadata still uses the earlier name spelling.

## Contents and exclusions

dist: finished website, images, fonts, styles and bundled animations.
src: editable folder and lanyard source, including bundled vendor inputs.
scripts: local verification scripts.
reference: original supplied lanyard component.
.github: GitHub Pages publication workflow.
node_modules, local hosting state and temporary screenshots are deliberately excluded.

Official documentation:
https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

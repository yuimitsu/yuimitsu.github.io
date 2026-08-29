# YUIMITSU Landing Site

Static bilingual landing page for YUIMITSU, built with plain HTML, CSS, and JavaScript.

## Project Structure

- index.html: Main page and runtime rendering logic
- styles.css: Site styles
- contents-jp.json: Japanese locale content (active)
- contents-en.json: English locale content (active)
- images/: Site images
- images/backgrounds/: Section background images
- images/Gallery/: Dynamic gallery source folders
- images/Gallery/albums.json: Generated gallery manifest
- scripts/generate-gallery-manifest.js: Gallery manifest generator
- scripts/check-locale-sync.js: Legacy schema sync checker for archive/config.ja.json and archive/config.en.json

## Local Preview

Use any static server. Example:

```bash
npx serve .
```

Then open the local URL shown in terminal.

## Content Management

### Primary content files

The live site currently loads:

- contents-jp.json
- contents-en.json

Update both files when editing labels, section content, headings, and form text.

### Recommended content workflow

1. Edit Japanese and English files together.
2. Keep section keys aligned across languages.
3. Validate JSON syntax before commit.

Quick JSON validation:

```bash
node -e "JSON.parse(require('fs').readFileSync('contents-jp.json','utf8')); JSON.parse(require('fs').readFileSync('contents-en.json','utf8')); console.log('contents JSON ok')"
```

### Legacy config files

Legacy config files are archived at archive/config.ja.json, archive/config.en.json, and archive/config.json. Runtime rendering is based on contents-jp.json and contents-en.json.

If you still use the legacy sync script:

```bash
node scripts/check-locale-sync.js
```

## Gallery: How To Refresh Images

The gallery is dynamic and reads album folders under images/Gallery.

### Add or update gallery images

1. Add images into the appropriate folder under images/Gallery.
2. To create a new album, create a new folder under images/Gallery and place images inside.
3. Run manifest generation:

```bash
node scripts/generate-gallery-manifest.js
```

4. Confirm images/Gallery/albums.json updated.
5. Commit image changes plus updated albums.json.

Notes:

- No hardcoded album names are required anymore.
- Every subfolder inside images/Gallery becomes an album name automatically.
- Supported image extensions: .jpg, .jpeg, .png, .webp, .gif.

## Updating Background Images

Background assets are organized in images/backgrounds.

If replacing backgrounds:

1. Put the new image in images/backgrounds.
2. Update the related CSS rule in styles.css.
3. Hard refresh browser to avoid cache artifacts.

## Deploying To Render.com

This is a static site deployment.

### One-time setup

1. Push repository to GitHub.
2. In Render, click New > Static Site.
3. Connect the GitHub repository.
4. Configure:
   - Build Command: leave empty
   - Publish Directory: .
5. Click Create Static Site.

### Auto deploy behavior

- Each push to the selected branch triggers a deploy.
- Gallery updates deploy when both images and images/Gallery/albums.json are committed.

### Optional: clean deploy checks before push

```bash
node scripts/generate-gallery-manifest.js
node -e "JSON.parse(require('fs').readFileSync('contents-jp.json','utf8')); JSON.parse(require('fs').readFileSync('contents-en.json','utf8')); console.log('contents JSON ok')"
```

## Troubleshooting

- Gallery not updating:
  - Ensure new images are inside a subfolder under images/Gallery.
  - Regenerate albums.json.
  - Commit both images and manifest.
- Section text not changing:
  - Confirm edits were made in contents-jp.json or contents-en.json (not only legacy config files).
- Map not loading in Service Area:
  - Verify internet access for Leaflet/OpenStreetMap CDN resources.

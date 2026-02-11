# Sedrak.Heghine.Wedding

Wedding invitation website for Sedrak & Heghine.

## Free hosting on GitHub Pages (UI only)

This repository is configured with a GitHub Actions workflow that builds the site with Vite and deploys it to GitHub Pages.

### Important (if page is empty)
If the URL opens but shows a blank page, your Pages source is likely set to **Deploy from branch**.
For this repo, set it to **GitHub Actions**:

1. Open **Settings → Pages** in GitHub.
2. Under **Build and deployment**, set **Source = GitHub Actions**.
3. Open **Actions** tab and run/verify **Deploy to GitHub Pages**.

Expected public URL:

- `https://sedrak-hegine.github.io/Sedrak.Heghine.Wedding/`

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

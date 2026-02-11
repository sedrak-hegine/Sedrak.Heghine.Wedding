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

### Important (if deployment is queued for a long time)
If deployment is stuck in **Queued** for many minutes:

1. Open **Actions** and cancel older/duplicate runs for this workflow.
2. Open **Settings → Actions → General** and ensure Actions are enabled.
3. Open **Settings → Pages** and ensure source is **GitHub Actions**.
4. Re-run the latest workflow from **Actions**.

This repo workflow now cancels old in-progress runs automatically per branch, which helps prevent queue buildup.

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

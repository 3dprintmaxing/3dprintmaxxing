# 3dprintmaxxing multilingual site

Static multilingual site with language subdirectories for English, Spanish,
Brazilian Portuguese, French, German, Italian, Japanese, Korean, and Chinese.

## Local development

```bash
pnpm install
pnpm dev
```

This serves the static files with clean URLs on http://localhost:3000
(configured via `serve.json`).

## Deployment

Deploys to Vercel as a static site. `vercel.json` sets clean URLs and the
production security headers (CSP, X-Frame-Options, etc.).

The request form still posts to the existing Formspree endpoint.

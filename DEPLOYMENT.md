# Deployment Guide — Kleegr Developer Docs

## Stack

| Component | Tool |
|-----------|------|
| Docs framework | Astro + Starlight |
| API reference renderer | Scalar (CDN, no install required) |
| Hosting | Cloudflare Pages (free) |
| Domain target | docs.kleegr.com or developers.kleegr.com |

---

## Cloudflare Pages setup

### Step 1 — Connect to Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages**
2. Click **Connect to Git**
3. Authorize GitHub and select the `kleegr/kleegr-api-docs` repository
4. Click **Begin setup**

### Step 2 — Configure build settings

| Setting | Value |
|---------|-------|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node.js version | `20` (set in Environment Variables as `NODE_VERSION = 20`) |

### Step 3 — Deploy

Click **Save and Deploy**. Cloudflare will build and deploy the site.

Your site will be live at: `https://kleegr-api-docs.pages.dev`

---

## Connect a custom domain

### docs.kleegr.com (recommended)

1. In Cloudflare Pages → your project → **Custom domains** → **Set up a custom domain**
2. Enter `docs.kleegr.com`
3. Cloudflare will add a CNAME record automatically if your domain is on Cloudflare DNS
4. If your domain DNS is elsewhere, add:
   ```
   Type: CNAME
   Name: docs
   Value: kleegr-api-docs.pages.dev
   ```

### developers.kleegr.com (alternative)

Same steps, enter `developers.kleegr.com` instead.

---

## Automatic deploys

Every push to `main` automatically triggers a new build on Cloudflare Pages.

---

## Local development

```bash
npm install
npm run dev
```

Site runs at `http://localhost:4321`

## Local build test

```bash
npm run build
npm run preview
```

---

## Adding new API specs

1. Add the OpenAPI JSON file to `public/specs/your-api.json`
2. Create `src/content/docs/api-reference/your-api.mdx`:

```mdx
---
title: Your API
description: Kleegr Your API reference.
tableOfContents: false
---

import ScalarApiRef from '../../../components/ScalarApiRef.astro';

<ScalarApiRef spec="/specs/your-api.json" title="Your API" />
```

3. Add to the sidebar in `astro.config.mjs`
4. Push to `main` — Cloudflare Pages deploys automatically

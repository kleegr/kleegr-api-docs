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
3. Authorize GitHub and select `kleegr/kleegr-api-docs`
4. Click **Begin setup**

### Step 2 — Build settings

| Setting | Value |
|---------|-------|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| NODE_VERSION env var | `20` |

### Step 3 — Deploy

Click **Save and Deploy**. Live at: `https://kleegr-api-docs.pages.dev`

---

## Connect docs.kleegr.com

1. Cloudflare Pages → project → **Custom domains** → **Set up a custom domain**
2. Enter `docs.kleegr.com`
3. If domain is on Cloudflare DNS, the CNAME is added automatically
4. Otherwise add: `CNAME docs → kleegr-api-docs.pages.dev`

---

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # builds to dist/
npm run preview    # previews dist/
```

---

## Adding new API specs

1. Add OpenAPI JSON to `public/specs/your-api.json`
2. Create `src/content/docs/api-reference/your-api.mdx` with `<ScalarApiRef spec="/specs/your-api.json" />`
3. Add to sidebar in `astro.config.mjs`
4. Push to `main` — auto-deploys

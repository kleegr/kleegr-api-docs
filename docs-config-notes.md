# Publishing the Kleegr Developer Docs

This repo is ready to publish on either **Mintlify** or **GitBook**. Follow whichever path matches your preferred platform.

---

## Option A — Mintlify (Recommended)

Mintlify renders markdown + OpenAPI specs beautifully, and the `mint.json` config file in this repo is already pre-configured for Kleegr.

### Steps

1. **Create a Mintlify account** at [https://mintlify.com](https://mintlify.com)
2. **Connect your GitHub repo:**
   - Go to your Mintlify dashboard → "New Docs"
   - Connect GitHub and select `kleegr/kleegr-api-docs`
   - Mintlify will detect `mint.json` automatically
3. **Add your logo and favicon:**
   - Upload `logo-light.png`, `logo-dark.png`, and `favicon.png` into the `/assets/` folder
   - The `mint.json` already points to these paths
4. **Set a custom domain (optional):**
   - In Mintlify dashboard → Settings → Custom Domain
   - Point `docs.kleegr.com` to the Mintlify CNAME
5. **Enable OpenAPI rendering:**
   - Mintlify auto-renders `.json` OpenAPI specs — add `apps/*.json` entries to `mint.json` navigation
6. **Deploy:**
   - Mintlify auto-deploys on every push to `main`

### Notes
- Free tier supports public docs. Paid plans add custom domains and private docs.
- Mintlify docs: [https://mintlify.com/docs](https://mintlify.com/docs)

---

## Option B — GitBook

### Steps

1. **Create a GitBook account** at [https://www.gitbook.com](https://www.gitbook.com)
2. Click "New Space" → "Import from GitHub" → select `kleegr/kleegr-api-docs`
3. Set the space name to "Kleegr Developer Docs"
4. Set brand color to `#7C3AED` (Kleegr purple) in Space Settings → Customization
5. Set a custom domain: point `docs.kleegr.com` to GitBook's CNAME
6. Set visibility to "Public" — GitBook auto-syncs on every `main` push

### Notes
- OpenAPI JSON files are not natively rendered by GitBook — for full API reference rendering, Mintlify is preferred
- GitBook docs: [https://docs.gitbook.com](https://docs.gitbook.com)

---

## Environment configuration reference

```env
KLEEGR_APP_URL=https://crm.kleegr.com
KLEEGR_WEBSITE=https://kleegr.com
KLEEGR_DOCS_SUBDOMAIN=docs.kleegr.com
```

---

## Recommended publishing path

| Criterion | Mintlify | GitBook |
|-----------|----------|---------|
| OpenAPI rendering | ✅ Native | ❌ Requires workaround |
| Markdown rendering | ✅ | ✅ |
| GitHub sync | ✅ | ✅ |
| Custom domain | ✅ Paid | ✅ Paid |
| Setup complexity | Low | Very low |
| Design quality | High | Medium |

**Recommendation: Mintlify** — the API reference (OpenAPI JSON) is the core of these docs and Mintlify renders it natively with try-it-out panels.

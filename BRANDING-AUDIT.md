# Branding Audit — Kleegr API Docs

This file documents every HighLevel / GoHighLevel reference in this repo and classifies its treatment.

---

## ✅ Rebranded for Kleegr

| File | Change |
|------|--------|
| `README.md` | Full Kleegr rebrand — product name, URLs, description |
| `package.json` | Name, description, keywords, author updated to Kleegr |
| `docs/index.md` | New Kleegr homepage ("Build with Kleegr") |
| `docs/oauth/Overview.md` | Rewritten with Kleegr context |
| `mint.json` | New file — Kleegr Mintlify config with brand colors and navigation |
| `docs-config-notes.md` | New file — Kleegr publishing guide |
| All `docs/oauth/*.md` | Kleegr context headers prepended |
| All `docs/marketplace modules/*.md` | Kleegr context headers prepended |
| `.github/` files | Rebranded community/contribution files |

---

## 🔒 Kept as HighLevel — Technical / Accuracy Required

| File | Reference | Reason |
|------|-----------|--------|
| `docs/oauth/Authorization.md` | `https://marketplace.gohighlevel.com` | OAuth app registration URL — cannot change |
| `docs/oauth/Authorization.md` | `https://marketplace.leadconnectorhq.com/oauth/chooselocation` | White-label OAuth URL — required for developers |
| `docs/oauth/Authorization.md` | `X-RateLimit-*` headers | API response headers — changing would mislead developers |
| `docs/oauth/Scopes.md` | All scope strings | Part of the API contract — must not change |
| `apps/*.json` | All endpoint paths, `operationId`, field names, schemas | API contract — must not change |
| `apps/*.json` | `highlevel.stoplight.io` and `marketplace.gohighlevel.com` URLs | External docs links required for accuracy |
| `docs/oauth/ExternalAuthentication.md` | HighLevel SSO references | SSO requires knowing the actual platform identity |
| `docs/marketplace modules/ConversationProviders.md` | LeadConnector / HighLevel provider names | Platform-specific identifiers for provider registration |

---

## ⚠️ Needs Disclaimer / Context

| File | Reference | Treatment |
|------|-----------|----------|
| All `docs/oauth/*.md` | HighLevel Marketplace, HighLevel APIs | `> Kleegr context:` callout at top of each file |
| `docs/index.md` | HighLevel APIs mention | Explicit note: "Kleegr integrations are powered by HighLevel APIs" |
| `README.md` | HighLevel repo credit | Attribution footer |
| `LICENSE` | CC0 1.0 Universal | Preserved verbatim — no changes |

---

## 📋 Summary

- **Rebranded:** All UI-layer, navigational, and explanatory text
- **Preserved:** All API endpoint paths, OAuth URLs, scope strings, field names, schema definitions, and OpenAPI specs
- **Disclaimed:** All mixed-context files include a `> Kleegr context:` note
- **License:** CC0 1.0 — public domain, reuse is unrestricted

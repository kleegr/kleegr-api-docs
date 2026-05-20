# Kleegr Developer Docs

> **Kleegr developer documentation for integrations powered by HighLevel APIs.**

Welcome to the official developer documentation repository for **Kleegr**. Use these docs to build integrations, automate workflows, and connect external systems with Kleegr-powered CRM accounts.

- 🌐 **Main website:** [https://kleegr.com](https://kleegr.com)
- 🔐 **CRM login:** [https://crm.kleegr.com](https://crm.kleegr.com)

---

## 📚 What's in this repo

- **OAuth 2.0 guides** — authorization flows, scopes, token management, webhook authentication
- **API reference** — OpenAPI/JSON specs for all supported endpoints (contacts, conversations, calendars, invoices, payments, and more)
- **Webhook event docs** — payload schemas for every webhook event
- **Marketplace module guides** — custom JS, conversation providers, shared-secret authentication
- **Country list reference** — accepted values for country fields

---

## 🗂 Repo structure

```
kleegr-api-docs/
├── README.md                  # This file
├── docs-config-notes.md       # How to publish to GitBook or Mintlify
├── mint.json                  # Mintlify configuration
├── docs/
│   ├── index.md               # Homepage / "Build with Kleegr"
│   ├── oauth/                 # OAuth 2.0 guides
│   ├── webhook events/        # Webhook event payload docs
│   ├── marketplace modules/   # Marketplace/JS module docs
│   └── country list/          # Country field reference
├── apps/                      # OpenAPI 3.0 specs per API domain
├── common/                    # Shared schemas
├── models/                    # Footer and shared model definitions
├── assets/                    # Images and static assets
├── toc.json                   # Table of contents / navigation
├── package.json
└── LICENSE
```

---

## 🔌 Integration note

Kleegr's CRM and automation platform is powered by HighLevel APIs. Some technical references to HighLevel remain in this documentation where they are required for API accuracy — including endpoint URLs, OAuth scopes, marketplace app registration, and rate limit headers. These references are intentional and necessary for correct integration.

---

## 🚀 Publishing

See [`docs-config-notes.md`](./docs-config-notes.md) for step-by-step instructions on publishing this repo to **Mintlify** or **GitBook**.

---

## 📬 Support

For Kleegr integration support, visit [https://kleegr.com](https://kleegr.com).

---

*This repository is based on the [GoHighLevel API V2 documentation](https://github.com/GoHighLevel/highlevel-api-docs), released under CC0 1.0 Universal. See [`LICENSE`](./LICENSE) for details.*

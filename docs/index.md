# Build with Kleegr

Welcome to the **Kleegr Developer Docs**.

Use these docs to build integrations, automate workflows, and connect external systems with Kleegr-powered CRM accounts.

| | |
|---|---|
| 🌐 **Kleegr website** | [https://kleegr.com](https://kleegr.com) |
| 🔐 **CRM login** | [https://crm.kleegr.com](https://crm.kleegr.com) |

---

## What you can build

- **CRM integrations** — sync contacts, conversations, opportunities, and pipelines with external systems
- **Workflow automations** — trigger and respond to CRM events via webhooks
- **Marketplace apps** — build and install apps inside Kleegr-powered accounts
- **Payment & invoicing** — automate billing workflows using the Payments and Invoices APIs
- **Calendar & scheduling** — integrate appointment booking into your own products
- **Custom UI extensions** — embed custom pages and JavaScript inside the CRM interface

---

## Quick start

1. [Register an OAuth app](./oauth/Authorization.md) in the HighLevel Marketplace
2. Authorize a Kleegr sub-account (location) via OAuth 2.0
3. Use the access token to call any of the API endpoints documented here
4. Set up [webhook events](./webhook%20events/) to receive real-time notifications

---

## API reference by domain

| Domain | Description |
|--------|-------------|
| Contacts | Create, update, search, and tag contacts |
| Conversations | Send/receive messages across SMS, email, and more |
| Calendars | Manage calendars, slots, and appointments |
| Opportunities | Track pipeline stages and deal values |
| Invoices & Payments | Create and track invoices, process payments |
| Workflows | Trigger and manage automation workflows |
| Users | Manage CRM users and permissions |
| Locations (Sub-accounts) | Manage sub-account settings |
| Forms & Surveys | Retrieve form submissions and survey responses |
| Social Planner | Schedule and manage social posts |
| Blogs, Funnels, Courses | Content and membership management |
| Snapshots | Account configuration snapshots |

---

> **Note:** Kleegr integrations are powered by HighLevel APIs. Some technical references to HighLevel may appear in this documentation where required for API accuracy — including OAuth endpoints, marketplace registration URLs, and scope names.

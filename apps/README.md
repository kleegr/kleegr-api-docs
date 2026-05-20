# OpenAPI Specs

This directory contains OpenAPI 3.0 JSON specifications for all Kleegr CRM API domains.

> **Note:** These specs are the technical API contract for integrations powered by HighLevel APIs. They are preserved verbatim — do not modify endpoint paths, field names, or schema definitions.

## Available specs

| File | Domain |
|------|--------|
| `ad-manager.json` | Ad Manager |
| `affiliate-manager.json` | Affiliate Manager |
| `agent-studio.json` | Agent Studio |
| `associations.json` | Associations |
| `blogs.json` | Blogs |
| `brand-boards.json` | Brand Boards |
| `businesses.json` | Businesses |
| `calendars.json` | Calendars |
| `campaigns.json` | Campaigns |
| `companies.json` | Companies |
| `contacts.json` | Contacts |
| `conversation-ai.json` | Conversation AI |
| `conversations.json` | Conversations |
| `courses.json` | Courses |
| `custom-fields.json` | Custom Fields V2 |
| `custom-menus.json` | Custom Menus |
| `email-isv.json` | LC Email |
| `emails.json` | Emails |
| `forms.json` | Forms |
| `funnels.json` | Funnels |
| `invoices.json` | Invoices |
| `knowledge-base.json` | Knowledge Base |
| `links.json` | Trigger Links |
| `locations.json` | Sub-Accounts (Locations) |
| `marketplace.json` | Marketplace |
| `medias.json` | Media Library |
| `oauth.json` | OAuth 2.0 |
| `objects.json` | Custom Objects |
| `opportunities.json` | Opportunities |
| `payments.json` | Payments |
| `phone-system.json` | Phone System |
| `products.json` | Products |
| `proposals.json` | Proposals |
| `saas-api.json` | SaaS API |
| `snapshots.json` | Snapshots |
| `social-media-posting.json` | Social Planner |
| `store.json` | Store |
| `surveys.json` | Surveys |
| `users.json` | Users |
| `voice-ai.json` | Voice AI |
| `workflows.json` | Workflows |

## Publishing with Mintlify

To render these as interactive API reference pages in Mintlify, add entries to `mint.json`:

```json
{
  "group": "API Reference",
  "pages": [
    "apps/contacts",
    "apps/conversations",
    "apps/calendars",
    "apps/opportunities",
    "apps/invoices",
    "apps/payments",
    "apps/users",
    "apps/workflows"
  ]
}
```

Mintlify strips the `.json` extension automatically.

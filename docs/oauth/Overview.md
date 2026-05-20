# OAuth 2.0 Overview

> This section covers OAuth 2.0 authentication for Kleegr integrations. Kleegr's CRM platform is powered by HighLevel APIs. OAuth app registration happens in the HighLevel Marketplace using your developer account.

Kleegr uses the **OAuth 2.0 Authorization Code Grant** flow to allow third-party apps to access CRM data on behalf of a location (sub-account) or agency.

## High-level flow

1. Register an app in the [HighLevel Marketplace](https://marketplace.gohighlevel.com)
2. Generate an Authorization URL for your app and redirect the user
3. The user selects their Kleegr CRM location and grants permission
4. You receive an authorization code → exchange it for an access token
5. Use the access token to call any Kleegr (HighLevel) API

## Navigation

| Page | Description |
|------|-------------|
| [Authorization](./Authorization.md) | Step-by-step OAuth flow walkthrough |
| [Scopes](./Scopes.md) | Full list of available OAuth permission scopes |
| [Billing](./Billing.md) | External billing via OAuth |
| [External Authentication](./ExternalAuthentication.md) | SSO and external auth flows |
| [Webhook Authentication](./WebhookAuthentication.md) | Authenticating inbound webhooks |
| [FAQs](./Faqs.md) | Common OAuth questions |

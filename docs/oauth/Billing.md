---
description: External billing integration for Kleegr-powered accounts.
---

> **Kleegr context:** This guide covers how to integrate external billing into a Kleegr CRM sub-account using OAuth.

# Billing Webhook

This webhook is required for externally billed marketplace apps. After the user installs and pays, you confirm payment by calling the billing webhook endpoint.

## Prerequisites

Before using this webhook, ensure in the [Marketplace](https://marketplace.gohighlevel.com):

1. Your app has a Business Model set to **Paid**
2. **External Billing** is enabled
3. A **Billing URL** is configured

## Parameters received at your Billing URL

| Parameter | Values | Notes |
|-----------|--------|-------|
| `clientId` | `<client_id>` | For validation |
| `installType` | `location`, `agency` | Both: `agency,location` |
| `locationId` | `<location_id>` | Present for location/both |
| `companyId` | `<agency_id>` | Present for agency/both |

## Billing webhook endpoint

```
POST https://services.leadconnectorhq.com/oauth/billing/webhook
```

**Headers:**

| Header | Value |
|--------|-------|
| `x-ghl-client-key` | Your client key |
| `x-ghl-client-secret` | Your client secret |
| `Content-Type` | `application/json` |

**Body parameters:**

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `clientId` | string | yes | |
| `authType` | `company` \| `location` | yes | |
| `locationId` | string | if location | |
| `companyId` | string | if company | |
| `subscriptionId` | string | no | |
| `paymentId` | string | no | For one-time payments |
| `amount` | number | yes | |
| `status` | `COMPLETED` \| `FAILED` | yes | |
| `paymentType` | `one_time` \| `recurring` | yes | |

**Example:**

```shell
curl --location 'https://services.leadconnectorhq.com/oauth/billing/webhook' \
--header 'x-ghl-client-key: <client_key>' \
--header 'x-ghl-client-secret: <client_secret>' \
--header 'Content-Type: application/json' \
--data '{
    "clientId": "<client_id>",
    "authType": "location",
    "locationId": "<location_id>",
    "amount": 12,
    "status": "COMPLETED",
    "paymentType": "recurring"
}'
```

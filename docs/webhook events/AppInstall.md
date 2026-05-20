---
tags: [Webhook Events]
---

# AppInstall

Called whenever an app is installed on a Kleegr CRM location or agency.

#### Schema

```json json_schema
{
  "type": "object",
  "properties": {
    "type": { "type": "string" },
    "appId": { "type": "string" },
    "companyId": { "type": "string" },
    "locationId": { "type": "string" },
    "userId": { "type": "string" },
    "planId": { "type": "string" },
    "trial": {
      "type": "object",
      "properties": {
        "onTrial": { "type": "boolean" },
        "trialDuration": { "type": "number" },
        "trialStartDate": { "type": "string" }
      }
    },
    "isWhitelabelCompany": { "type": "boolean" },
    "whitelabelDetails": {
      "type": "object",
      "properties": {
        "domain": { "type": "string" },
        "logoUrl": { "type": "string" }
      }
    },
    "companyName": { "type": "string" }
  }
}
```

#### Example

```json
{
  "type": "INSTALL",
  "appId": "ve9EPM428h8vShlRW1KT",
  "locationId": "otg8dTQqGLh3Q6iQI55w",
  "companyId": "otg8dTQqGLh3Q6iQI55w",
  "userId": "otg8dTQqGLh3Q6iQI55w",
  "planId": "66a0419a0dffa47fb5f8b22f",
  "trial": { "onTrial": true, "trialDuration": 10, "trialStartDate": "2024-07-23T23:54:51.264Z" },
  "isWhitelabelCompany": true,
  "whitelabelDetails": { "domain": "example.com", "logoUrl": "https://example.com/logo.png" },
  "companyName": "Example Company"
}
```

---
tags: [Webhook Events]
---

# AppUninstall

Called whenever an app is uninstalled from a Kleegr CRM location or agency.

#### Schema

```json json_schema
{
  "type": "object",
  "properties": {
    "type": { "type": "string" },
    "appId": { "type": "string" },
    "companyId": { "type": "string" },
    "locationId": { "type": "string" }
  }
}
```

#### Example

```json
{
  "type": "UNINSTALL",
  "appId": "ve9EPM428h8vShlRW1KT",
  "locationId": "otg8dTQqGLh3Q6iQI55w"
}
```

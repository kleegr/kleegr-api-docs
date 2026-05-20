---
tags: [Webhook Events]
---

# ContactDndUpdate

Called whenever a contact's Do Not Disturb (DND) settings are updated.

#### Example

```json
{
  "type": "ContactDndUpdate",
  "locationId": "ve9EPM428h8vShlRW1KT",
  "id": "nmFmQEsNgz6AVpgLVUJ0",
  "dnd": true,
  "dndSettings": {
    "SMS": {"status": "inactive"},
    "Email": {"status": "active"},
    "Call": {"status": "inactive"},
    "WhatsApp": {"status": "active"}
  }
}
```

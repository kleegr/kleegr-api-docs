---
tags: [Webhook Events]
---

# LCEmailStats

Called whenever an email is sent, providing delivery statistics. Available to Location Level Apps only.

#### Example

```json
{
  "type": "LCEmailStats",
  "locationId": "ve9EPM428h8vShlRW1KT",
  "companyId": "ve9EPM428h8vShlRW1KT",
  "webhookPayload": {
    "event": "delivered",
    "recipient": "test@example.com",
    "timestamp": 1714032441,
    "delivery-status": {
      "code": 250,
      "message": "OK",
      "attempt-no": 1
    }
  }
}
```

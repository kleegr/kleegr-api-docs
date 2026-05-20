---
tags: [Webhook Events]
---

# PriceCreate

Called whenever a price is created for a product.

#### Example

```json
{
  "type": "PriceCreate",
  "locationId": "ve9EPM428h8vShlRW1KT",
  "id": "price_abc123",
  "productId": "prod_abc123",
  "amount": 4900,
  "currency": "USD",
  "type": "recurring",
  "interval": "month"
}
```

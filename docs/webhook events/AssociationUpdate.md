---
tags: [Webhook Response]
---

# Association Updated

Triggered when an association between objects is updated.

#### Example

```json
{
  "id": "67ade73d1119d2ac7ad0c475",
  "associationType": "USER_DEFINED",
  "firstObjectKey": "custom_objects.real_estate_buyer",
  "firstObjectLabel": "Interested Buyer",
  "firstObjectToSecondObjectCardinality": "MANY_TO_MANY",
  "secondObjectKey": "custom_objects.property",
  "secondObjectLabel": "Property",
  "secondObjectToFirstObjectCardinality": "MANY_TO_MANY",
  "key": "buyer_property_interest",
  "locationId": "eHy2cOSZxMQzQ6Yyvl8P"
}
```

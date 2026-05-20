---
tags: [Webhook Events]
---

# Conversation Provider — Outbound Message

Called whenever a user sends a message through a custom conversation provider set as the default channel.

#### Example (SMS)

```json
{
  "contactId": "GKBhT6BfwY9mjzXAU3sq",
  "locationId": "GKAWb4yu7A4LSc0skQ6g",
  "messageId": "GKJxs4P5L8dWc5CFUITM",
  "type": "SMS",
  "phone": "+15864603685",
  "message": "The text message to send",
  "attachments": ["https://example.com/image.png"],
  "userId": "GK56r6wdJDrkUPd0xsmx"
}
```

#### Example (Email)

```json
{
  "contactId": "GKKFF0QB9gV8fGA6zEbr",
  "locationId": "GKifVDyQeo7nwe27vMP0",
  "messageId": "GK56r6wdJDrkUPd0xsmx",
  "type": "Email",
  "emailTo": ["abc@example.com"],
  "emailFrom": "From Name <email@example.com>",
  "html": "<p>Email body here</p>",
  "subject": "Subject"
}
```

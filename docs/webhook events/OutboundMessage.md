---
tags: [Webhook Events]
---

# OutboundMessage

Called whenever a user sends a message to a contact. Supported channels: SMS, Email, Call, Voicemail, GMB, FB, IG, Live Chat.

#### Example (SMS)

```json
{
  "type": "OutboundMessage",
  "locationId": "l1C08ntBrFjLS0elLIYU",
  "attachments": [],
  "body": "This is a test message",
  "contactId": "cI08i1Bls3iTB9bKgFJh",
  "conversationId": "fcanlLgpbQgQhderivVs",
  "dateAdded": "2021-04-21T11:31:45.750Z",
  "direction": "outbound",
  "messageType": "SMS",
  "source": "app",
  "status": "delivered"
}
```

#### Example (Call)

```json
{
  "type": "OutboundMessage",
  "locationId": "0d48aEf7q67DAu134bpy",
  "contactId": "gblakL5aYQC4glDtP1r2t3",
  "direction": "outbound",
  "messageType": "CALL",
  "status": "completed",
  "callDuration": 120,
  "callStatus": "completed"
}
```

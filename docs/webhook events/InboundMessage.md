---
tags: [Webhook Events]
---

# InboundMessage

Called whenever a contact sends a message. Supported channels: SMS, Email, Call, Voicemail, GMB, FB, IG, Live Chat.

#### Example (SMS)

```json
{
  "type": "InboundMessage",
  "locationId": "l1C08ntBrFjLS0elLIYU",
  "attachments": [],
  "body": "This is a test message",
  "contactId": "cI08i1Bls3iTB9bKgFJh",
  "contentType": "text/plain",
  "conversationId": "fcanlLgpbQgQhderivVs",
  "dateAdded": "2021-04-21T11:31:45.750Z",
  "direction": "inbound",
  "messageType": "SMS",
  "status": "delivered"
}
```

#### Example (Call)

```json
{
  "type": "InboundMessage",
  "locationId": "0d48aEf7q67DAu134bpy",
  "contactId": "gblakL5aYQC4glDtP1r2t3",
  "conversationId": "SGDqZrzmwTr19d10aHkt9F",
  "dateAdded": "2024-05-08T11:57:42.250Z",
  "direction": "inbound",
  "messageType": "CALL",
  "messageId": "tyW42xCD0HQpb3hhfLcx",
  "status": "completed",
  "callDuration": 120,
  "callStatus": "completed"
}
```

#### Example (Voicemail)

```json
{
  "type": "InboundMessage",
  "locationId": "0dalah57827q67DAuXUxbpy",
  "attachments": ["voicemail url"],
  "contactId": "gb7laj5aYQC4glDtP1r5",
  "direction": "inbound",
  "messageType": "CALL",
  "status": "voicemail"
}
```

---
description: Validate inbound webhooks from Kleegr CRM.
---

> **Kleegr context:** Use the methods below to verify that inbound webhook events originate from your Kleegr CRM integration.

# Webhook Authentication Guide

## How It Works

### 1. Receiving the Webhook

Your endpoint receives a request with:

- **Header:** `x-wh-signature` — the digital signature of the payload
- **Body:** JSON payload containing `timestamp`, `webhookId`, and event data

### 2. Verifying the Signature

1. Retrieve `x-wh-signature` from the request headers
2. Use the public key below to verify the signature against the payload
3. Compare your computed signature with the header value — if they match, the payload is trusted

```
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAokvo/r9tVgcfZ5DysOSC
Frm602qYV0MaAiNnX9O8KxMbiyRKWeL9JpCpVpt4XHIcBOK4u3cLSqJGOLaPuXw6
dO0t6Q/ZVdAV5Phz+ZtzPL16iCGeK9po6D6JHBpbi989mmzMryUnQJezlYJ3DVfB
csedpinheNnyYeFXolrJvcsjDtfAeRx5ByHQmTnSdFUzuAnC9/GepgLT9SM4nCpv
uxmZMxrJt5Rw+VUaQ9B8JSvbMPpez4peKaJPZHBbU3OdeCVx5klVXXZQGNHOs8gF
3kvoV5rTnXV0IknLBXlcKKAQLZcY/Q9rG6Ifi9c+5vqlvHPCUJFT5XUGG5RKgOKU
J062fRtN+rLYZUV+BjafxQauvC8wSWeYja63VSUruvmNj8xkx2zE/Juc+yjLjTXp
IocmaiFeAO6fUtNjDeFVkhf5LNb59vECyrHD2SQIrhgXpO4Q3dVNA5rw576PwTzN
h/AMfHKIjE4xQA1SZuYJmNnmVZLIZBlQAF9Ntd03rfadZ+yDiOXCCs9FkHibELhC
HULgCsnuDJHcrGNd5/Ddm5hxGQ0ASitgHeMZ0kcIOwKDOzOU53lDza6/Y09T7sYJ
PQe7z0cvj7aE4B+Ax1ZoZGPzpJlZtGXCsu9aTEGEnKzmsFqwcSsnw3JB31IGKAyk
T1hhTiaCeIY/OwwwNUY2yvcCAwEAAQ==
-----END PUBLIC KEY-----
```

### 3. Handling Replay Attacks

- Reject requests with a `timestamp` outside a 5-minute window
- Track and reject duplicate `webhookId` values

## Example (Node.js)

```js
const crypto = require('crypto');

const publicKey = `<use_the_above_key>`;

function verifySignature(payload, signature) {
  const verifier = crypto.createVerify('SHA256');
  verifier.update(payload);
  verifier.end();
  return verifier.verify(publicKey, signature, 'base64');
}

const isValid = verifySignature(JSON.stringify(payload), receivedSignature);
```

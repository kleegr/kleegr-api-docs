---
description: Set up OAuth 2.0 for your Kleegr CRM integration.
---

> **Kleegr context:** This guide covers how to authorize your app to access a Kleegr CRM account (powered by HighLevel). App registration takes place in the HighLevel Marketplace developer portal.

# Authorization

HighLevel supports the Authorization Code Grant flow with v2 APIs. Please find the step-by-step procedure to use and understand the OAuth 2.0 flow.

Here's a [Loom Video](https://www.loom.com/share/f32384758de74a4dbb647e0b7962c4ea?sid=0907a66d-a160-4b51-bcd4-c47ebae37fca) to walk you through the entire process.

### 1. Register an OAuth app

1. Go to the [Marketplace](https://marketplace.gohighlevel.com)
2. Sign up for a developer account.
3. Go to "My Apps," and click on "Create App."
4. Fill up the required details in the form, then your app will be created.
5. Click on the app, and it will take you to settings where you can configure the scopes, generate the keys, etc.

### 2. Add the app to your desired location

1. Make the location/agency Admin go to the app's Authorization Page URL.
2. They select the location they want to connect.
3. They are redirected to the redirect URL with the Authorization Code.
4. Use the Authorization Code to get the Access token via the Get Access Token API under OAuth 2.0.
5. Use the Access Token to call any API.

### 3. Get the app's Authorization Page URL

To generate the Authorization Page URL for an app, replace the `client_id`, `redirect_uri`, and `scope` in the template below.

1. Standard Auth URL:

```
https://marketplace.gohighlevel.com/oauth/chooselocation?
response_type=code&
redirect_uri=https://myapp.com/oauth/callback/gohighlevel&
client_id=CLIENT_ID&
scope=conversations/message.readonly conversations/message.write
```

2. White-labeled Auth URL:

```
https://marketplace.leadconnectorhq.com/oauth/chooselocation?
response_type=code&
redirect_uri=https://myapp.com/oauth/callback/gohighlevel&
client_id=CLIENT_ID&
scope=conversations/message.readonly conversations/message.write
```

**NOTE:** To initiate login in the same tab, append `&loginWindowOpenMode=self` to the authorization URL.

## Rate limits

- **Burst limit:** 100 requests per 10 seconds per app per location/company
- **Daily limit:** 200,000 requests per day per app per location/company

Rate limit response headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit-Daily` | Your daily limit |
| `X-RateLimit-Daily-Remaining` | Remaining requests today |
| `X-RateLimit-Interval-Milliseconds` | Burst interval |
| `X-RateLimit-Max` | Max requests in burst interval |
| `X-RateLimit-Remaining` | Remaining in current interval |

## Token lifecycle

- **Access tokens** expire after 24 hours — refresh using the refresh token
- **Refresh tokens** are valid for 1 year and reset on each use
- On expiry: retry the request → if 401, refresh the token → retry with new token

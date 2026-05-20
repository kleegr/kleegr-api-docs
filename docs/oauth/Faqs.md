> These FAQs cover common questions about OAuth 2.0 for Kleegr CRM integrations.

# FAQs

Here you will find answers to commonly encountered questions.

### How do I listen to webhook events?

1. Register an app in the Marketplace
2. In app settings, set your webhook URL and add the required scopes
3. Have a location/agency admin install the app and authorize it
4. Use the authorization code to get an access token
5. Webhook events for that location will now be delivered to your URL

### How long are access tokens valid?

Access tokens are valid for 24 hours. Use the refresh token to get a new one.

### How long are refresh tokens valid?

Refresh tokens are valid for 1 year and reset each time they are used.

### How should I handle token expiry?

1. Make a request with the current access token
2. If you receive a 401 (token expired), call the refresh endpoint
3. Save the new access and refresh tokens
4. Retry the original request

# OAuth2 Configuration

This API uses OAuth2 for authentication. The MCP server can handle OAuth2 authentication in the following ways:

1. **Using a pre-acquired token**: You provide a token you've already obtained
2. **Using client credentials flow**: The server automatically acquires a token using your client ID and secret

## Environment Variables

### oauth2

Send the authenticating user to the PandaDoc OAuth2 request URL. We recommend a button or a link titled
"Connect to PandaDoc" if you are connecting users from a custom application. Users will see the "Authorize Application" screen.
When the user clicks "Authorize", PandaDoc redirects the user back to your site with an authorization code inside the URL.

https://app.pandadoc.com/oauth2/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=read+write&response_type=code

`client_id` and `redirect_uri` values should match your application settings.


**Configuration Variables:**

- `OAUTH_CLIENT_ID_OAUTH2`: Your OAuth client ID
- `OAUTH_CLIENT_SECRET_OAUTH2`: Your OAuth client secret
- `OAUTH_TOKEN_OAUTH2`: Pre-acquired OAuth token (required for authorization code flow)

**Authorization Code Flow:**

- Authorization URL: `https://app.pandadoc.com/oauth2/authorize`
- Token URL: `https://api.pandadoc.com/oauth2/access_token`

**Available Scopes:**

- `read+write`: Use `read+write` to create, send, delete, and download documents, and `read` to view templates and document details.

## Token Caching

The MCP server automatically caches OAuth tokens obtained via client credentials flow. Tokens are cached for their lifetime (as specified by the `expires_in` parameter in the token response) minus 60 seconds as a safety margin.

When making API requests, the server will:
1. Check for a cached token that's still valid
2. Use the cached token if available
3. Request a new token if no valid cached token exists

export interface OAuthProvider {
  name: string
  clientId: string
  authUrl: string
  scope: string
  redirectUri: string
}

// Get the current origin, defaulting to localhost for development
const getRedirectUri = (provider: string) => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback/${provider}`
  }
  // Default to localhost for development
  return `http://localhost:3000/auth/callback/${provider}`
}

// You'll need to replace these with your actual client IDs
export const oauthProviders: Record<string, OAuthProvider> = {
  google: {
    name: "Google",
    clientId: "1093179039078-64o3n19idlmh5mkrh61mo4ihsjpm9pdh.apps.googleusercontent.com", // Replace with your actual client ID
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.readonly",
    redirectUri: getRedirectUri("google"),
  },
  microsoft: {
    name: "Microsoft",
    clientId: "YOUR_MICROSOFT_CLIENT_ID", // Replace with your actual client ID
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    scope: "https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Files.Read.All",
    redirectUri: getRedirectUri("microsoft"),
  },
  yahoo: {
    name: "Yahoo",
    clientId: "YOUR_YAHOO_CLIENT_ID", // Replace with your actual client ID
    authUrl: "https://api.login.yahoo.com/oauth2/request_auth",
    scope: "mail-r",
    redirectUri: getRedirectUri("yahoo"),
  },
}

export function generateOAuthUrl(provider: string): string {
  const config = oauthProviders[provider]
  if (!config) {
    throw new Error(`Unknown OAuth provider: ${provider}`)
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: "code",
    access_type: "offline", // For Google to get refresh token
    prompt: "consent", // Force consent screen
    state: generateState(provider), // CSRF protection
  })

  return `${config.authUrl}?${params.toString()}`
}

function generateState(provider: string): string {
  const state = {
    provider,
    timestamp: Date.now(),
    random: Math.random().toString(36).substring(2),
  }
  return btoa(JSON.stringify(state))
}

export function parseState(state: string): { provider: string; timestamp: number; random: string } | null {
  try {
    return JSON.parse(atob(state))
  } catch {
    return null
  }
}

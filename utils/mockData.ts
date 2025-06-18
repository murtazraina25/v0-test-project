import type { DataSource, ConnectedSource, DocumentType } from "../types/connector"

export const availableDataSources: DataSource[] = [
  {
    id: "gmail",
    name: "Gmail",
    type: "email",
    provider: "gmail",
    icon: "📧",
    requiresOAuth: true,
    status: "disconnected",
  },
  {
    id: "outlook",
    name: "Outlook",
    type: "email",
    provider: "outlook",
    icon: "📮",
    requiresOAuth: true,
    status: "disconnected",
  },
  {
    id: "yahoo",
    name: "Yahoo Mail",
    type: "email",
    provider: "yahoo",
    icon: "📬",
    requiresOAuth: true,
    status: "disconnected",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    type: "cloud",
    provider: "google-drive",
    icon: "💾",
    requiresOAuth: true,
    status: "disconnected",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    type: "cloud",
    provider: "onedrive",
    icon: "☁️",
    requiresOAuth: true,
    status: "disconnected",
  },
  {
    id: "custom-email",
    name: "Custom Email (IMAP)",
    type: "email",
    provider: "custom-email",
    icon: "✉️",
    requiresOAuth: false,
    status: "disconnected",
  },
]

export const documentTypes: DocumentType[] = [
  { id: "invoice", name: "Invoice", enabled: true },
  { id: "po", name: "Purchase Order", enabled: true },
  { id: "delivery-challan", name: "Delivery Challan", enabled: false },
]

export const mockConnectedSources: ConnectedSource[] = [
  {
    id: "gmail-connected",
    name: "Gmail",
    type: "email",
    provider: "gmail",
    icon: "📧",
    requiresOAuth: true,
    status: "connected",
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    email: "user@gmail.com",
    syncConfig: {
      interval: "12h",
      documentTypes: documentTypes.filter((dt) => dt.enabled),
    },
  },
]

// Mock API functions
export const mockAPI = {
  connectOAuth: async (provider: string): Promise<{ success: boolean; redirectUrl?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      redirectUrl: `https://oauth.${provider}.com/authorize?client_id=mock&redirect_uri=callback`,
    }
  },

  connectIMAP: async (config: any): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Simulate validation
    if (!config.email || !config.password) {
      return { success: false, error: "Email and password are required" }
    }
    return { success: true }
  },

  updateSyncConfig: async (sourceId: string, config: any): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { success: true }
  },

  disconnect: async (sourceId: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { success: true }
  },
}

export const getEmailDomain = (email: string): string => {
  return email.split("@")[1]?.toLowerCase() || ""
}

export const isOAuthProvider = (domain: string): boolean => {
  const oauthDomains = ["gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "yahoo.com"]
  return oauthDomains.includes(domain)
}

export interface ConnectedAccount {
  id: string
  providerId: string // gmail, outlook, google-drive, etc.
  providerName: string
  accountName: string // email address or account identifier
  accountType: "email" | "cloud"
  status: "connected" | "error" | "syncing"
  lastSync?: Date
  syncConfig: AccountSyncConfig
}

export interface AccountSyncConfig {
  enabled: boolean
  syncInterval: "15m" | "30m" | "1h" | "6h" | "12h" | "24h"
  folders?: FolderConfig[] // for email accounts
  directories?: DirectoryConfig[] // for cloud storage
  documentTypes: DocumentType[]
}

export interface FolderConfig {
  id: string
  name: string
  path: string
  enabled: boolean
  lastSync?: Date
}

export interface DirectoryConfig {
  id: string
  name: string
  path: string
  enabled: boolean
  lastSync?: Date
}

export interface DocumentType {
  id: string
  name: string
  enabled: boolean
}

export interface Provider {
  id: string
  name: string
  type: "email" | "cloud" | "both"
  icon: string
  requiresOAuth: boolean
  supportsFolders: boolean
  supportsDirectories: boolean
}

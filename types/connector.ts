export interface DataSource {
  id: string
  name: string
  type: "email" | "cloud"
  provider: "gmail" | "outlook" | "yahoo" | "google-drive" | "onedrive" | "custom-email"
  icon: string
  requiresOAuth: boolean
  status: "connected" | "disconnected" | "error"
  lastSync?: Date
  email?: string
}

export interface SyncConfig {
  interval: "6h" | "12h" | "24h" | "48h"
  documentTypes: DocumentType[]
}

export interface DocumentType {
  id: string
  name: string
  enabled: boolean
}

export interface IMAPConfig {
  email: string
  password: string
  server: string
  port: number
  ssl: boolean
}

export interface ConnectedSource extends DataSource {
  syncConfig: SyncConfig
  imapConfig?: IMAPConfig
}

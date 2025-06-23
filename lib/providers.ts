import type { Provider } from "../types/connector"

export const providers: Provider[] = [
  {
    id: "gmail",
    name: "Gmail",
    type: "email",
    icon: "📧",
    requiresOAuth: true,
    supportsFolders: true,
    supportsDirectories: false,
  },
  {
    id: "outlook",
    name: "Outlook",
    type: "email",
    icon: "📮",
    requiresOAuth: true,
    supportsFolders: true,
    supportsDirectories: false,
  },
  {
    id: "yahoo",
    name: "Yahoo Mail",
    type: "email",
    icon: "📬",
    requiresOAuth: true,
    supportsFolders: true,
    supportsDirectories: false,
  },
  {
    id: "google-drive",
    name: "Google Drive",
    type: "cloud",
    icon: "💾",
    requiresOAuth: true,
    supportsFolders: false,
    supportsDirectories: true,
  },
  {
    id: "onedrive",
    name: "OneDrive",
    type: "cloud",
    icon: "☁️",
    requiresOAuth: true,
    supportsFolders: false,
    supportsDirectories: true,
  },
  {
    id: "custom-imap",
    name: "Custom Email (IMAP)",
    type: "email",
    icon: "✉️",
    requiresOAuth: false,
    supportsFolders: true,
    supportsDirectories: false,
  },
]

// Mock data for folders/directories
export const mockFolders = {
  gmail: [
    { id: "inbox", name: "Inbox", path: "INBOX", enabled: true },
    { id: "sent", name: "Sent", path: "[Gmail]/Sent Mail", enabled: false },
    { id: "drafts", name: "Drafts", path: "[Gmail]/Drafts", enabled: false },
    { id: "spam", name: "Spam", path: "[Gmail]/Spam", enabled: false },
  ],
  outlook: [
    { id: "inbox", name: "Inbox", path: "Inbox", enabled: true },
    { id: "sent", name: "Sent Items", path: "Sent Items", enabled: false },
    { id: "drafts", name: "Drafts", path: "Drafts", enabled: false },
    { id: "junk", name: "Junk Email", path: "Junk Email", enabled: false },
  ],
}

export const mockDirectories = {
  "google-drive": [
    { id: "root", name: "My Drive", path: "/", enabled: true },
    { id: "documents", name: "Documents", path: "/Documents", enabled: true },
    { id: "invoices", name: "Invoices", path: "/Business/Invoices", enabled: true },
    { id: "contracts", name: "Contracts", path: "/Business/Contracts", enabled: false },
  ],
  onedrive: [
    { id: "root", name: "OneDrive", path: "/", enabled: true },
    { id: "documents", name: "Documents", path: "/Documents", enabled: true },
    { id: "business", name: "Business", path: "/Business", enabled: false },
  ],
}

export const documentTypes = [
  { id: "invoice", name: "Invoice", enabled: true },
  { id: "po", name: "Purchase Order", enabled: true },
  { id: "delivery-challan", name: "Delivery Challan", enabled: false },
  { id: "receipt", name: "Receipt", enabled: false },
  { id: "contract", name: "Contract", enabled: false },
]

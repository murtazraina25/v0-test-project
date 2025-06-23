"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Trash2 } from "lucide-react"
import { AddAccountDialog } from "./add-account-dialog"
import { AccountSyncDialog } from "./account-sync-dialog"
import type { ConnectedAccount } from "../types/connector"
import { providers, mockFolders, mockDirectories, documentTypes } from "../lib/providers"

// Mock connected accounts
const mockConnectedAccounts: ConnectedAccount[] = [
  {
    id: "gmail-1",
    providerId: "gmail",
    providerName: "Gmail",
    accountName: "john.doe@gmail.com",
    accountType: "email",
    status: "connected",
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
    syncConfig: {
      enabled: true,
      syncInterval: "6h",
      folders: mockFolders.gmail,
      documentTypes: documentTypes.filter((dt) => dt.enabled),
    },
  },
  {
    id: "outlook-1",
    providerId: "outlook",
    providerName: "Outlook",
    accountName: "john.doe@company.com",
    accountType: "email",
    status: "connected",
    lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000),
    syncConfig: {
      enabled: true,
      syncInterval: "12h",
      folders: mockFolders.outlook,
      documentTypes: documentTypes.filter((dt) => dt.enabled),
    },
  },
  {
    id: "gdrive-1",
    providerId: "google-drive",
    providerName: "Google Drive",
    accountName: "john.doe@gmail.com",
    accountType: "cloud",
    status: "syncing",
    lastSync: new Date(Date.now() - 30 * 60 * 1000),
    syncConfig: {
      enabled: true,
      syncInterval: "24h",
      directories: mockDirectories["google-drive"],
      documentTypes: documentTypes.filter((dt) => dt.enabled),
    },
  },
]

export function AccountsManager() {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>(mockConnectedAccounts)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<ConnectedAccount | null>(null)
  const [showSyncDialog, setShowSyncDialog] = useState(false)

  const handleAddAccount = (account: ConnectedAccount) => {
    setConnectedAccounts([...connectedAccounts, account])
    setShowAddDialog(false)
  }

  const handleRemoveAccount = (accountId: string) => {
    setConnectedAccounts(connectedAccounts.filter((acc) => acc.id !== accountId))
  }

  const handleConfigureSync = (account: ConnectedAccount) => {
    setSelectedAccount(account)
    setShowSyncDialog(true)
  }

  const handleUpdateSyncConfig = (accountId: string, syncConfig: any) => {
    setConnectedAccounts(connectedAccounts.map((acc) => (acc.id === accountId ? { ...acc, syncConfig } : acc)))
    setShowSyncDialog(false)
    setSelectedAccount(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "syncing":
        return <Badge className="bg-blue-100 text-blue-800">Syncing</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatLastSync = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffHours > 0) {
      return `${diffHours}h ago`
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`
    } else {
      return "Just now"
    }
  }

  const getProviderIcon = (providerId: string) => {
    return providers.find((p) => p.id === providerId)?.icon || "📁"
  }

  const getEnabledFoldersCount = (account: ConnectedAccount) => {
    if (account.accountType === "email" && account.syncConfig.folders) {
      return account.syncConfig.folders.filter((f) => f.enabled).length
    }
    if (account.accountType === "cloud" && account.syncConfig.directories) {
      return account.syncConfig.directories.filter((d) => d.enabled).length
    }
    return 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Connected Accounts</h2>
          <p className="text-gray-600">Manage your email accounts and cloud storage connections</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {connectedAccounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold mb-2">No Connected Accounts</h3>
            <p className="text-gray-500 text-center mb-4">
              Connect your first email account or cloud storage to start processing documents
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedAccounts.map((account) => (
            <Card key={account.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getProviderIcon(account.providerId)}</span>
                    <div>
                      <CardTitle className="text-lg">{account.providerName}</CardTitle>
                      <CardDescription className="text-sm">{account.accountName}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(account.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sync Interval:</span>
                    <span className="font-medium">{account.syncConfig.syncInterval}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {account.accountType === "email" ? "Folders:" : "Directories:"}
                    </span>
                    <span className="font-medium">{getEnabledFoldersCount(account)} enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Sync:</span>
                    <span className="font-medium">{account.lastSync ? formatLastSync(account.lastSync) : "Never"}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleConfigureSync(account)} className="flex-1">
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveAccount(account.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddAccountDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAddAccount={handleAddAccount} />

      <AccountSyncDialog
        open={showSyncDialog}
        onOpenChange={setShowSyncDialog}
        account={selectedAccount}
        onUpdateConfig={handleUpdateSyncConfig}
      />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ConnectedAccount, AccountSyncConfig } from "../types/connector"
import { documentTypes } from "../lib/providers"

interface AccountSyncDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: ConnectedAccount | null
  onUpdateConfig: (accountId: string, config: AccountSyncConfig) => void
}

const syncIntervals = [
  { value: "15m", label: "Every 15 minutes" },
  { value: "30m", label: "Every 30 minutes" },
  { value: "1h", label: "Every hour" },
  { value: "6h", label: "Every 6 hours" },
  { value: "12h", label: "Every 12 hours" },
  { value: "24h", label: "Daily" },
]

export function AccountSyncDialog({ open, onOpenChange, account, onUpdateConfig }: AccountSyncDialogProps) {
  const [syncConfig, setSyncConfig] = useState<AccountSyncConfig | null>(null)

  useEffect(() => {
    if (account) {
      setSyncConfig({ ...account.syncConfig })
    }
  }, [account])

  if (!account || !syncConfig) return null

  const handleSave = () => {
    onUpdateConfig(account.id, syncConfig)
  }

  const handleFolderToggle = (folderId: string, enabled: boolean) => {
    if (syncConfig.folders) {
      setSyncConfig({
        ...syncConfig,
        folders: syncConfig.folders.map((folder) => (folder.id === folderId ? { ...folder, enabled } : folder)),
      })
    }
  }

  const handleDirectoryToggle = (directoryId: string, enabled: boolean) => {
    if (syncConfig.directories) {
      setSyncConfig({
        ...syncConfig,
        directories: syncConfig.directories.map((dir) => (dir.id === directoryId ? { ...dir, enabled } : dir)),
      })
    }
  }

  const handleDocumentTypeToggle = (docTypeId: string, enabled: boolean) => {
    setSyncConfig({
      ...syncConfig,
      documentTypes: syncConfig.documentTypes.map((docType) =>
        docType.id === docTypeId ? { ...docType, enabled } : docType,
      ),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Sync - {account.providerName}</DialogTitle>
          <DialogDescription>{account.accountName}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="folders">{account.accountType === "email" ? "Folders" : "Directories"}</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
                <CardDescription>Configure when and how often to sync this account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sync-enabled"
                    checked={syncConfig.enabled}
                    onCheckedChange={(enabled) => setSyncConfig({ ...syncConfig, enabled })}
                  />
                  <Label htmlFor="sync-enabled">Enable automatic sync</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sync-interval">Sync Interval</Label>
                  <Select
                    value={syncConfig.syncInterval}
                    onValueChange={(value) => setSyncConfig({ ...syncConfig, syncInterval: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sync interval" />
                    </SelectTrigger>
                    <SelectContent>
                      {syncIntervals.map((interval) => (
                        <SelectItem key={interval.value} value={interval.value}>
                          {interval.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="folders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{account.accountType === "email" ? "Email Folders" : "Directories"}</CardTitle>
                <CardDescription>
                  Select which {account.accountType === "email" ? "folders" : "directories"} to sync
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {account.accountType === "email" &&
                    syncConfig.folders?.map((folder) => (
                      <div key={folder.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={folder.id}
                            checked={folder.enabled}
                            onCheckedChange={(checked) => handleFolderToggle(folder.id, checked as boolean)}
                          />
                          <div>
                            <Label htmlFor={folder.id} className="font-medium">
                              {folder.name}
                            </Label>
                            <p className="text-sm text-gray-500">{folder.path}</p>
                          </div>
                        </div>
                        {folder.lastSync && (
                          <div className="text-sm text-gray-500">
                            Last sync: {new Date(folder.lastSync).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}

                  {account.accountType === "cloud" &&
                    syncConfig.directories?.map((directory) => (
                      <div key={directory.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={directory.id}
                            checked={directory.enabled}
                            onCheckedChange={(checked) => handleDirectoryToggle(directory.id, checked as boolean)}
                          />
                          <div>
                            <Label htmlFor={directory.id} className="font-medium">
                              {directory.name}
                            </Label>
                            <p className="text-sm text-gray-500">{directory.path}</p>
                          </div>
                        </div>
                        {directory.lastSync && (
                          <div className="text-sm text-gray-500">
                            Last sync: {new Date(directory.lastSync).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Types</CardTitle>
                <CardDescription>Select which types of documents to process and categorize</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentTypes.map((docType) => (
                    <div key={docType.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`doc-${docType.id}`}
                        checked={syncConfig.documentTypes.some((dt) => dt.id === docType.id && dt.enabled)}
                        onCheckedChange={(checked) => handleDocumentTypeToggle(docType.id, checked as boolean)}
                      />
                      <Label htmlFor={`doc-${docType.id}`} className="font-medium">
                        {docType.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

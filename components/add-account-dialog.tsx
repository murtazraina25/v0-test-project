"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { ImapConnectorForm } from "./imap-connector-form"
import { generateOAuthUrl } from "@/lib/oauth-config"
import { providers, mockFolders, mockDirectories, documentTypes } from "../lib/providers"
import type { ConnectedAccount, Provider } from "../types/connector"
import { useToast } from "@/hooks/use-toast"

interface AddAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAccount: (account: ConnectedAccount) => void
}

export function AddAccountDialog({ open, onOpenChange, onAddAccount }: AddAccountDialogProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [showImapForm, setShowImapForm] = useState(false)
  const { toast } = useToast()

  const handleProviderSelect = (provider: Provider) => {
    if (provider.requiresOAuth) {
      handleOAuthConnect(provider)
    } else {
      setSelectedProvider(provider)
      setShowImapForm(true)
    }
  }

  const handleOAuthConnect = (provider: Provider) => {
    try {
      const oauthUrl = generateOAuthUrl(provider.id === "google-drive" ? "google" : provider.id)
      const popup = window.open(oauthUrl, "oauth", "width=500,height=600,scrollbars=yes,resizable=yes")

      if (!popup) {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups for this site to complete OAuth authentication.",
          variant: "destructive",
        })
        return
      }

      // Simulate successful OAuth (in real app, this would be handled by the callback)
      setTimeout(() => {
        if (!popup.closed) {
          popup.close()
        }

        // Create mock account
        const newAccount: ConnectedAccount = {
          id: `${provider.id}-${Date.now()}`,
          providerId: provider.id,
          providerName: provider.name,
          accountName: `user@${provider.id === "gmail" ? "gmail.com" : provider.id === "outlook" ? "outlook.com" : "example.com"}`,
          accountType: provider.type === "cloud" ? "cloud" : "email",
          status: "connected",
          lastSync: new Date(),
          syncConfig: {
            enabled: true,
            syncInterval: "12h",
            folders: provider.supportsFolders ? mockFolders[provider.id as keyof typeof mockFolders] || [] : undefined,
            directories: provider.supportsDirectories
              ? mockDirectories[provider.id as keyof typeof mockDirectories] || []
              : undefined,
            documentTypes: documentTypes.filter((dt) => dt.enabled),
          },
        }

        onAddAccount(newAccount)
        toast({
          title: "Account Connected",
          description: `Successfully connected ${provider.name} account`,
        })
      }, 2000)
    } catch (error) {
      toast({
        title: "OAuth Error",
        description: error instanceof Error ? error.message : "Failed to start OAuth flow",
        variant: "destructive",
      })
    }
  }

  const handleImapSubmit = (data: any) => {
    if (selectedProvider) {
      const newAccount: ConnectedAccount = {
        id: `${selectedProvider.id}-${Date.now()}`,
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        accountName: data.email,
        accountType: "email",
        status: "connected",
        lastSync: new Date(),
        syncConfig: {
          enabled: true,
          syncInterval: "12h",
          folders: [
            { id: "inbox", name: "Inbox", path: "INBOX", enabled: true },
            { id: "sent", name: "Sent", path: "Sent", enabled: false },
          ],
          documentTypes: documentTypes.filter((dt) => dt.enabled),
        },
      }

      onAddAccount(newAccount)
      toast({
        title: "IMAP Account Connected",
        description: `Successfully connected ${data.email}`,
      })
    }
    setShowImapForm(false)
    setSelectedProvider(null)
  }

  const handleBack = () => {
    setShowImapForm(false)
    setSelectedProvider(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{showImapForm ? "Configure IMAP Connection" : "Add New Account"}</DialogTitle>
          <DialogDescription>
            {showImapForm
              ? "Enter your email server details"
              : "Choose a provider to connect your email account or cloud storage"}
          </DialogDescription>
        </DialogHeader>

        {showImapForm && selectedProvider ? (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBack} className="w-fit">
              ← Back to Providers
            </Button>
            <ImapConnectorForm onSubmit={handleImapSubmit} onCancel={() => setShowImapForm(false)} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {providers.map((provider) => (
              <Card key={provider.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {provider.type} • {provider.requiresOAuth ? "OAuth" : "IMAP"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => handleProviderSelect(provider)} className="w-full">
                    {provider.requiresOAuth && <ExternalLink className="mr-2 h-4 w-4" />}
                    Connect {provider.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Cloud, Server, ExternalLink } from "lucide-react"
import { ImapConnectorForm } from "./imap-connector-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { generateOAuthUrl } from "@/lib/oauth-config"

interface Connector {
  id: string
  name: string
  type: "oauth" | "imap"
  icon: React.ReactNode
  description: string
  status: "available" | "connected" | "error"
  provider?: string
}

const initialConnectors: Connector[] = [
  {
    id: "gmail",
    name: "Gmail",
    type: "oauth",
    icon: <Mail className="h-6 w-6" />,
    description: "Connect your Gmail account",
    status: "available",
    provider: "google",
  },
  {
    id: "outlook",
    name: "Outlook",
    type: "oauth",
    icon: <Mail className="h-6 w-6" />,
    description: "Connect your Outlook account",
    status: "available",
    provider: "microsoft",
  },
  {
    id: "yahoo",
    name: "Yahoo Mail",
    type: "oauth",
    icon: <Mail className="h-6 w-6" />,
    description: "Connect your Yahoo Mail account",
    status: "available",
    provider: "yahoo",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    type: "oauth",
    icon: <Cloud className="h-6 w-6" />,
    description: "Connect your Google Drive",
    status: "available",
    provider: "google",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    type: "oauth",
    icon: <Cloud className="h-6 w-6" />,
    description: "Connect your OneDrive",
    status: "available",
    provider: "microsoft",
  },
  {
    id: "custom-imap",
    name: "Custom Email (IMAP)",
    type: "imap",
    icon: <Server className="h-6 w-6" />,
    description: "Connect any IMAP email server",
    status: "available",
  },
]

export function ConnectorGrid() {
  const [connectors, setConnectors] = useState<Connector[]>(initialConnectors)
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null)
  const [showImapForm, setShowImapForm] = useState(false)
  const { toast } = useToast()

  const handleConnect = (connector: Connector) => {
    if (connector.type === "oauth" && connector.provider) {
      try {
        const oauthUrl = generateOAuthUrl(connector.provider)

        // Open OAuth URL in a popup window
        const popup = window.open(oauthUrl, "oauth", "width=500,height=600,scrollbars=yes,resizable=yes")

        if (!popup) {
          toast({
            title: "Popup Blocked",
            description: "Please allow popups for this site to complete OAuth authentication.",
            variant: "destructive",
          })
          return
        }

        // Listen for popup to close (user completed OAuth)
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed)
            toast({
              title: "Authentication Window Closed",
              description: "If you completed authentication, the authorization code should be displayed in the popup.",
            })
          }
        }, 1000)
      } catch (error) {
        toast({
          title: "OAuth Error",
          description: error instanceof Error ? error.message : "Failed to start OAuth flow",
          variant: "destructive",
        })
      }
    } else if (connector.type === "imap") {
      setSelectedConnector(connector)
      setShowImapForm(true)
    }
  }

  const handleImapSubmit = (data: any) => {
    // Handle IMAP connection
    if (selectedConnector) {
      setConnectors((prev) => prev.map((c) => (c.id === selectedConnector.id ? { ...c, status: "connected" } : c)))

      toast({
        title: "IMAP Connection Successful",
        description: `Successfully connected to ${data.email}`,
      })
    }
    setShowImapForm(false)
    setSelectedConnector(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Connected
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Available</Badge>
    }
  }

  return (
    <>
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-medium text-yellow-800 mb-2">⚠️ OAuth Configuration Required</h3>
        <p className="text-sm text-yellow-700">Before using OAuth connectors, you need to:</p>
        <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2 space-y-1">
          <li>Register your app with each OAuth provider</li>
          <li>
            Update the client IDs in <code className="bg-yellow-100 px-1 rounded">lib/oauth-config.ts</code>
          </li>
          <li>Configure redirect URIs in your OAuth app settings</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map((connector) => (
          <Card key={connector.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {connector.icon}
                  <CardTitle className="text-lg">{connector.name}</CardTitle>
                </div>
                {getStatusBadge(connector.status)}
              </div>
              <CardDescription>{connector.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleConnect(connector)}
                disabled={connector.status === "connected"}
                className="w-full"
                variant={connector.status === "connected" ? "secondary" : "default"}
              >
                {connector.type === "oauth" && connector.status !== "connected" && (
                  <ExternalLink className="mr-2 h-4 w-4" />
                )}
                {connector.status === "connected" ? "Connected" : "Connect"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showImapForm} onOpenChange={setShowImapForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect IMAP Email</DialogTitle>
            <DialogDescription>Enter your email server details to connect via IMAP</DialogDescription>
          </DialogHeader>
          <ImapConnectorForm onSubmit={handleImapSubmit} onCancel={() => setShowImapForm(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

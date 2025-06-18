"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useState } from "react"

export function OAuthSetupInstructions() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedUrl(type)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"

  const redirectUrls = {
    google: `${currentOrigin}/auth/callback/google`,
    microsoft: `${currentOrigin}/auth/callback/microsoft`,
    yahoo: `${currentOrigin}/auth/callback/yahoo`,
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🔧</span>
          <span>OAuth Setup Instructions</span>
        </CardTitle>
        <CardDescription>Use these exact redirect URLs when setting up your OAuth applications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="font-semibold text-blue-800 mb-2">📋 Quick Setup Checklist</h3>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>Copy the redirect URLs below</li>
            <li>Register OAuth apps with each provider</li>
            <li>Add the redirect URLs to your OAuth app settings</li>
            <li>Copy the client IDs back to your code</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <Badge variant="outline" className="bg-red-50">
              Google
            </Badge>
            <span>Gmail & Google Drive Setup</span>
          </h3>

          <div className="bg-gray-50 border rounded-md p-3 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Redirect URI:</p>
                <code className="text-sm bg-white px-2 py-1 rounded border">{redirectUrls.google}</code>
              </div>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(redirectUrls.google, "google")}>
                <Copy className="h-4 w-4 mr-1" />
                {copiedUrl === "google" ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="text-sm space-y-2">
            <p>
              <strong>Step 1:</strong> Go to{" "}
              <a
                href="https://console.cloud.google.com/"
                className="text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                Google Cloud Console
              </a>
            </p>
            <p>
              <strong>Step 2:</strong> Create a new project or select existing one
            </p>
            <p>
              <strong>Step 3:</strong> Enable Gmail API and Google Drive API
            </p>
            <p>
              <strong>Step 4:</strong> Go to "Credentials" → "Create Credentials" → "OAuth client ID"
            </p>
            <p>
              <strong>Step 5:</strong> Choose "Web application"
            </p>
            <p>
              <strong>Step 6:</strong> Add the redirect URI above to "Authorized redirect URIs"
            </p>
            <p>
              <strong>Step 7:</strong> Copy the Client ID and update{" "}
              <code className="bg-gray-100 px-1 rounded">lib/oauth-config.ts</code>
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50">
              Microsoft
            </Badge>
            <span>Outlook & OneDrive Setup</span>
          </h3>

          <div className="bg-gray-50 border rounded-md p-3 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Redirect URI:</p>
                <code className="text-sm bg-white px-2 py-1 rounded border">{redirectUrls.microsoft}</code>
              </div>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(redirectUrls.microsoft, "microsoft")}>
                <Copy className="h-4 w-4 mr-1" />
                {copiedUrl === "microsoft" ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="text-sm space-y-2">
            <p>
              <strong>Step 1:</strong> Go to{" "}
              <a href="https://portal.azure.com/" className="text-blue-600 underline" target="_blank" rel="noreferrer">
                Azure Portal
              </a>
            </p>
            <p>
              <strong>Step 2:</strong> Go to "Azure Active Directory" → "App registrations" → "New registration"
            </p>
            <p>
              <strong>Step 3:</strong> Enter app name, select "Accounts in any organizational directory and personal
              Microsoft accounts"
            </p>
            <p>
              <strong>Step 4:</strong> Add the redirect URI above as "Web" platform
            </p>
            <p>
              <strong>Step 5:</strong> Go to "API permissions" → Add Microsoft Graph permissions: Mail.Read,
              Files.Read.All
            </p>
            <p>
              <strong>Step 6:</strong> Copy the Application (client) ID and update{" "}
              <code className="bg-gray-100 px-1 rounded">lib/oauth-config.ts</code>
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <Badge variant="outline" className="bg-purple-50">
              Yahoo
            </Badge>
            <span>Yahoo Mail Setup</span>
          </h3>

          <div className="bg-gray-50 border rounded-md p-3 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Redirect URI:</p>
                <code className="text-sm bg-white px-2 py-1 rounded border">{redirectUrls.yahoo}</code>
              </div>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(redirectUrls.yahoo, "yahoo")}>
                <Copy className="h-4 w-4 mr-1" />
                {copiedUrl === "yahoo" ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="text-sm space-y-2">
            <p>
              <strong>Step 1:</strong> Go to{" "}
              <a
                href="https://developer.yahoo.com/"
                className="text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                Yahoo Developer Network
              </a>
            </p>
            <p>
              <strong>Step 2:</strong> Create a Yahoo account if you don't have one
            </p>
            <p>
              <strong>Step 3:</strong> Create a new app
            </p>
            <p>
              <strong>Step 4:</strong> Select "Mail" API permissions
            </p>
            <p>
              <strong>Step 5:</strong> Add the redirect URI above
            </p>
            <p>
              <strong>Step 6:</strong> Copy the Client ID and update{" "}
              <code className="bg-gray-100 px-1 rounded">lib/oauth-config.ts</code>
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ After Setup</h3>
          <p className="text-sm text-green-700">
            Once you've completed the setup and updated the client IDs in{" "}
            <code className="bg-green-100 px-1 rounded">lib/oauth-config.ts</code>, the OAuth connections will work
            properly and redirect back to your application with authorization codes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

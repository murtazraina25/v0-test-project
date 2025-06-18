"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function OAuthSetupGuide() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🔧</span>
          <span>OAuth Setup Guide</span>
        </CardTitle>
        <CardDescription>Follow these steps to configure OAuth providers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2 flex items-center space-x-2">
            <Badge variant="outline">Google</Badge>
            <span>Gmail & Google Drive</span>
          </h3>
          <ol className="list-decimal list-inside text-sm space-y-1 ml-4">
            <li>
              Go to{" "}
              <a
                href="https://console.cloud.google.com/"
                className="text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                Google Cloud Console
              </a>
            </li>
            <li>Create a new project or select existing one</li>
            <li>Enable Gmail API and Google Drive API</li>
            <li>Create OAuth 2.0 credentials</li>
            <li>
              Add redirect URIs:{" "}
              <code className="bg-gray-100 px-1 rounded text-xs">
                {typeof window !== "undefined" ? window.location.origin : "YOUR_DOMAIN"}/auth/callback/google
              </code>
            </li>
            <li>
              Copy Client ID to <code className="bg-gray-100 px-1 rounded text-xs">lib/oauth-config.ts</code>
            </li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold mb-2 flex items-center space-x-2">
            <Badge variant="outline">Microsoft</Badge>
            <span>Outlook & OneDrive</span>
          </h3>
          <ol className="list-decimal list-inside text-sm space-y-1 ml-4">
            <li>
              Go to{" "}
              <a href="https://portal.azure.com/" className="text-blue-600 underline" target="_blank" rel="noreferrer">
                Azure Portal
              </a>
            </li>
            <li>Register a new application in Azure AD</li>
            <li>Add Microsoft Graph permissions (Mail.Read, Files.Read.All)</li>
            <li>
              Add redirect URI:{" "}
              <code className="bg-gray-100 px-1 rounded text-xs">
                {typeof window !== "undefined" ? window.location.origin : "YOUR_DOMAIN"}/auth/callback/microsoft
              </code>
            </li>
            <li>
              Copy Application (client) ID to{" "}
              <code className="bg-gray-100 px-1 rounded text-xs">lib/oauth-config.ts</code>
            </li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold mb-2 flex items-center space-x-2">
            <Badge variant="outline">Yahoo</Badge>
            <span>Yahoo Mail</span>
          </h3>
          <ol className="list-decimal list-inside text-sm space-y-1 ml-4">
            <li>
              Go to{" "}
              <a
                href="https://developer.yahoo.com/"
                className="text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                Yahoo Developer Network
              </a>
            </li>
            <li>Create a new app</li>
            <li>Select "Mail" API permissions</li>
            <li>
              Add redirect URI:{" "}
              <code className="bg-gray-100 px-1 rounded text-xs">
                {typeof window !== "undefined" ? window.location.origin : "YOUR_DOMAIN"}/auth/callback/yahoo
              </code>
            </li>
            <li>
              Copy Client ID to <code className="bg-gray-100 px-1 rounded text-xs">lib/oauth-config.ts</code>
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

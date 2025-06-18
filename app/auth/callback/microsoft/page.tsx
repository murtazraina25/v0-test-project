"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy, AlertCircle } from "lucide-react"
import { parseState } from "@/lib/oauth-config"

export default function MicrosoftCallback() {
  const searchParams = useSearchParams()
  const [authCode, setAuthCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const state = searchParams.get("state")

    if (error) {
      setError(`OAuth Error: ${error}`)
      return
    }

    if (!code) {
      setError("No authorization code received")
      return
    }

    if (!state) {
      setError("No state parameter received")
      return
    }

    const parsedState = parseState(state)
    if (!parsedState || parsedState.provider !== "microsoft") {
      setError("Invalid state parameter")
      return
    }

    setAuthCode(code)
  }, [searchParams])

  const copyToClipboard = async () => {
    if (authCode) {
      await navigator.clipboard.writeText(authCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const closeWindow = () => {
    window.close()
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <CardTitle>Authentication Error</CardTitle>
            </div>
            <CardDescription>There was an error during authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Button onClick={closeWindow} className="w-full">
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!authCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Processing authentication...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <CardTitle>Microsoft Authentication Successful</CardTitle>
          </div>
          <CardDescription>Copy the authorization code below and send it to your backend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Authorization Code:</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={authCode}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
              />
              <Button size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">Next Steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copy the authorization code above</li>
              <li>Send it to your backend API</li>
              <li>Exchange it for access tokens</li>
            </ol>
          </div>
          <Button onClick={closeWindow} className="w-full">
            Close Window
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

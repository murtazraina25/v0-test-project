"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ExternalLink } from "lucide-react"
import type { DataSource } from "../types/connector"
import { mockAPI, getEmailDomain, isOAuthProvider } from "../utils/mockData"

interface ConnectorCardProps {
  dataSource: DataSource
  onConnect: (sourceId: string, config?: any) => void
  onShowIMAPForm: (email: string) => void
}

export function ConnectorCard({ dataSource, onConnect, onShowIMAPForm }: ConnectorCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [showEmailInput, setShowEmailInput] = useState(false)

  const handleConnect = async () => {
    if (dataSource.provider === "custom-email") {
      setShowEmailInput(true)
      return
    }

    setIsLoading(true)
    try {
      const result = await mockAPI.connectOAuth(dataSource.provider)
      if (result.success && result.redirectUrl) {
        // In a real app, this would redirect to OAuth
        console.log("Redirecting to:", result.redirectUrl)
        onConnect(dataSource.id)
      }
    } catch (error) {
      console.error("OAuth connection failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = () => {
    const domain = getEmailDomain(email)

    if (isOAuthProvider(domain)) {
      // Trigger OAuth for known providers
      const provider = domain.includes("gmail")
        ? "gmail"
        : domain.includes("outlook") || domain.includes("hotmail")
          ? "outlook"
          : domain.includes("yahoo")
            ? "yahoo"
            : null

      if (provider) {
        handleConnect()
        return
      }
    }

    // Show IMAP form for custom domains
    onShowIMAPForm(email)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{dataSource.icon}</span>
            <div>
              <CardTitle className="text-lg">{dataSource.name}</CardTitle>
              <CardDescription className="capitalize">
                {dataSource.type} • {dataSource.provider.replace("-", " ")}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(dataSource.status)}`} />
            <span className="capitalize">{dataSource.status}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!showEmailInput ? (
          <Button onClick={handleConnect} disabled={isLoading || dataSource.status === "connected"} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {dataSource.requiresOAuth && <ExternalLink className="mr-2 h-4 w-4" />}
            {dataSource.status === "connected" ? "Connected" : "Connect"}
          </Button>
        ) : (
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              <Button onClick={handleEmailSubmit} disabled={!email} className="flex-1">
                Continue
              </Button>
              <Button variant="outline" onClick={() => setShowEmailInput(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

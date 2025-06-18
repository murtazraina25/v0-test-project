"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Cloud, Server, RefreshCw, Unplug } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConnectedSource {
  id: string
  name: string
  type: "email" | "storage"
  icon: React.ReactNode
  status: "connected" | "error" | "syncing"
  lastSync: string
  email?: string
  documentsCount: number
}

const mockConnectedSources: ConnectedSource[] = [
  {
    id: "outlook-1",
    name: "Outlook",
    type: "email",
    icon: <Mail className="h-5 w-5" />,
    status: "connected",
    lastSync: "2 hours ago",
    email: "john.doe@company.com",
    documentsCount: 45,
  },
  {
    id: "gmail-1",
    name: "Gmail",
    type: "email",
    icon: <Mail className="h-5 w-5" />,
    status: "error",
    lastSync: "1 day ago",
    email: "john.doe@gmail.com",
    documentsCount: 23,
  },
  {
    id: "gdrive-1",
    name: "Google Drive",
    type: "storage",
    icon: <Cloud className="h-5 w-5" />,
    status: "syncing",
    lastSync: "Syncing now...",
    documentsCount: 12,
  },
]

export function ConnectedSources() {
  const [sources, setSources] = useState(mockConnectedSources)

  const handleDisconnect = (sourceId: string) => {
    setSources(sources.filter((source) => source.id !== sourceId))
  }

  const handleReconnect = (sourceId: string) => {
    setSources(
      sources.map((source) =>
        source.id === sourceId ? { ...source, status: "connected" as const, lastSync: "Just now" } : source,
      ),
    )
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
      case "syncing":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Syncing
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (sources.length === 0) {
    return (
      <div className="text-center py-12">
        <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Connected Sources</h3>
        <p className="text-gray-500">Connect your first data source to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sources.map((source) => (
        <Card key={source.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {source.icon}
                <div>
                  <CardTitle className="text-lg">{source.name}</CardTitle>
                  {source.email && <CardDescription>{source.email}</CardDescription>}
                </div>
              </div>
              {getStatusBadge(source.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Last sync: {source.lastSync}</p>
                <p className="text-sm text-gray-600">Documents processed: {source.documentsCount}</p>
              </div>
              <div className="flex space-x-2">
                {source.status === "error" && (
                  <Button size="sm" variant="outline" onClick={() => handleReconnect(source.id)}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reconnect
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Unplug className="h-4 w-4 mr-1" />
                      Disconnect
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Disconnect {source.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will stop syncing documents from this source. You can reconnect it later.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDisconnect(source.id)}>Disconnect</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

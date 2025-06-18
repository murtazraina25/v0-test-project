"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Loader2, RefreshCw, Unplug, Settings } from "lucide-react"
import type { ConnectedSource } from "../types/connector"
import { mockAPI } from "../utils/mockData"

interface ConnectedSourcesListProps {
  sources: ConnectedSource[]
  onDisconnect: (sourceId: string) => void
  onConfigure: (source: ConnectedSource) => void
}

export function ConnectedSourcesList({ sources, onDisconnect, onConfigure }: ConnectedSourcesListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const setLoading = (sourceId: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [sourceId]: loading }))
  }

  const handleDisconnect = async (sourceId: string) => {
    setLoading(sourceId, true)
    try {
      await mockAPI.disconnect(sourceId)
      onDisconnect(sourceId)
    } catch (error) {
      console.error("Failed to disconnect:", error)
    } finally {
      setLoading(sourceId, false)
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

  if (sources.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-4xl mb-4">🔌</div>
          <h3 className="text-lg font-semibold mb-2">No Connected Sources</h3>
          <p className="text-gray-500 text-center">Connect your first data source to start processing documents</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Connected Sources</h3>
      {sources.map((source) => (
        <Card key={source.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{source.icon}</span>
                <div>
                  <CardTitle className="text-lg">{source.name}</CardTitle>
                  <CardDescription>
                    {source.email && <span>{source.email} • </span>}
                    Sync: {source.syncConfig.interval}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(source.status)}`} />
                <span className="capitalize">{source.status}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {source.lastSync ? (
                  <span>Last sync: {formatLastSync(source.lastSync)}</span>
                ) : (
                  <span>Never synced</span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onConfigure(source)}>
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
                <Button variant="outline" size="sm" disabled={loadingStates[source.id]}>
                  {loadingStates[source.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
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
                      <AlertDialogAction
                        onClick={() => handleDisconnect(source.id)}
                        disabled={loadingStates[source.id]}
                      >
                        {loadingStates[source.id] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Disconnect
                      </AlertDialogAction>
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

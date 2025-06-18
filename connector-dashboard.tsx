"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConnectorCard } from "./components/ConnectorCard"
import { IMAPForm } from "./components/IMAPForm"
import { ConfigurationPanel } from "./components/ConfigurationPanel"
import { ConnectedSourcesList } from "./components/ConnectedSourcesList"
import { availableDataSources, mockConnectedSources, documentTypes } from "./utils/mockData"
import type { ConnectedSource, SyncConfig, IMAPConfig } from "./types/connector"

export default function ConnectorDashboard() {
  const [connectedSources, setConnectedSources] = useState<ConnectedSource[]>(mockConnectedSources)
  const [showIMAPDialog, setShowIMAPDialog] = useState(false)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [currentIMAPEmail, setCurrentIMAPEmail] = useState("")
  const [currentConfigSource, setCurrentConfigSource] = useState<ConnectedSource | null>(null)
  const [globalSyncConfig, setGlobalSyncConfig] = useState<SyncConfig>({
    interval: "12h",
    documentTypes: documentTypes.filter((dt) => dt.enabled),
  })

  const handleConnect = (sourceId: string, config?: any) => {
    const dataSource = availableDataSources.find((ds) => ds.id === sourceId)
    if (!dataSource) return

    const newConnectedSource: ConnectedSource = {
      ...dataSource,
      id: `${sourceId}-connected`,
      status: "connected",
      lastSync: new Date(),
      syncConfig: globalSyncConfig,
      ...(config && { imapConfig: config }),
    }

    setConnectedSources((prev) => [...prev, newConnectedSource])
  }

  const handleShowIMAPForm = (email: string) => {
    setCurrentIMAPEmail(email)
    setShowIMAPDialog(true)
  }

  const handleIMAPSuccess = (config: IMAPConfig) => {
    handleConnect("custom-email", config)
    setShowIMAPDialog(false)
    setCurrentIMAPEmail("")
  }

  const handleDisconnect = (sourceId: string) => {
    setConnectedSources((prev) => prev.filter((source) => source.id !== sourceId))
  }

  const handleConfigure = (source: ConnectedSource) => {
    setCurrentConfigSource(source)
    setShowConfigDialog(true)
  }

  const handleConfigSave = (config: SyncConfig) => {
    if (currentConfigSource) {
      setConnectedSources((prev) =>
        prev.map((source) => (source.id === currentConfigSource.id ? { ...source, syncConfig: config } : source)),
      )
    } else {
      setGlobalSyncConfig(config)
    }
    setShowConfigDialog(false)
    setCurrentConfigSource(null)
  }

  const availableSources = availableDataSources.filter(
    (ds) => !connectedSources.some((cs) => cs.provider === ds.provider),
  )

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Document Processing Connectors</h1>
        <p className="text-gray-600">Connect your data sources to automatically process and categorize documents</p>
      </div>

      <Tabs defaultValue="connect" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connect">Connect Sources</TabsTrigger>
          <TabsTrigger value="connected">Connected ({connectedSources.length})</TabsTrigger>
          <TabsTrigger value="configure">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Data Sources</CardTitle>
              <CardDescription>
                Connect your email accounts and cloud storage to start processing documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableSources.map((dataSource) => (
                  <ConnectorCard
                    key={dataSource.id}
                    dataSource={dataSource}
                    onConnect={handleConnect}
                    onShowIMAPForm={handleShowIMAPForm}
                  />
                ))}
              </div>
              {availableSources.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-lg font-semibold mb-2">All Sources Connected</h3>
                  <p className="text-gray-500">You've connected all available data sources</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connected" className="space-y-6">
          <ConnectedSourcesList
            sources={connectedSources}
            onDisconnect={handleDisconnect}
            onConfigure={handleConfigure}
          />
        </TabsContent>

        <TabsContent value="configure" className="space-y-6">
          <ConfigurationPanel initialConfig={globalSyncConfig} onSave={handleConfigSave} />
        </TabsContent>
      </Tabs>

      {/* IMAP Configuration Dialog */}
      <Dialog open={showIMAPDialog} onOpenChange={setShowIMAPDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure Email Connection</DialogTitle>
          </DialogHeader>
          <IMAPForm
            initialEmail={currentIMAPEmail}
            onSuccess={handleIMAPSuccess}
            onCancel={() => setShowIMAPDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentConfigSource ? `Configure ${currentConfigSource.name}` : "Global Configuration"}
            </DialogTitle>
          </DialogHeader>
          <ConfigurationPanel
            initialConfig={currentConfigSource?.syncConfig || globalSyncConfig}
            onSave={handleConfigSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

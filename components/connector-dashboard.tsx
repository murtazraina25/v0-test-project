"use client"

import { useState } from "react"
import { ConnectorGrid } from "./connector-grid"
import { ConnectedSources } from "./connected-sources"
import { ConfigurationPanel } from "./configuration-panel"
import { OAuthSetupInstructions } from "./oauth-setup-instructions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ConnectorDashboard() {
  const [activeTab, setActiveTab] = useState("setup")

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Source Management</CardTitle>
          <CardDescription>
            Connect and manage your email accounts and cloud storage for document processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup">Setup Guide</TabsTrigger>
              <TabsTrigger value="connect">Connect Sources</TabsTrigger>
              <TabsTrigger value="manage">Manage Sources</TabsTrigger>
              <TabsTrigger value="configure">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="mt-6">
              <OAuthSetupInstructions />
            </TabsContent>

            <TabsContent value="connect" className="mt-6">
              <ConnectorGrid />
            </TabsContent>

            <TabsContent value="manage" className="mt-6">
              <ConnectedSources />
            </TabsContent>

            <TabsContent value="configure" className="mt-6">
              <ConfigurationPanel />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

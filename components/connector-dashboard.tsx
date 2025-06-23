"use client"

import { useState } from "react"
import { AccountsManager } from "./accounts-manager"
import { OAuthSetupInstructions } from "./oauth-setup-instructions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ConnectorDashboard() {
  const [activeTab, setActiveTab] = useState("accounts")

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Processing System</CardTitle>
          <CardDescription>
            Connect multiple accounts and configure granular sync settings for document processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="accounts">Manage Accounts</TabsTrigger>
              <TabsTrigger value="setup">OAuth Setup</TabsTrigger>
            </TabsList>

            <TabsContent value="accounts" className="mt-6">
              <AccountsManager />
            </TabsContent>

            <TabsContent value="setup" className="mt-6">
              <OAuthSetupInstructions />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

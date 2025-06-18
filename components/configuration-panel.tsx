"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

interface ConfigurationData {
  syncInterval: string
  documentTypes: string[]
}

const syncIntervals = [
  { value: "6h", label: "Every 6 hours" },
  { value: "12h", label: "Every 12 hours" },
  { value: "24h", label: "Daily" },
  { value: "48h", label: "Every 2 days" },
  { value: "168h", label: "Weekly" },
]

const documentTypes = [
  { id: "invoice", label: "Invoice", description: "Bills and invoices from suppliers" },
  { id: "po", label: "Purchase Order", description: "Purchase orders and procurement documents" },
  { id: "delivery-challan", label: "Delivery Challan", description: "Delivery receipts and shipping documents" },
  { id: "receipt", label: "Receipt", description: "Payment receipts and acknowledgments" },
  { id: "contract", label: "Contract", description: "Legal agreements and contracts" },
]

export function ConfigurationPanel() {
  const { toast } = useToast()
  const [syncInterval, setSyncInterval] = useState("12h")
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>(["invoice", "po"])

  const handleDocTypeChange = (docTypeId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocTypes([...selectedDocTypes, docTypeId])
    } else {
      setSelectedDocTypes(selectedDocTypes.filter((id) => id !== docTypeId))
    }
  }

  const handleSaveConfiguration = () => {
    const config = {
      syncInterval,
      documentTypes: selectedDocTypes,
    }

    console.log("Saving configuration:", config)

    toast({
      title: "Configuration saved",
      description: "Your sync preferences have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sync Configuration</CardTitle>
          <CardDescription>Configure how often your documents are synchronized</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sync-interval">Sync Interval</Label>
            <Select value={syncInterval} onValueChange={setSyncInterval}>
              <SelectTrigger>
                <SelectValue placeholder="Select sync interval" />
              </SelectTrigger>
              <SelectContent>
                {syncIntervals.map((interval) => (
                  <SelectItem key={interval.value} value={interval.value}>
                    {interval.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Types</CardTitle>
          <CardDescription>Select which types of documents to process and categorize</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentTypes.map((docType) => (
              <div key={docType.id} className="flex items-start space-x-3">
                <Checkbox
                  id={docType.id}
                  checked={selectedDocTypes.includes(docType.id)}
                  onCheckedChange={(checked) => handleDocTypeChange(docType.id, checked as boolean)}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor={docType.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {docType.label}
                  </Label>
                  <p className="text-sm text-gray-500">{docType.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveConfiguration}>Save Configuration</Button>
      </div>
    </div>
  )
}

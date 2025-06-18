"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { SyncConfig, DocumentType } from "../types/connector"
import { documentTypes, mockAPI } from "../utils/mockData"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface ConfigurationPanelProps {
  initialConfig?: SyncConfig
  onSave: (config: SyncConfig) => void
}

export function ConfigurationPanel({ initialConfig, onSave }: ConfigurationPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDocTypes, setSelectedDocTypes] = useState<DocumentType[]>(
    initialConfig?.documentTypes || documentTypes.filter((dt) => dt.enabled),
  )

  const { register, handleSubmit, setValue, watch } = useForm<SyncConfig>({
    defaultValues: {
      interval: initialConfig?.interval || "12h",
      documentTypes: selectedDocTypes,
    },
  })

  const watchedInterval = watch("interval")

  const handleDocTypeChange = (docType: DocumentType, checked: boolean) => {
    const updated = checked ? [...selectedDocTypes, docType] : selectedDocTypes.filter((dt) => dt.id !== docType.id)

    setSelectedDocTypes(updated)
    setValue("documentTypes", updated)
  }

  const onSubmit = async (data: SyncConfig) => {
    setIsLoading(true)
    try {
      await mockAPI.updateSyncConfig("config", data)
      onSave(data)
    } catch (error) {
      console.error("Failed to save configuration:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const intervalOptions = [
    { value: "6h", label: "Every 6 hours" },
    { value: "12h", label: "Every 12 hours" },
    { value: "24h", label: "Daily" },
    { value: "48h", label: "Every 2 days" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Configuration</CardTitle>
        <CardDescription>Configure how often to sync and which document types to process</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="interval">Sync Interval</Label>
            <Select value={watchedInterval} onValueChange={(value) => setValue("interval", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sync interval" />
              </SelectTrigger>
              <SelectContent>
                {intervalOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Document Types to Sync</Label>
            <div className="space-y-2">
              {documentTypes.map((docType) => (
                <div key={docType.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={docType.id}
                    checked={selectedDocTypes.some((dt) => dt.id === docType.id)}
                    onCheckedChange={(checked) => handleDocTypeChange(docType, checked as boolean)}
                  />
                  <Label htmlFor={docType.id} className="text-sm font-normal">
                    {docType.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

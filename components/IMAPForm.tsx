"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import type { IMAPConfig } from "../types/connector"
import { mockAPI } from "../utils/mockData"

interface IMAPFormProps {
  onSuccess: (config: IMAPConfig) => void
  onCancel: () => void
  initialEmail?: string
}

export function IMAPForm({ onSuccess, onCancel, initialEmail = "" }: IMAPFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IMAPConfig>({
    defaultValues: {
      email: initialEmail,
      password: "",
      server: "",
      port: 993,
      ssl: true,
    },
  })

  const watchedEmail = watch("email")

  // Auto-populate server based on email domain
  const getDefaultServer = (email: string) => {
    const domain = email.split("@")[1]?.toLowerCase()
    const serverMap: Record<string, string> = {
      "gmail.com": "imap.gmail.com",
      "yahoo.com": "imap.mail.yahoo.com",
      "outlook.com": "outlook.office365.com",
      "hotmail.com": "outlook.office365.com",
    }
    return serverMap[domain] || ""
  }

  const onSubmit = async (data: IMAPConfig) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await mockAPI.connectIMAP(data)
      if (result.success) {
        onSuccess(data)
      } else {
        setError(result.error || "Connection failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Configure IMAP Connection</CardTitle>
        <CardDescription>Enter your email server details to connect your custom email account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password / App Password</Label>
            <Input id="password" type="password" {...register("password", { required: "Password is required" })} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="server">IMAP Server</Label>
            <Input
              id="server"
              placeholder={getDefaultServer(watchedEmail) || "imap.example.com"}
              {...register("server", { required: "IMAP server is required" })}
            />
            {errors.server && <p className="text-sm text-red-500">{errors.server.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              type="number"
              {...register("port", {
                required: "Port is required",
                min: { value: 1, message: "Port must be greater than 0" },
                max: { value: 65535, message: "Port must be less than 65536" },
              })}
            />
            {errors.port && <p className="text-sm text-red-500">{errors.port.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="ssl" {...register("ssl")} />
            <Label htmlFor="ssl">Use SSL/TLS</Label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

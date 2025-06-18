"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"

interface ImapFormData {
  email: string
  password: string
  server: string
  port: number
  ssl: boolean
}

interface ImapConnectorFormProps {
  onSubmit: (data: ImapFormData) => void
  onCancel: () => void
}

export function ImapConnectorForm({ onSubmit, onCancel }: ImapConnectorFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ImapFormData>({
    defaultValues: {
      port: 993,
      ssl: true,
    },
  })

  const email = watch("email")

  // Domain-aware behavior
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value
    setValue("email", emailValue)

    // Auto-populate server settings based on common providers
    if (emailValue.includes("@gmail.com")) {
      setValue("server", "imap.gmail.com")
      setValue("port", 993)
      setValue("ssl", true)
    } else if (emailValue.includes("@outlook.com") || emailValue.includes("@hotmail.com")) {
      setValue("server", "outlook.office365.com")
      setValue("port", 993)
      setValue("ssl", true)
    } else if (emailValue.includes("@yahoo.com")) {
      setValue("server", "imap.mail.yahoo.com")
      setValue("port", 993)
      setValue("ssl", true)
    }
  }

  const handleFormSubmit = (data: ImapFormData) => {
    onSubmit(data)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
              onChange={handleEmailChange}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {email &&
            (email.includes("@gmail.com") || email.includes("@outlook.com") || email.includes("@yahoo.com")) && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                💡 Tip: For{" "}
                {email.includes("@gmail.com") ? "Gmail" : email.includes("@outlook.com") ? "Outlook" : "Yahoo"}, we
                recommend using the OAuth connection method for better security.
              </div>
            )}

          <div className="space-y-2">
            <Label htmlFor="password">Password / App Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Your email password"
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="server">IMAP Server</Label>
            <Input
              id="server"
              {...register("server", { required: "IMAP server is required" })}
              placeholder="imap.example.com"
            />
            {errors.server && <p className="text-sm text-red-600">{errors.server.message}</p>}
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
              placeholder="993"
            />
            {errors.port && <p className="text-sm text-red-600">{errors.port.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="ssl" {...register("ssl")} />
            <Label htmlFor="ssl">Use SSL/TLS</Label>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">
              Connect
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

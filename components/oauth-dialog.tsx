"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle } from "lucide-react"

interface OAuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider: string
  onSuccess: () => void
}

export function OAuthDialog({ open, onOpenChange, provider, onSuccess }: OAuthDialogProps) {
  const [step, setStep] = useState<"authorize" | "connecting" | "success">("authorize")

  useEffect(() => {
    if (open) {
      setStep("authorize")
    }
  }, [open])

  const handleAuthorize = () => {
    setStep("connecting")

    // Simulate OAuth flow
    setTimeout(() => {
      setStep("success")
      setTimeout(() => {
        onSuccess()
        onOpenChange(false)
      }, 1500)
    }, 2000)
  }

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google"
      case "microsoft":
        return "Microsoft"
      case "yahoo":
        return "Yahoo"
      default:
        return provider
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to {getProviderName(provider)}</DialogTitle>
          <DialogDescription>
            {step === "authorize" && "Authorize access to your account"}
            {step === "connecting" && "Connecting to your account..."}
            {step === "success" && "Successfully connected!"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {step === "authorize" && (
            <>
              <div className="text-6xl">🔐</div>
              <p className="text-center text-sm text-gray-600">
                You will be redirected to {getProviderName(provider)} to authorize access to your account.
              </p>
              <Button onClick={handleAuthorize} className="w-full">
                Authorize with {getProviderName(provider)}
              </Button>
            </>
          )}

          {step === "connecting" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-center text-sm text-gray-600">
                Connecting to your {getProviderName(provider)} account...
              </p>
            </>
          )}

          {step === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-center text-sm text-gray-600">
                Successfully connected to {getProviderName(provider)}!
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

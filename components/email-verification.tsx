"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

interface EmailVerificationProps {
  email: string
  onVerificationComplete: (token: string) => void
  onEmailChange?: (email: string) => void
  showEmailInput?: boolean
}

export default function EmailVerification({ 
  email, 
  onVerificationComplete, 
  onEmailChange,
  showEmailInput = false 
}: EmailVerificationProps) {
  const [currentEmail, setCurrentEmail] = useState(email)
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const sendVerificationEmail = async () => {
    if (!currentEmail || !currentEmail.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/vendor-verification/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: currentEmail }),
      })

      if (response.ok) {
        setOtpSent(true)
        setResendCooldown(60) // 60 second cooldown
        toast.success("Verification code sent to your email!")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to send verification email")
      }
    } catch (error) {
      console.error("Error sending verification email:", error)
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/vendor-verification/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          contact: currentEmail, 
          otp: otp,
          channelType: "EMAIL"
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setVerified(true)
        toast.success("Email verified successfully!")
        onVerificationComplete(data.token)
      } else {
        const error = await response.json()
        toast.error(error.error || "Invalid verification code")
        setOtp("") // Clear invalid OTP
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (newEmail: string) => {
    setCurrentEmail(newEmail)
    if (onEmailChange) {
      onEmailChange(newEmail)
    }
    // Reset states when email changes
    setOtpSent(false)
    setVerified(false)
    setOtp("")
  }

  if (verified) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-medium text-green-700">Email Verified</p>
              <p className="text-sm text-green-600">{currentEmail}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <span>Email Verification</span>
        </CardTitle>
        <CardDescription>
          We need to verify your email address before you can continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showEmailInput && (
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={currentEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Enter your email address"
              disabled={loading || otpSent}
            />
          </div>
        )}

        {!otpSent ? (
          <div className="space-y-4">
            {!showEmailInput && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  We'll send a verification code to: <strong>{currentEmail}</strong>
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={sendVerificationEmail} 
              disabled={loading || !currentEmail}
              className="w-full"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Sending...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                We've sent a 6-digit verification code to <strong>{currentEmail}</strong>. 
                Please check your inbox and enter the code below.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-lg tracking-widest"
                disabled={loading}
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={verifyOtp} 
                disabled={loading || otp.length !== 6}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={sendVerificationEmail}
                disabled={loading || resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
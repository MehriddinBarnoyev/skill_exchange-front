"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { register, verifyOtp } from "@/lib/authApi"
import { Loader2 } from "lucide-react"
import { ProfileCompletionModal } from "@/components/ProfileCompletionModal"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [showCompleteProfile, setShowCompleteProfile] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!otpSent) {
        const response = await register({ name, email, password })
        if (response.message === "OTP sent to email") {
          setOtpSent(true)
          setUserId(response.user_id)
          toast({
            title: "OTP Sent",
            description: "Please check your email for the verification code.",
          })
        }
      } else {
        const response = await verifyOtp({ email, otp, user_id: userId || undefined })
        handleSuccessfulRegistration(response)
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessfulRegistration = (response: { token?: string; user_id: string }) => {
    if (response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("userId", response.user_id)
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      })
      // setShowCompleteProfile(true)
    } else {
      setError("Registration failed: No token received")
    }
  }

  const handleProfileComplete = () => {
    setShowCompleteProfile(false)
    router.push(`/profile/${userId}`)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            {otpSent ? "Enter the verification code sent to your email." : "Create a new account to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              {!otpSent && (
                <>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {otpSent && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter verification code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className={error ? "border-red-500" : ""}
                  />
                </div>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {otpSent ? "Verifying..." : "Registering..."}
                </>
              ) : otpSent ? (
                "Verify & Complete Registration"
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
      {showCompleteProfile && userId && (
        <ProfileCompletionModal
          userId={userId}
          onComplete={handleProfileComplete}
          onClose={() => {
            // For registration, we don't want to allow skipping profile completion
            toast({
              title: "Profile Completion Required",
              description: "Please complete your profile to continue.",
              variant: "destructive",
            })
          }}
        />
      )}
    </div>
  )
}


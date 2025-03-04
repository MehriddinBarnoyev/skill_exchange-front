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
import { login, verifyOtp } from "@/lib/authApi"
import { Loader2 } from "lucide-react"
import { ProfileCompletionModal } from "@/components/ProfileCompletionModal"

export default function LoginPage() {
  const [email, setEmail] = useState("")
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
        const response = await login({ email })
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
        handleSuccessfulLogin(response)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessfulLogin = (response: { token?: string; user_id: string; is_profile_complete?: boolean }) => {
    if (response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("userId", response.user_id)
      toast({
        title: "Login Successful",
        description: "You have been successfully logged in.",
      })
      if (response.is_profile_complete === false) {
        setShowCompleteProfile(true)
      } else {
        router.push(`/profile/${response.user_id}`)
      }
    } else {
      setError("Login failed: No token received")
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
          <CardTitle>Login</CardTitle>
          <CardDescription>
            {otpSent ? "Enter the verification code sent to your email." : "Enter your email to log in."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={error ? "border-red-500" : ""}
                  disabled={otpSent}
                />
              </div>

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
                  {otpSent ? "Verifying..." : "Sending OTP..."}
                </>
              ) : otpSent ? (
                "Verify & Login"
              ) : (
                "Request OTP"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
            Forgot Password?
          </Link>
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
      {showCompleteProfile && userId && (
        <ProfileCompletionModal
          userId={userId}
          onComplete={handleProfileComplete}
          onClose={() => {
            setShowCompleteProfile(false)
            router.push(`/profile/${userId}`)
          }}
        />
      )}
    </div>
  )
}


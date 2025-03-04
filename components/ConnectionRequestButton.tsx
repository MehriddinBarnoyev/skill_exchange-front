"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2, UserPlus } from "lucide-react"
import { sendConnectionRequest } from "@/lib/connections"

interface ConnectionRequestButtonProps {
  receiverId: string
  className?: string
}

export function ConnectionRequestButton({ receiverId, className }: ConnectionRequestButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSendRequest = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")

      if (!token || !userId) {
        toast({
          title: "Authentication Error",
          description: "Please log in to send connection requests",
          variant: "destructive",
        })
        return
      }

      await sendConnectionRequest(token, userId, receiverId)

      toast({
        title: "Request Sent",
        description: "Connection request has been sent successfully",
      })
    } catch (error) {
      console.error("Error sending connection request:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send connection request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSendRequest} disabled={isLoading} className={className}>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
      Connect
    </Button>
  )
}


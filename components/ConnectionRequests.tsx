"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Loader2, UserCheck, UserX, Clock } from "lucide-react"
import { getConnectionRequests, respondToConnectionRequest, type ConnectionRequest } from "@/lib/connections"

export function ConnectionRequests() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [respondingTo, setRespondingTo] = useState<string | null>(null)

  useEffect(() => {
    fetchConnectionRequests()
  }, [])

  const fetchConnectionRequests = async () => {
    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")

      if (!token || !userId) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view connection requests",
          variant: "destructive",
        })
        return
      }

      const connectionRequests = await getConnectionRequests(token, userId)
      setRequests(connectionRequests)
    } catch (error) {
      console.error("Failed to fetch connection requests:", error)
      toast({
        title: "Error",
        description: "Failed to load connection requests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRespond = async (requestId: string, action: "accepted" | "rejected") => {
    try {
      setRespondingTo(requestId)
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to respond to connection requests",
          variant: "destructive",
        })
        return
      }

      await respondToConnectionRequest(token, requestId, action)

      // Update the local state to remove the responded request
      setRequests(requests.filter((request) => request.id !== requestId))

      toast({
        title: action === "accepted" ? "Request Accepted" : "Request Rejected",
        description:
          action === "accepted" ? "You are now connected with this user" : "Connection request has been rejected",
      })
    } catch (error) {
      console.error(`Failed to ${action} connection request:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} connection request`,
        variant: "destructive",
      })
    } finally {
      setRespondingTo(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-4">
            <Clock className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No pending connection requests</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={request.sender_profile_picture} alt={request.sender_name} />
                  <AvatarFallback>{request.sender_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{request.sender_name}</h4>
                  <p className="text-sm text-muted-foreground">{request.sender_profession}</p>
                  <p className="text-xs text-muted-foreground">{new Date(request.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleRespond(request.id, "accepted")}
                  disabled={respondingTo === request.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {respondingTo === request.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck className="h-4 w-4 mr-1" />
                  )}
                  Accept
                </Button>
                <Button
                  onClick={() => handleRespond(request.id, "rejected")}
                  disabled={respondingTo === request.id}
                  variant="destructive"
                >
                  {respondingTo === request.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserX className="h-4 w-4 mr-1" />
                  )}
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


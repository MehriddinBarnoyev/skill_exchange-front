"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Users, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Connection } from "@/lib/connectin"

export function ConnectionsList() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")

      if (!token || !userId) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view your connections",
          variant: "destructive",
        })
        return
      }

      const userConnections = await getUserConnections(token, userId)
      setConnections(userConnections)
    } catch (error) {
      console.error("Failed to fetch connections:", error)
      toast({
        title: "Error",
        description: "Failed to load your connections",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (connections.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-4">
            <Users className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">You don't have any connections yet</p>
            <Button asChild className="mt-4">
              <Link href="/skills">Find Users with Skills</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  console.log(connections);
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Connections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((connection) => (
            <Card key={connection.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={connection.connected_user_profile_picture} alt={connection.connected_user_name} />
                    <AvatarFallback>{connection.connected_user_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{connection.id}</h4>
                    <p className="text-sm text-muted-foreground">{connection.connected_user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Connected since {new Date(connection.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/user/${connection.id}`}>View Profile</Link>
                  </Button>
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Messagess
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


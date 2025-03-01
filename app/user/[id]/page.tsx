"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { getUserProfile, type User, type Skill } from "@/lib/userProfile"
import { sendConnectionRequest } from "@/lib/requests"
import { Loader2, UserPlus, MapPin, Calendar, Mail } from "lucide-react"

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const { id } = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile(id as string)
        setUser(userData)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Error fetching user data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  const handleSendConnectionRequest = async () => {
    try {
      setIsSendingRequest(true)
      const token = localStorage.getItem("token")
      const currentUserId = localStorage.getItem("userId")
      if (!token || !currentUserId) {
        toast({
          title: "Authentication Error",
          description: "Please log in to send a connection request.",
          variant: "destructive",
        })
        return
      }
      await sendConnectionRequest(token, currentUserId, id as string)
      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent successfully.",
      })
    } catch (error: any) {
      console.error("Failed to send connection request:", error)
      toast({
        title: "Request Failed",
        description: error.message || "Failed to send connection request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingRequest(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
            <Button className="mt-4" onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) return null

  const isOwnProfile = user.id === localStorage.getItem("userId")
  

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Card className="mb-8 shadow-sm">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-2xl font-bold text-gray-800">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-32 h-32 border-2 border-gray-200">
              <AvatarImage src={user.profile_picture || "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"} alt={user.name} />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {user.location && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {user.location}
                  </Badge>
                )}
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{user.bio || "No bio provided"}</p>
              {!isOwnProfile && (
                <Button
                  onClick={handleSendConnectionRequest}
                  disabled={isSendingRequest}
                  className="bg-gray-700 hover:bg-gray-800"
                >
                  {isSendingRequest ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  {isSendingRequest ? "Sending Request..." : "Send Connection Request"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-sm">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-2xl font-bold text-gray-800">Skills</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {user.skills.length === 0 ? (
            <p className="text-gray-600">This user hasn't added any skills yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.skills.map((skill: Skill) => (
                <Card key={skill.id} className="bg-white shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{skill.name}</h3>
                    <p className="text-gray-600 mb-2">{skill.description}</p>
                    {skill.level && (
                      <Badge variant="secondary" className="text-xs">
                        {skill.level}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


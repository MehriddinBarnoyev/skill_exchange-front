"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ConnectionRequests } from "@/components/ConnectionRequests"
import { ConnectionsList } from "@/components/ConnectionsList"
import { Loader2 } from "lucide-react"

export default function ConnectionsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")

    if (!token || !userId) {
      router.push("/login")
      return
    }

    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Network</h1>

        <Tabs defaultValue="requests">
          <TabsList className="mb-6">
            <TabsTrigger value="requests">Connection Requests</TabsTrigger>
            <TabsTrigger value="connections">Your Connections</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <ConnectionRequests />
          </TabsContent>

          <TabsContent value="connections">
            <ConnectionsList />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  )
}


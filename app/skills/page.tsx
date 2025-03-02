"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getAllSkillsWithUsers, type SkillWithUser } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Search, AlertCircle } from "lucide-react"

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillWithUser[]>([])
  const [filteredSkills, setFilteredSkills] = useState<SkillWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token")
        const userId = localStorage.getItem("userId")
        if (!token || !userId) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view skills.",
            variant: "destructive",
          })
          router.push("/login")
          return
        }
        const fetchedSkills = await getAllSkillsWithUsers(token)
        // Filter out the current user's skills
        const filteredSkills = fetchedSkills.filter((skill) => skill.user_id !== userId)
        setSkills(filteredSkills)
        setFilteredSkills(filteredSkills)
      } catch (error) {
        console.error("Failed to fetch skills:", error)
        toast({
          title: "Error",
          description: "Failed to fetch skills. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkills()
  }, [router])

  useEffect(() => {
    const filtered = skills.filter(
      (skill) =>
        skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.user_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSkills(filtered)
  }, [searchTerm, skills])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSkillClick = (userId: string) => {
    router.push(`/user/${userId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Explore Skills</h1>
      <div className="mb-6 relative">
        <Input
          type="text"
          placeholder="Search skills, descriptions, or users..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-md border-gray-300 focus:border-gray-500 pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      {filteredSkills.length === 0 ? (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Skills Found</h2>
            <p className="text-gray-600">
              {searchTerm
                ? "No skills match your search criteria. Try adjusting your search terms."
                : "There are currently no skills available. Check back later or be the first to add a skill!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <Card
              key={skill.id}
              className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => handleSkillClick(skill.user_id)}
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-700">{skill.skill_name}</CardTitle>
                {skill.level && (
                  <Badge variant="secondary" className="text-xs">
                    {skill.level}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{skill.description}</p>
                <p className="text-sm text-gray-500">
                  by <span className="font-medium">{skill.user_name}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


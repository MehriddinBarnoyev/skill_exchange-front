"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getAllSkillsWithUsers, type SkillWithUser } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillWithUser[]>([])
  const [filteredSkills, setFilteredSkills] = useState<SkillWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view skills.",
            variant: "destructive",
          })
          return
        }
        const fetchedSkills = await getAllSkillsWithUsers(token)
        
        setSkills(fetchedSkills)
        setFilteredSkills(fetchedSkills)
      } catch (error) {
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
  }, [])

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin text-gray-500" />
      </div>
    )
  }

  
  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">All Skills</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-md border-gray-300 focus:border-gray-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <Card key={skill.id} className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700">{skill.skill_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{skill.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>by {skill.user_name}</p>
                <p>Added on: {new Date(skill.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  )
}


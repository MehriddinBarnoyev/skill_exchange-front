"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getAllSkillsWithUsers, type SkillWithUser } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

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
  }, [])

  
  useEffect(() => {
    const filtered = skills.filter(
      (skill) =>
        skill.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSkills(filtered)
  }, [searchTerm, skills])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  if (isLoading) {
    return <div>Loading skills...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Skills</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-md"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <Card key={skill.id}>
            <CardHeader>
              <CardTitle>{skill.skill_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{skill.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>by {skill.user_name}</p>
                <p>Added on: {new Date(skill.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredSkills.length === 0 && (
        <p className="text-center mt-4">No skills found matching your search criteria.</p>
      )}
    </div>
  )
}


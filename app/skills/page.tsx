"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllSkillsWithUsers, type SkillWithUser } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return <div>Loading skills...</div>
  }

console.log(skills);


  const skilll = skills.map((skill) => {
    return {
      id: skill.user_id,
      username: skill.user_name,
      name: skill.skill_name,
      description: skill.description,
      createdAt: skill.created_at,
    } 
    
  });
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Skills</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {skilll.map((skill) => (
          <Card key={skill.id}>
            <CardHeader>
              <CardTitle>{skill.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{skill.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>by {skill.username}</p>
                <p>Added on: {new Date(skill.createdAt).toLocaleDateString()}</p>
              </div>   
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUserSkills, addUserSkill, removeUserSkill } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

interface Skill {
  id: number
  name: string
}

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return
        const userSkills = await getUserSkills(token)
        setSkills(userSkills)
      } catch (err) {
        console.error(err)
        toast({
          title: "Error",
          description: "Failed to fetch skills. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchSkills()
  }, [])

  const handleAddSkill = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      const addedSkill = await addUserSkill(token, newSkill)
      setSkills([...skills, addedSkill])
      setNewSkill("")
      toast({
        title: "Success",
        description: "Skill added successfully.",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveSkill = async (skillId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      await removeUserSkill(token, skillId)
      setSkills(skills.filter((skill) => skill.id !== skillId))
      toast({
        title: "Success",
        description: "Skill removed successfully.",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a new skill" />
          <Button onClick={handleAddSkill}>Add Skill</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
              <span>{skill.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-red-500"
                onClick={() => handleRemoveSkill(skill.id)}
              >
                &times;
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


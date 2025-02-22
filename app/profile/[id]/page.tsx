"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { getUserInfo, updateUserProfile, type User, addSkill, type Skill } from "@/lib/api"

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState({ name: "", description: "" })
  const { id } = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("You must be logged in to view this profile")
          return
        }

        const userData = await getUserInfo(token, id as string)
        setUser(userData)
        setEditedUser(userData)
        setSkills(userData.skills || [])
      } catch (err) {
        setError("Error fetching user data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [id])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editedUser) return

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")

      const updatedUser = await updateUserProfile(token, editedUser)
      setUser(updatedUser)
      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedUser) return
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
  }

  const handleAddSkill = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")

      const addedSkill = await addSkill(token, { ...newSkill, user_id: user!.id })
      setSkills([...skills, addedSkill])
      setNewSkill({ name: "", description: "" })
      toast({
        title: "Skill Added",
        description: "Your new skill has been added successfully.",
      })
    } catch (error) {
      console.error("Failed to add skill:", error)
      toast({
        title: "Add Skill Failed",
        description: "Failed to add your skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!user) return null

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.profilePicture} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input name="name" value={editedUser?.name} onChange={handleChange} placeholder="Name" />
                  <Input name="email" value={editedUser?.email} onChange={handleChange} placeholder="Email" disabled />
                  <Textarea name="bio" value={editedUser?.bio} onChange={handleChange} placeholder="Short bio" />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="mt-2">{user.bio}</p>
                </>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={handleEdit}>Edit Profile</Button>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {skills.map((skill) => (
              <Card key={skill.id}>
                <CardHeader>
                  <CardTitle>{skill.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{skill.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Skill name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            />
            <Textarea
              placeholder="Skill description"
              value={newSkill.description}
              onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
            />
            <Button onClick={handleAddSkill}>Add Skill</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


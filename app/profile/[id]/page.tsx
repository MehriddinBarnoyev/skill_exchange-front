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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  getUserInfo,
  updateUserProfile,
  getUserSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  type User,
  type SkillWithUser,
} from "@/lib/api"

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [skills, setSkills] = useState<SkillWithUser[]>([])
  const [newSkill, setNewSkill] = useState({ name: "", description: "" })
  const [editingSkill, setEditingSkill] = useState<SkillWithUser | null>(null)
  const { id } = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndSkills = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("You must be logged in to view this profile")
          return
        }

        console.log("Fetching user info...")
        const userData = await getUserInfo(token, id as string)
        console.log("User data received:", userData)
        setUser(userData)
        setEditedUser(userData)

        console.log("Fetching user skills...")
        const userSkills = await getUserSkills(token, id as string)
        console.log("User skills received:", userSkills)
        setSkills(userSkills)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Error fetching user data. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndSkills()
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
    if (!newSkill.name.trim() || !newSkill.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Skill name and description are required.",
        variant: "destructive",
      })
      return
    }

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

  const handleEditSkill = (skill: SkillWithUser) => {
    setEditingSkill(skill)
  }

  const handleUpdateSkill = async () => {
    if (!editingSkill) return

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")

      const updatedSkill = await updateSkill(token, editingSkill.id, editingSkill)
      setSkills(skills.map((s) => (s.id === updatedSkill.id ? updatedSkill : s)))
      setEditingSkill(null)
      toast({
        title: "Skill Updated",
        description: "Your skill has been successfully updated.",
      })
    } catch (error) {
      console.error("Failed to update skill:", error)
      toast({
        title: "Update Skill Failed",
        description: "Failed to update your skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")

      await deleteSkill(token, skillId)
      setSkills(skills.filter((s) => s.id !== skillId))
      toast({
        title: "Skill Deleted",
        description: "Your skill has been successfully deleted.",
      })
    } catch (error) {
      console.error("Failed to delete skill:", error)
      toast({
        title: "Delete Skill Failed",
        description: "Failed to delete your skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
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

  const isOwnProfile = user.id === id

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
          {isOwnProfile &&
            (isEditing ? (
              <div className="space-x-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={handleEdit}>Edit Profile</Button>
            ))}
        </CardContent>
      </Card>

      {isOwnProfile && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">My Skills</CardTitle>
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
                    <div className="mt-2 space-x-2">
                      <Button onClick={() => handleEditSkill(skill)}>Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your skill.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteSkill(skill.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
      )}

      <AlertDialog open={!!editingSkill} onOpenChange={() => setEditingSkill(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Skill</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Skill name"
              value={editingSkill?.name}
              onChange={(e) => setEditingSkill({ ...editingSkill!, name: e.target.value })}
            />
            <Textarea
              placeholder="Skill description"
              value={editingSkill?.description}
              onChange={(e) => setEditingSkill({ ...editingSkill!, description: e.target.value })}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateSkill}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
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
} from "@/components/ui/alert-dialog";
import {
  getUserInfo,
  updateUserProfile,
  getUserSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  type User,
  type Skill,
} from "@/lib/api";
import { PlusCircle, Loader2 } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", description: "" });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isSkillLoading, setIsSkillLoading] = useState(false);
  const [isShowingSkills, setIsShowingSkills] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view this profile");
          return;
        }

        const userData = await getUserInfo(token, id as string);
        setUser(userData);
        setEditedUser(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error fetching user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const fetchSkills = async () => {
    setIsSkillLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) throw new Error("No token found or user not loaded");

      const userSkills = await getUserSkills(token, user.id);
      const skillsU = userSkills.skills || [];
      setSkills(skillsU || []);
      console.log("User skills:", skillsU);

      if (!skillsU || skillsU.length === 0) {
        setIsAddingSkill(true); // Skill qo'shuvchi formni avtomatik ochish
      }

      setIsShowingSkills(true);
    } catch (error) {
      console.error("xato to fetch skills:", error);
      toast({
        title: "Error",
        description: "Failed to fetch skills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSkillLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editedUser) return;

    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    if (!editedUser) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await updateUserProfile(token, editedUser);
      setUser(editedUser);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim() || !newSkill.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Skill name and description are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSkillLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) throw new Error("No token found or user not loaded");

      const addedSkill = await addSkill(token, user.id, newSkill);
      setSkills([...skills, addedSkill]);
      setNewSkill({ name: "", description: "" });
      setIsAddingSkill(false);
      toast({
        title: "Skill Added",
        description: "Your new skill has been added successfully.",
      });
    } catch (error) {
      console.error("Failed to add skill:", error);
      toast({
        title: "Add Skill Failed",
        description: "Failed to add your skill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSkillLoading(false);
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
  };

  const handleUpdateSkill = async () => {
    if (!editingSkill) return;

    setIsSkillLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const updatedSkill = await updateSkill(token, editingSkill.id, {
        skill_name: editingSkill.skill_name,
        description: editingSkill.description,
      });
      setSkills(
        skills.map((s) => (s.id === updatedSkill.id ? updatedSkill : s))
      );
      setEditingSkill(null);
      toast({
        title: "Skill Updated",
        description: "Your skill has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update skill:", error);
      toast({
        title: "Update Skill Failed",
        description: "Failed to update your skill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSkillLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    setIsSkillLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await deleteSkill(token, skillId);
      setSkills(skills.filter((s) => s.id !== skillId));
      toast({
        title: "Skill Deleted",
        description: "Your skill has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete skill:", error);
      toast({
        title: "Delete Skill Failed",
        description: "Failed to delete your skill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSkillLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin text-gray-500" />
      </div>
    );
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
    );
  }

  if (!user) return null;

  const isOwnProfile = user.id === id;


  console.log(user);
  console.log(newSkill);
  
  

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Card className="mb-8 shadow-sm">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Profile Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-24 h-24 border-2 border-gray-200">
              <AvatarImage src={user.profilePicture} alt={user.name} />
              <AvatarFallback className="bg-gray-200 text-gray-600">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    name="name"
                    value={editedUser?.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="border-gray-300 focus:border-gray-500"
                  />
                  <Input
                    name="email"
                    value={editedUser?.email}
                    onChange={handleChange}
                    placeholder="Email"
                    disabled
                    className="bg-gray-100"
                  />
                  <Textarea
                    name="bio"
                    value={editedUser?.bio}
                    onChange={handleChange}
                    placeholder="Short bio"
                    className="border-gray-300 focus:border-gray-500"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.name}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="mt-2 text-gray-700">{user.bio}</p>
                </>
              )}
            </div>
          </div>
          {isOwnProfile &&
            (isEditing ? (
              <div className="space-x-2">
                <Button
                  onClick={handleSave}
                  className="bg-gray-700 hover:bg-gray-800"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="text-gray-700 border-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleEdit}
                className="bg-gray-700 hover:bg-gray-800"
              >
                Edit Profile
              </Button>
            ))}
        </CardContent>
      </Card>

      {isOwnProfile && (
        <Card className="mb-8 shadow-sm">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-800">
              My Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!isShowingSkills ? (
              <Button
                onClick={fetchSkills}
                disabled={isSkillLoading}
                className="bg-gray-700 hover:bg-gray-800"
              >
                {isSkillLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Show My Skills
              </Button>
            ) : skills.length === 0 ? (
              <p className="text-gray-600">
                You haven't added any skills yet. Add your first skill to get
                started!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                
                {skills.map((skill) => (
                  <Card key={skill.id} className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-700">
                        {skill.skill_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{skill.description}</p>
                      <div className="mt-2 space-x-2">
                        <Button
                          onClick={() => handleEditSkill(skill)}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your skill.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSkill(skill.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {isShowingSkills && (
              <div className="mt-4">
                <Button
                  onClick={() => setIsAddingSkill(true)}
                  className="bg-gray-700 hover:bg-gray-800"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Skill
                </Button>
              </div>
            )}
            {isAddingSkill && (
              <div className="space-y-2 mt-4">
                <Input
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, name: e.target.value })
                  }
                  className="border-gray-300 focus:border-gray-500"
                />
                <Textarea
                  placeholder="Skill description"
                  value={newSkill.description}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, description: e.target.value })
                  }
                  className="border-gray-300 focus:border-gray-500"
                />
                <div className="space-x-2">
                  <Button
                    onClick={handleAddSkill}
                    disabled={isSkillLoading}
                    className="bg-gray-700 hover:bg-gray-800"
                  >
                    {isSkillLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="mr-2 h-4 w-4" />
                    )}
                    Add Skill
                  </Button>
                  <Button
                    onClick={() => setIsAddingSkill(false)}
                    variant="outline"
                    className="text-gray-700 border-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={!!editingSkill}
        onOpenChange={() => setEditingSkill(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Skill</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Skill name"
              value={editingSkill?.skill_name}
              onChange={(e) =>
                setEditingSkill({ ...editingSkill!, skill_name: e.target.value })
              }
              className="border-gray-300 focus:border-gray-500"
            />
            <Textarea
              placeholder="Skill description"
              value={editingSkill?.description}
              onChange={(e) =>
                setEditingSkill({
                  ...editingSkill!,
                  description: e.target.value,
                })
              }
              className="border-gray-300 focus:border-gray-500"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdateSkill}
              disabled={isSkillLoading}
            >
              {isSkillLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

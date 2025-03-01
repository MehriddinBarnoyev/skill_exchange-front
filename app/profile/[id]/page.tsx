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
  getUserInfo,
  updateUserProfile,
  getUserSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  type User,
  type Skill,
} from "@/lib/api";
import { ConnectionRequests } from "@/components/ConnectionRequests";
import { PlusCircle, Loader2, Pencil, Trash2 } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({
    name: "",
    description: "",
    level: "",
  });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isSkillLoading, setIsSkillLoading] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view this profile");
          return;
        }

        const userData = await getUserInfo(token, id as string);
        setUser(userData);
        setEditedUser(userData);

        const userSkills = await getUserSkills(token, id as string);
        setSkills(userSkills.skills || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error fetching user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedUser) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const updatedUser = await updateUserProfile(token, editedUser);
      setUser(updatedUser);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editedUser) return;
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleAddSkill = async () => {
    setIsSkillLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const addedSkill = await addSkill(token, id as string, newSkill);
      setSkills([...skills, addedSkill]);
      setNewSkill({ name: "", description: "", level: "" });
      setIsAddingSkill(false);
      toast({
        title: "Skill Added",
        description: "Your new skill has been added successfully.",
      });
    } catch (error) {
      console.error("Failed to add skill:", error);
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSkillLoading(false);
    }
  };

  const handleUpdateSkill = async (skill: Skill) => {
    setIsSkillLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const updatedSkill = await updateSkill(token, skill.id, skill);
      setSkills(
        skills.map((s) => (s.id === updatedSkill.id ? updatedSkill : s))
      );
      setEditingSkill(null);
      toast({
        title: "Skill Updated",
        description: "Your skill has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update skill:", error);
      toast({
        title: "Error",
        description: "Failed to update skill. Please try again.",
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
      if (!token) return;

      await deleteSkill(token, skillId);
      setSkills(skills.filter((s) => s.id !== skillId));
      toast({
        title: "Skill Deleted",
        description: "Your skill has been deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete skill:", error);
      toast({
        title: "Error",
        description: "Failed to delete skill. Please try again.",
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

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.profilePicture} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    name="name"
                    value={editedUser?.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <Input
                    name="email"
                    value={editedUser?.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <Textarea
                    name="bio"
                    value={editedUser?.bio}
                    onChange={handleChange}
                    placeholder="Short bio"
                  />
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
            isOwnProfile && <Button onClick={handleEdit}>Edit Profile</Button>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {isOwnProfile && (
            <Button onClick={() => setIsAddingSkill(true)} className="mb-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          )}
          {isAddingSkill && (
            <div className="mb-4 p-4 border rounded">
              <Input
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                placeholder="Skill name"
                className="mb-2"
              />
              <Input
                value={newSkill.description}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, description: e.target.value })
                }
                placeholder="Description"
                className="mb-2"
              />
              <select
                value={newSkill.level}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, level: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <Button onClick={handleAddSkill} disabled={isSkillLoading}>
                {isSkillLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Add Skill"
                )}
              </Button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <Card key={skill.id} className="bg-white shadow-sm">
                <CardContent className="p-4">
                  {editingSkill?.id === skill.id ? (
                    <>
                      <Input
                        value={editingSkill.name}
                        onChange={(e) =>
                          setEditingSkill({
                            ...editingSkill,
                            name: e.target.value,
                          })
                        }
                        className="mb-2"
                      />
                      <Input
                        value={editingSkill.description}
                        onChange={(e) =>
                          setEditingSkill({
                            ...editingSkill,
                            description: e.target.value,
                          })
                        }
                        className="mb-2"
                      />
                      <select
                        value={editingSkill.level}
                        onChange={(e) =>
                          setEditingSkill({
                            ...editingSkill,
                            level: e.target.value as
                              | "beginner"
                              | "intermediate"
                              | "advanced",
                          })
                        }
                        className="w-full p-2 border rounded mb-2"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                      <Button
                        onClick={() => handleUpdateSkill(editingSkill)}
                        disabled={isSkillLoading}
                        className="mr-2"
                      >
                        {isSkillLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingSkill(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-lg mb-2">
                        {skill.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{skill.description}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        Level: {skill.level}
                      </p>
                      {isOwnProfile && (
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingSkill(skill)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSkill(skill.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {isOwnProfile && <ConnectionRequests />}
    </div>
  );
}

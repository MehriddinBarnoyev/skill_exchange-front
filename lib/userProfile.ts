import axios from "axios"

const API_URL = "http://localhost:5000/api"

export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  createdAt: string | number | Date
  id: string
  name: string
  bio: string | null
  profile_picture: string | null
  location: string | null
  skills: UserSkill[]
  email: string
}

export interface UserSkill {
  id: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
}

export interface Skill {
  id: string
  name: string
  description: string
  level?: string

}

export interface SkillWithUser extends Skill {
  user_id: string
  username: string
  createdAt: string
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function getUserProfile(id: string): Promise<User> {
  try {
    const response = await api.get<User>(`/userProfiles/${id}`)
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch user profile!"
    throw new Error(errorMessage)
  }
}

// Since skills are now included in the user profile response,
// we don't need a separate getUserSkills function
export async function sendConnectionRequest(fromUserId: string, toUserId: string): Promise<void> {
  try {
    await api.post("/connections/request", { fromUserId, toUserId })
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to send connection request!"
    throw new Error(errorMessage)
  }
}


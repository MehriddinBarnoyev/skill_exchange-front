import axios from "axios"

const API_URL = "http://localhost:5000/api"

export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  id: string
  name: string
  email: string
  bio: string
  profilePicture: string
  skills?: Skill[]
}

export interface Match {
  user1_id: string
  user2_id: string
  skill_id: string
  status: "Pending" | "Accepted" | "Rejected"
}

export interface Skill {
  id: string
  user_id: string
  name: string
  description: string
}

export interface SkillWithUser extends Skill {
  user_id: string
  user_name: string
  skill_id: string
  skill_name: string
  created_at: string
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
    })
    console.log("Registration Response:", response.data)
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Registration failed!"
    throw new Error(errorMessage)
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    })
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Login failed!"
    throw new Error(errorMessage)
  }
}

export async function getUserInfo(token: string, userId: string): Promise<User> {
  try {
    console.log(`Fetching user info for userId: ${userId}`)
    console.log(`Using token: ${token.substring(0, 10)}...`) // Log part of the token for debugging

    const response = await api.get<User>(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("User info response:", response.data)
    return response.data
  } catch (error: any) {
    console.error("Error in getUserInfo:", error.response || error)
    const errorMessage = error.response?.data?.message || "Failed to fetch user!"
    throw new Error(errorMessage)
  }
}

export async function updateUserProfile(token: string, userData: User): Promise<User> {
  try {
    const response = await api.put(`/users/${userData.id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update user profile")
  }
}

export async function getAllSkills(token: string): Promise<SkillWithUser[]> {
  try {
    const response = await api.get<SkillWithUser[]>("/skills", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch all skills")
  }
}

export async function getMySkills(token: string): Promise<SkillWithUser[]> {
  try {
    const response = await api.get<Skill[]>("/skills", {
      headers: { Authorization: `Bearer ${token}` },
    })

    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch skills")
  }
}

export async function getUserSkills(token: string, userId: string): Promise<Skill[]> {
  try {
    const response = await api.get<{ success: boolean; skills: Skill[] }>(`/skills/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.skills
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch user skills")
  }
}

export async function getSkillById(token: string, skillId: string): Promise<Skill> {
  try {
    const response = await api.get<Skill>(`/skills/${skillId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch skill")
  }
}

export async function addSkill(token: string, userId: string, skill: Omit<Skill, "id" | "user_id">): Promise<Skill> {
  try {
    const response = await api.post<{ success: boolean; skill: Skill }>(`/skills/addskill/${userId}`, skill, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.skill
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add skill")
  }
}

export async function updateSkill(token: string, skillId: string, skill: Partial<Skill>): Promise<Skill> {
  try {
    const response = await api.put<Skill>(`/skills/${skillId}`, skill, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update skill")
  }
}

export async function deleteSkill(token: string, skillId: string): Promise<Skill> {
  try {
    const response = await api.delete<Skill>(`/skills/${skillId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete skill")
  }
}

export async function getUserMatches(token: string): Promise<
  {
    id: number
    partnerId: string
    partnerName: string
    status: "Pending" | "Accepted" | "Rejected"
  }[]
> {
  try {
    const response = await api.get<Match[]>("/users/matches", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.map((match, index) => ({
      id: index + 1,
      partnerId: match.user1_id,
      partnerName: `User ${match.user1_id}`,
      status: match.status,
    }))
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch user matches!"
    throw new Error(errorMessage)
  }
}


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
    const response = await api.get<User>(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch user!"
    throw new Error(errorMessage)
  }
}

export async function updateUserProfile(token: string, user: User): Promise<User> {
  try {
    const response = await api.put<User>("/users/profile", user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update user profile!"
    throw new Error(errorMessage)
  }
}

export async function getAllSkills(token: string): Promise<Skill[]> {
  try {
    const response = await api.get<Skill[]>("/skills", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch skills")
  }
}

export interface SkillWithUser extends Skill {
  skill_name: string
  user_name: string
  created_at: string
  description: string
  user_id: string
}

export async function getAllSkillsWithUsers(token: string): Promise<SkillWithUser[]> {
  try {
    const response = await api.get<SkillWithUser[]>("/skills", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch skills with users")
  }
}

export async function addSkill(token: string, skill: Omit<Skill, "id">): Promise<Skill> {
  try {
    const response = await api.post<Skill>("/skills", skill, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add skill")
  }
}

export async function updateSkill(token: string, id: string, skill: Partial<Skill>): Promise<Skill> {
  try {
    const response = await api.put<Skill>(`/skills/${id}`, skill, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update skill")
  }
}

export async function deleteSkill(token: string, id: string): Promise<void> {
  try {
    await api.delete(`/skills/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
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


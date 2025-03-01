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
}

interface Skill {
  id: string
  name: string
  description: string
  level?: string
}

export interface SkillWithUser extends Skill {
  skill_name: string
  user_id: string
  user_name: string
  created_at: string
  level: string
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

export async function getUserSkills(token: string, userId: string): Promise<Skill[]> {
  try {
    const response = await api.get<Skill[]>(`/skills/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log(userId);
    console.log(response.data);
    
    
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch user skills")
  }
}

export async function addSkill(
  token: string,
  userId: string,
  skill: { name: string; description: string, level: string },
): Promise<Skill> {
  try {
    const response = await api.post<Skill>(
      `/skills/addskill/${userId}`,
      { ...skill},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    console.log("response", response.data);
    
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add skill")
  }
}

export async function updateSkill(token: string, skillId: string, skill: Partial<Skill>): Promise<Skill> {
  try {
    const response = await api.put<Skill>(`/skills/${skillId}`, skill, {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log(skillId, skill);
    
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update skill")
  }
}

export async function deleteSkill(token: string, skillId: string): Promise<void> {
  try {
    await api.delete(`/skills/${skillId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete skill")
  }
}

export async function getAllSkillsWithUsers(token: string): Promise<SkillWithUser[]> {
  try {
    const response = await api.get<SkillWithUser[]>("/skills", {
      headers: { Authorization: `Bearer ${token}` },
    })
    
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch all skills with users")
  }
}
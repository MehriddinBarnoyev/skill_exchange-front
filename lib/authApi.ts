import axios, { type AxiosError } from "axios"

const API_URL = "http://localhost:5000/api"

export interface AuthResponse {
  message: string
  token?: string
  user_id: string
  is_profile_complete?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  is_profile_complete: boolean
}

interface RegisterInput {
  name: string
  email: string
  password: string
  otp?: string
}

interface LoginInput {
  email: string
  otp?: string
}

interface VerifyOtpInput {
  email: string
  otp: string
  user_id?: string
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function register(input: RegisterInput): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/register", input)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>
      throw new Error(axiosError.response?.data?.error || "Registration failed!")
    }
    throw new Error("An unexpected error occurred during registration")
  }
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/login", input)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>
      if (axiosError.response?.status === 404) {
        throw new Error("User not found")
      } else if (axiosError.response?.status === 400) {
        throw new Error(axiosError.response.data?.error || "Invalid input")
      }
      throw new Error(axiosError.response?.data?.error || "Login failed")
    }
    throw new Error("An unexpected error occurred during login")
  }
}

export async function verifyOtp(input: VerifyOtpInput): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/verify-otp", input)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>
      if (axiosError.response?.status === 404) {
        throw new Error("User not found")
      } else if (axiosError.response?.status === 401) {
        throw new Error("Invalid or expired OTP")
      }
      throw new Error(axiosError.response?.data?.error || "OTP verification failed")
    }
    throw new Error("An unexpected error occurred during OTP verification")
  }
}


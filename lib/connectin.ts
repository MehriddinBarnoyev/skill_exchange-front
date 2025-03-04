import axios from "axios"

const API_URL = "http://localhost:5000/api"

export interface ConnectionRequest {
  id: string
  sender_id: string
  receiver_id: string
  status: "pending" | "accepted" | "rejected"
  created_at: string
  sender_name: string
  sender_profile_picture: string
  sender_profession: string
}

export interface Connection {
  id: string
  connected_user_id: string
  connected_user_name: string
  connected_user_profile_picture: string
  connected_user_profession: string
  status: "accepted"
  created_at: string
}

/**
 * Get all pending connection requests for a user
 */
export async function getConnectionRequests(token: string, userId: string): Promise<ConnectionRequest[]> {
  try {
    const response = await axios.get<ConnectionRequest[]>(`${API_URL}/connections/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    console.error("Error fetching connection requests:", error)
    throw new Error(error.response?.data?.error || "Failed to fetch connection requests")
  }
}

/**
 * Send a connection request to another user
 */
export async function sendConnectionRequest(
  token: string,
  senderId: string,
  receiverId: string,
): Promise<{ message: string }> {
  try {
    const response = await axios.post(
      `${API_URL}/connections/request`,
      { sender_id: senderId, receiver_id: receiverId },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return { message: "Connection request sent successfully" }
  } catch (error: any) {
    console.error("Error sending connection request:", error)
    throw new Error(error.response?.data?.error || "Failed to send connection request")
  }
}

/**
 * Respond to a connection request (accept or reject)
 */
export async function respondToConnectionRequest(
  token: string,
  requestId: string,
  action: "accepted" | "rejected",
): Promise<{ message: string }> {
  try {
    const response = await axios.put(
      `${API_URL}/connections/respond`,
      { request_id: requestId, action },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return {
      message: action === "accepted" ? "Connection request accepted" : "Connection request rejected",
    }
  } catch (error: any) {
    console.error("Error responding to connection request:", error)
    throw new Error(error.response?.data?.error || "Failed to respond to connection request")
  }
}

/**
 * Get all accepted connections for a user
 */
export async function getUserConnections(token: string, userId: string): Promise<Connection[]> {
  try {
    const response = await axios.get<Connection[]>(`${API_URL}/connections/accepted/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    console.error("Error fetching connections:", error)
    throw new Error(error.response?.data?.error || "Failed to fetch connections")
  }
}


import { getAuthHeaders } from "../utils/auth"

export type AccountStatus = "active" | "suspended"

export type ManagedUser = {
  id: string
  username: string
  email: string
  fish: number
  points: number
  completedChallenges: number
  flagsSubmitted: number
  accountStatus: AccountStatus
  isOnline: boolean
  createdAt: string | null
  lastActiveAt: string | null
}

let apiUrl = ""

async function getApiUrl() {
  if (apiUrl) return apiUrl
  const response = await fetch("/config.json")
  if (!response.ok) throw new Error("โหลด config.json ไม่สำเร็จ")
  const config = await response.json()
  if (!config.ALB_URL) throw new Error("ไม่พบ ALB_URL ใน config.json")
  apiUrl = config.ALB_URL
  return apiUrl
}

async function readJson(response: Response) {
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "เกิดข้อผิดพลาดจากระบบ")
  return data
}

export async function getUsers(): Promise<ManagedUser[]> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=list_users&t=${Date.now()}`, {
    headers: await getAuthHeaders(false),
  })
  const data = await readJson(response)
  return data.users ?? []
}

export async function heartbeat() {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=heartbeat`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({}),
  })
  return readJson(response)
}

export async function suspendUser(user: ManagedUser) {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=suspend_user`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ email: user.email }),
  })
  return readJson(response)
}

export async function unsuspendUser(user: ManagedUser) {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=unsuspend_user`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ email: user.email }),
  })
  return readJson(response)
}

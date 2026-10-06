import { getAuthHeaders } from "../utils/auth"
import type { StoryConfig } from "../types/story"

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

export async function getStory(): Promise<StoryConfig | null> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=get_story&t=${Date.now()}`)
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "โหลด Story ไม่สำเร็จ")
  return data.story ?? null
}

export async function getAdminStory(): Promise<StoryConfig | null> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=get_admin_story&t=${Date.now()}`, {
    headers: await getAuthHeaders(false),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "โหลด Story ไม่สำเร็จ")
  return data.story ?? null
}

export async function saveStory(story: Omit<StoryConfig, "storyId" | "updatedAt">): Promise<StoryConfig> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=save_story`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(story),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "บันทึก Story ไม่สำเร็จ")
  return data.story
}

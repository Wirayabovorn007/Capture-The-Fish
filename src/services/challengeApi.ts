import type {
  Challenge,
  ChallengeStatusResponse,
  SpawnChallengeResponse,
  SubmitFlagResponse,
} from "../types/challenge"

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
  if (!response.ok) {
    throw new Error(data.error || "เกิดข้อผิดพลาดจากระบบ")
  }
  return data
}

export async function getChallenges(): Promise<Challenge[]> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=list_challenges&t=${Date.now()}`)
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "โหลด Challenge ไม่สำเร็จ")
  return data.challenges ?? []
}

export async function getChallenge(challengeId: string): Promise<Challenge> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=get_challenge&challengeId=${encodeURIComponent(challengeId)}`)
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "โหลด Challenge ไม่สำเร็จ")
  return data.challenge
}

export async function createChallenge(challenge: Challenge) {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=create_challenge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(challenge),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "สร้าง Challenge ไม่สำเร็จ")
  return data.challenge
}

export async function updateChallenge(challenge: Challenge) {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=update_challenge`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(challenge),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "แก้ไข Challenge ไม่สำเร็จ")
  return data.challenge
}

export async function deleteChallenge(challengeId: string) {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=delete_challenge&challengeId=${encodeURIComponent(challengeId)}`, { method: "DELETE" })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "ลบ Challenge ไม่สำเร็จ")
}

export async function spawnChallenge(challengeId: string): Promise<SpawnChallengeResponse> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=spawn&challengeId=${encodeURIComponent(challengeId)}`, { method: "POST" })
  const data = await readJson(response)
  if (!data.taskArn) throw new Error(data.error || "ไม่สามารถเริ่ม Challenge ได้")
  return { status: data.status, taskArn: data.taskArn }
}

export async function getChallengeStatus(challengeId: string, taskArn: string): Promise<ChallengeStatusResponse> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=status&challengeId=${encodeURIComponent(challengeId)}&taskArn=${encodeURIComponent(taskArn)}&t=${Date.now()}`)
  const data = await readJson(response)
  return {
    status: data.status ?? "UNKNOWN",
    domain: data.domain ?? null,
    containers: data.containers ?? [],
    reason: data.reason,
  }
}

export async function terminateChallenge(taskArn: string) {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=terminate&taskArn=${encodeURIComponent(taskArn)}`, { method: "POST" })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "ไม่สามารถหยุด Challenge ได้")
}

export async function submitFlag(challengeId: string, flag: string): Promise<SubmitFlagResponse> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=submit_flag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId, flag }),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "ไม่สามารถตรวจสอบ Flag ได้")
  return { correct: Boolean(data.correct) }
}

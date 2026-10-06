import { getAuthHeaders } from "../utils/auth"
import type {
  Challenge,
  ChallengeStatusResponse,
  SpawnChallengeResponse,
  SubmitFlagResponse,
  ActiveChallengeResponse,
  ExtendChallengeResponse,
  Fish,
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


export async function getFishes(): Promise<Fish[]> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=list_fishes&t=${Date.now()}`, {
    headers: await getAuthHeaders(false),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "โหลดรายการปลาไม่สำเร็จ")
  return data.fishes ?? []
}

export async function getChallenges(): Promise<Challenge[]> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=list_challenges&t=${Date.now()}`)
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "โหลด Challenge ไม่สำเร็จ")
  return data.challenges ?? []
}

export async function getAdminChallenges(): Promise<Challenge[]> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=list_admin_challenges&t=${Date.now()}`, {
    headers: await getAuthHeaders(false),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "โหลด Challenge สำหรับ Admin ไม่สำเร็จ")
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
    headers: await getAuthHeaders(),
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
    headers: await getAuthHeaders(),
    body: JSON.stringify(challenge),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "แก้ไข Challenge ไม่สำเร็จ")
  return data.challenge
}

export async function deleteChallenge(challengeId: string) {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=delete_challenge&challengeId=${encodeURIComponent(challengeId)}`, { method: "DELETE", headers: await getAuthHeaders(false) })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "ลบ Challenge ไม่สำเร็จ")
}

export type BulkChallengeAction = "delete" | "set_status"

export async function importChallenges(challenges: unknown[]) {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=import_challenges`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ challenges }),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "Import Challenge ไม่สำเร็จ")
  return data as {
    status: "SUCCESS"
    created: number
    skipped: number
    failed: number
    results: { challengeId?: string; title?: string; status: "created" | "skipped" | "failed"; error?: string }[]
  }
}

export async function bulkChallengeAction(
  challengeIds: string[],
  bulkAction: BulkChallengeAction,
  status?: "draft" | "published" | "hidden",
) {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=bulk_challenge_action`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ challengeIds, bulkAction, status }),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "ดำเนินการหลาย Challenge ไม่สำเร็จ")
  return data
}

export async function spawnChallenge(challengeId: string): Promise<SpawnChallengeResponse> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=spawn&challengeId=${encodeURIComponent(challengeId)}`, { method: "POST", headers: await getAuthHeaders(false) })
  const data = await readJson(response)
  if (!data.sessionId) throw new Error(data.error || "ไม่สามารถเริ่ม Challenge ได้")
  return {
    status: data.status,
    sessionId: data.sessionId,
    expiresAt: data.expiresAt == null ? undefined : Number(data.expiresAt),
    terminateAt: data.terminateAt == null ? undefined : Number(data.terminateAt),
    serverNow: data.serverNow == null ? undefined : Number(data.serverNow),
    timerState: data.timerState,
  }
}

export async function getChallengeStatus(challengeId: string, sessionId: string): Promise<ChallengeStatusResponse> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=status&challengeId=${encodeURIComponent(challengeId)}&sessionId=${encodeURIComponent(sessionId)}&t=${Date.now()}`, { headers: await getAuthHeaders(false) })
  const data = await readJson(response)
  return {
    status: data.status ?? "UNKNOWN",
    sessionId: data.sessionId ?? sessionId,
    containers: data.containers ?? [],
    reason: data.reason,
    expiresAt: data.expiresAt == null ? undefined : Number(data.expiresAt),
    terminateAt: data.terminateAt == null ? undefined : Number(data.terminateAt),
    serverNow: data.serverNow == null ? undefined : Number(data.serverNow),
    timerState: data.timerState,
  }
}

export async function terminateChallenge(sessionId: string) {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=terminate&sessionId=${encodeURIComponent(sessionId)}`, { method: "POST", headers: await getAuthHeaders(false) })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "ไม่สามารถหยุด Challenge ได้")
}

export async function submitFlag(challengeId: string, flag: string): Promise<SubmitFlagResponse> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=submit_flag`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ challengeId, flag }),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "ไม่สามารถตรวจสอบ Flag ได้")
  return {
    correct: Boolean(data.correct),
    firstSolve: Boolean(data.firstSolve),
    reward: data.reward ?? null,
    totalFish: Number(data.totalFish ?? 0),
  }
}

export async function getActiveChallenge(challengeId: string): Promise<ActiveChallengeResponse> {
  const baseUrl = await getApiUrl()

  const response = await fetch(
    `${baseUrl}/?action=active&challengeId=${encodeURIComponent(challengeId)}&t=${Date.now()}`,
    { headers: await getAuthHeaders(false) }
  )

  const data = await readJson(response)

  return {
    status: data.status ?? "SUCCESS",
    hasActive: Boolean(data.hasActive),
    sessionId: data.sessionId as string | undefined,
    expiresAt: data.expiresAt == null ? undefined : Number(data.expiresAt),
    terminateAt: data.terminateAt == null ? undefined : Number(data.terminateAt),
    serverNow: data.serverNow == null ? undefined : Number(data.serverNow),
    timerState: data.timerState,
  }
}

export async function extendChallenge(sessionId: string): Promise<ExtendChallengeResponse> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=extend_session&sessionId=${encodeURIComponent(sessionId)}`, {
    method: "POST",
    headers: await getAuthHeaders(false),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "ไม่สามารถต่อเวลา Lab ได้")
  return {
    status: data.status,
    sessionId: data.sessionId,
    expiresAt: Number(data.expiresAt),
    terminateAt: Number(data.terminateAt),
    serverNow: Number(data.serverNow),
    timerState: data.timerState,
  }
}

export async function uploadFishImage(
  file: File,
): Promise<string> {
  const baseUrl = await getApiUrl()

  const response = await fetch(
    `${baseUrl}/?action=upload_fish_image`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
      }),
    },
  )

  const data = await readJson(response)

  if (data.status !== "SUCCESS") {
    throw new Error(
      data.error || "ไม่สามารถอัปโหลดรูปปลาได้",
    )
  }

  const uploadResponse = await fetch(
    data.uploadUrl,
    {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    },
  )

  if (!uploadResponse.ok) {
    throw new Error(
      "ไม่สามารถอัปโหลดรูปปลาไปยัง S3 ได้",
    )
  }

  return data.imageUrl
}

export async function uploadChallengeThumbnail(file: File): Promise<string> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=upload_challenge_thumbnail`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ fileName: file.name, contentType: file.type }),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "ไม่สามารถอัปโหลด Thumbnail ได้")

  const uploadResponse = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  })
  if (!uploadResponse.ok) throw new Error("ไม่สามารถอัปโหลด Thumbnail ไปยัง S3 ได้")
  return data.imageUrl
}

export async function uploadChallengeFile(file: File): Promise<{ fileName: string; fileUrl: string; contentType: string }> {
  const baseUrl = await getApiUrl()
  const contentType = file.type || "application/octet-stream"
  const response = await fetch(`${baseUrl}/?action=upload_challenge_file`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ fileName: file.name, contentType }),
  })
  const data = await readJson(response)
  if (data.status !== "SUCCESS") throw new Error(data.error || "ไม่สามารถเตรียมการอัปโหลดไฟล์ Challenge ได้")

  const uploadResponse = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  })
  if (!uploadResponse.ok) throw new Error("ไม่สามารถอัปโหลดไฟล์ Challenge ไปยัง S3 ได้")
  return { fileName: file.name, fileUrl: data.fileUrl, contentType }
}

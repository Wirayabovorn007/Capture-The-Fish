import type { Challenge } from "../types/challenge"

let apiUrl = ""

async function getApiUrl() {
  if (apiUrl) return apiUrl

  const response = await fetch("/config.json")

  if (!response.ok) {
    throw new Error("โหลด config.json ไม่สำเร็จ")
  }

  const config = await response.json()

  if (!config.ALB_URL) {
    throw new Error("ไม่พบ ALB_URL ใน config.json")
  }

  apiUrl = config.ALB_URL

  return apiUrl
}


// ================================
// GET ALL
// ================================

export async function getChallenges(): Promise<Challenge[]> {

  const baseUrl = await getApiUrl()

  const response = await fetch(
    `${baseUrl}/?action=list_challenges&t=${Date.now()}`
  )

  const data = await response.json()

  if (!response.ok || data.status !== "SUCCESS") {
    throw new Error(
      data.error || "โหลด Challenge ไม่สำเร็จ"
    )
  }

  return data.challenges ?? []
}


// ================================
// GET ONE
// ================================

export async function getChallenge(
  challengeId: string
): Promise<Challenge> {

  const baseUrl = await getApiUrl()

  const response = await fetch(
    `${baseUrl}/?action=get_challenge&challengeId=${encodeURIComponent(challengeId)}`
  )

  const data = await response.json()

  if (!response.ok || data.status !== "SUCCESS") {
    throw new Error(
      data.error || "โหลด Challenge ไม่สำเร็จ"
    )
  }

  return data.challenge
}


// ================================
// CREATE
// ================================

export async function createChallenge(
  challenge: Challenge
) {

  const baseUrl = await getApiUrl()

  const response = await fetch(
    `${baseUrl}/?action=create_challenge`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(challenge)
    }
  )

  const data = await response.json()

  if (!response.ok || data.status !== "SUCCESS") {
    throw new Error(
      data.error || "สร้าง Challenge ไม่สำเร็จ"
    )
  }

  return data.challenge
}


// ================================
// UPDATE
// ================================

export async function updateChallenge(
  challenge: Challenge
) {

  const baseUrl = await getApiUrl()

  const response = await fetch(
    `${baseUrl}/?action=update_challenge`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(challenge)
    }
  )

  const data = await response.json()

  if (!response.ok || data.status !== "SUCCESS") {
    throw new Error(
      data.error || "แก้ไข Challenge ไม่สำเร็จ"
    )
  }

  return data.challenge
}


// ================================
// DELETE
// ================================

export async function deleteChallenge(
  challengeId: string
) {

  const baseUrl = await getApiUrl()

  const response = await fetch(
    `${baseUrl}/?action=delete_challenge&challengeId=${encodeURIComponent(challengeId)}`,
    {
      method: "DELETE"
    }
  )

  const data = await response.json()

  if (!response.ok || data.status !== "SUCCESS") {
    throw new Error(
      data.error || "ลบ Challenge ไม่สำเร็จ"
    )
  }
}
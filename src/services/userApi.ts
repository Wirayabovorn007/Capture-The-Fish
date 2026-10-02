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
  failedFlagsSubmitted: number

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

export type FishInventoryItem = {
  fishId: string
  name: string
  imageUrl: string
  rarity: "common" | "rare" | "legendary"
  amount: number
}

export type MyInventoryResponse = {
  fish: number
  inventory: FishInventoryItem[]
}

export async function getMyInventory(): Promise<MyInventoryResponse> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=get_my_inventory&t=${Date.now()}`, {
    headers: await getAuthHeaders(false),
  })
  const data = await readJson(response)
  return {
    fish: Number(data.fish ?? 0),
    inventory: data.inventory ?? [],
  }
}

export type MyProfileStats = {
  fish: number
  completedChallenges: number
  totalChallenges: number
  difficulty: {
    easy: number
    medium: number
    hard: number
  }
}

export async function getMyProfileStats(): Promise<MyProfileStats> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=get_my_profile&t=${Date.now()}`, {
    headers: await getAuthHeaders(false),
  })
  const data = await readJson(response)
  return {
    fish: Number(data.fish ?? 0),
    completedChallenges: Number(data.completedChallenges ?? 0),
    totalChallenges: Number(data.totalChallenges ?? 0),
    difficulty: {
      easy: Number(data.difficulty?.easy ?? 0),
      medium: Number(data.difficulty?.medium ?? 0),
      hard: Number(data.difficulty?.hard ?? 0),
    },
  }
}


export type LeaderboardPlayer = {
  userId: string
  username: string
  fish: number
  completedChallenges: number
  rank: number
  isCurrentUser: boolean
}

export async function getLeaderboard(): Promise<LeaderboardPlayer[]> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=list_leaderboard&t=${Date.now()}`, {
    headers: await getAuthHeaders(false),
  })
  const data = await readJson(response)
  return (data.leaderboard ?? []).map((player: LeaderboardPlayer) => ({
    ...player,
    fish: Number(player.fish ?? 0),
    completedChallenges: Number(player.completedChallenges ?? 0),
    rank: Number(player.rank ?? 0),
    isCurrentUser: Boolean(player.isCurrentUser),
  }))
}

export type PublicStatistics = {
  totalChallenges: number
  totalPlayers: number
  totalFish: number
  totalPlayHours: number
  totalOnlineSeconds: number
}

export async function getPublicStatistics(): Promise<PublicStatistics> {
  const baseUrl = await getApiUrl()
  const response = await fetch(`${baseUrl}/?action=get_public_statistics&t=${Date.now()}`)
  const data = await readJson(response)

  return {
    totalChallenges: Number(data.totalChallenges ?? 0),
    totalPlayers: Number(data.totalPlayers ?? 0),
    totalFish: Number(data.totalFish ?? 0),
    totalPlayHours: Number(data.totalPlayHours ?? 0),
    totalOnlineSeconds: Number(data.totalOnlineSeconds ?? 0),
  }
}

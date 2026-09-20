import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth"

export async function isAuthenticated(): Promise<boolean> {
  try {
    await getCurrentUser()
    return true
  } catch {
    return false
  }
}

export async function getAccessToken(): Promise<string> {
  const session = await fetchAuthSession()
  return session.tokens?.accessToken?.toString() ?? ""
}

export async function getAuthHeaders(includeJson = true): Promise<Record<string, string>> {
  const token = await getAccessToken()
  const headers: Record<string, string> = {}
  if (includeJson) headers["Content-Type"] = "application/json"
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

export async function isAdmin(): Promise<boolean> {
  try {
    const session = await fetchAuthSession()
    const groups = session.tokens?.accessToken.payload["cognito:groups"] as string[] | undefined
    return groups?.includes("Admins") ?? false
  } catch {
    return false
  }
}

export async function logout() {
  await signOut()
  window.location.href = "/login"
}

import {
  fetchAuthSession,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth"

export async function isAuthenticated(): Promise<boolean> {
  try {
    await getCurrentUser()
    return true
  } catch {
    return false
  }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const session = await fetchAuthSession()

    const groups = session.tokens?.accessToken.payload[
      "cognito:groups"
    ] as string[] | undefined

    return groups?.includes("Admins") ?? false
  } catch {
    return false
  }
}

export async function logout() {
  await signOut()
  window.location.href = "/login"
}
import { useEffect } from "react"
import { isAuthenticated } from "../../utils/auth"
import { heartbeat } from "../../services/userApi"

export default function UserHeartbeat() {
  useEffect(() => {
    let disposed = false

    const sendHeartbeat = async () => {
      try {
        if (disposed || !(await isAuthenticated())) return
        await heartbeat()
      } catch (error) {
        console.error("Heartbeat failed:", error)
      }
    }

    void sendHeartbeat()
    const timer = window.setInterval(() => void sendHeartbeat(), 60_000)

    return () => {
      disposed = true
      window.clearInterval(timer)
    }
  }, [])

  return null
}

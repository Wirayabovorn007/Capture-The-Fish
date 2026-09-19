import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { isAdmin } from "../../utils/auth"

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({
  children,
}: AdminRouteProps) {
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const result = await isAdmin()

      setAdmin(result)
      setLoading(false)
    }

    checkAdmin()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
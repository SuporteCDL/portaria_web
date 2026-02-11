import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { JSX } from "react"

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return children
}

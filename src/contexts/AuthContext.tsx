import { api } from "@/lib/axios"
import { AxiosRequestConfig } from "axios"
import { createContext, useContext, useState, ReactNode, useEffect } from "react"

type User = {
  id: number
  name: string
  email: string
  role: string
}

type AuthState = {
  user: User
  token: string
}

type AuthContextData = {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  errorLogin: string
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorLogin, setErrorLogin] = useState('')

  const isAuthenticated = !!user

  async function login(email: string, password: string) {
    setLoading(true)
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const response = await api.post("/users/signin", { email, password }, config)
      const { token, user } = response.data
      setUser(user)
      localStorage.setItem("@auth:token", token)
      localStorage.setItem("@auth:user", JSON.stringify(user))
      api.defaults.headers.common.Authorization = `Bearer ${token}`
      } catch (error) {
        console.error("Erro ao logar", error)
        setErrorLogin(String(error))
        throw error
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem("@auth:token")
    localStorage.removeItem("@auth:user")
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("@auth:user")
    const storedToken = localStorage.getItem("@auth:token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`
    }

    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        errorLogin,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

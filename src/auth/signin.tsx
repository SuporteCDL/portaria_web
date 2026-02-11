import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { ImSpinner9 } from 'react-icons/im'
import { useState } from "react";
import logo from '@/assets/logo.png'

export default function SignIn() {
  const { login, loading, errorLogin, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  
  async function handleLogin() {
    event?.preventDefault()
    await login(email, password)
    navigate("/", { replace: true })
    console.log(isAuthenticated)
  }

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="flex items-center justify-center w-64 h-64 mb-12">
        <img src={logo} alt="Portaria" />
      </div>
      <form className="flex flex-col gap-4 w-full md:w-1/3">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold">E-mail:</label>
          <Input 
            id="email"
            value={email}
            onChange={(text) => setEmail(text.target.value)}
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-semibold">Senha:</label>
          <Input 
            id="password"
            type="password"
            value={password}
            onChange={(text) => setPassword(text.target.value)}
            placeholder="*****"
          />
        </div>
        <Button variant="default" onClick={handleLogin}>
          {loading ? (
          <>
            <ImSpinner9 className="animate-spin" />
            <span style={{ marginLeft: 8 }}>Entrando...</span>
          </>
          ) : (
            "Entrar"
          )}
        </Button>
        {
          errorLogin && 
          <span className="text-red-500">
            Erro ao tentar logar, favor tente novamente.
          </span>
        }
      </form>
      {/* <Link 
        to="/forgotpassword"
        className="hover:cursor-pointer hover:underline my-2">
        Esqueci a senha
      </Link> */}
    </div>
  )
}
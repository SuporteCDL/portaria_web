import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/axios";
import { AxiosRequestConfig } from "axios";
import { FormEvent, useState } from "react";
import ReactModal from 'react-modal'
import z from "zod";

const schema = z.object({
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
})

// type TUpdateUser = z.infer<typeof schema>

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const { user } = useAuth()
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleOpenUpdate() {
    setIsModalOpen(true)
  }

  function handleCloseUpdate() {
    setPassword('')
    setNewPassword('')
    setIsModalOpen(false)
  }

  async function handleUpdatePassword(e:FormEvent) {
    e.preventDefault()
    const result = schema.safeParse({
      password,
      newPassword
    })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    if (user) {
      const updateUser = {
        id: user.id,
        currentPassword: password,
        newPassword: newPassword
      }
      const result = await api.patch(`users/${updateUser.id}/password`, updateUser)
      if (result.data) {
        alert(result.data)
      } else {
        setPassword('')
        setNewPassword('')
        setIsModalOpen(false)
        alert('Senha alterada com sucesso.')
      }
    }
  }

  return (
    <div className="flex flex-col justify-start items-start w-full h-screen bg-slate-50 p-4">
      <div className="flex flex-row justify-between items-center w-full mb-4">
        <h2 className="font-semibold mb-2">Perfil de Usuário</h2>
        <Button onClick={handleOpenUpdate} variant="outline" className="hover:bg-green-100">Alterar Senha</Button>
      </div>

      <div className="flex flex-row gap-2">
        <span className="text-lg font-semibold">Nome:</span>
        <span className="text-lg">{user?.name}</span>
      </div>

      <div className="flex flex-row gap-2">
        <span className="text-lg font-semibold">E-mail:</span>
        <span className="text-lg">{user?.email}</span>
      </div>

      <div className="flex flex-row gap-2">
        <span className="text-lg font-semibold">Nivel:</span>
        <span className="text-lg">{user?.role}</span>
      </div>

      <ReactModal 
        isOpen={isModalOpen}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            zIndex: 50,
          },
          content: {
            position: window.innerWidth <= 768 ? "fixed" : "absolute",
            top: window.innerWidth <= 768 ? "0" : "10%",
            left: window.innerWidth <= 768 ? "0" : "30%",
            right: window.innerWidth <= 768 ? "0" : "20%",
            bottom: window.innerWidth <= 768 ? "0" : "20%",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            width: window.innerWidth <= 768 ? "100%" : "500px",
            height: "330px",
            WebkitOverflowScrolling: "touch",
            borderRadius: window.innerWidth <= 768 ? "0" : "4px",
            outline: "none",
            padding: "10px",
          },
        }}
      >
        <div>
          <form className="flex flex-col w-full h-60 justify-between" onSubmit={handleUpdatePassword}>
            <span className="text-lg font-bold mb-4">Redefinir senha:</span>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Nome: {user?.name}</span>
              <span className="font-semibold">E-mail: {user?.email}</span>
              <div className="flex flex-row justify-between">
                <label htmlFor="password">Senha atual:</label>
                {errors.password && <span className="text-red-700 text-sm">{errors.password}</span>}
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between">
                <label htmlFor="newPassword">Nova senha:</label>
                {errors.newPassword && <span className="text-red-700 text-sm">{errors.newPassword}</span>}
              </div>
              <Input 
                id="newPassword" 
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-center mt-4 gap-2">
              <Button className="w-40 bg-green-800 hover:bg-green-700">Salvar</Button>
              <Button className="w-40 bg-red-800 hover:bg-red-700" onClick={handleCloseUpdate}>Fechar</Button>
            </div>
          </form>
        </div>
      </ReactModal>
    </div>
  )
}
import { FormEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from 'zod';
import { api } from "@/lib/axios";
import { AxiosRequestConfig } from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface IUser {
  id: number
  name: string
  email: string
  password: string
  role: string
}

const userSchema = z.object({
  name: z
    .string()
    .min(4, "Favor informe pelo menos 4 caracteres"),
  email: z
    .string()
    .email("E-mail inválido"),
  password: z.string()
    .min(1, "A senha é obrigatória")
    .min(1, "A senha é obrigatória")
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
    rePassword: z
    .string()
    .min(1, "A confirmação da senha é obrigatória")
    .min(5, "Informe no mínimo 6 caracteres"),
  role: z.string().nonempty("O tipo de usuário não pode ser vazio")
})
.refine((data) => data.password === data.rePassword, {
  message: "As senhas não coincidem",
  path: ["rePassword"]
})
type TUser = z.infer<typeof userSchema>

type Props = {  
  setIsModalOpen: (isOpen:boolean) => void 
  listUsers: () => void
}

export default function FrmUsuario({setIsModalOpen, listUsers}: Props) {
  const [formData, setFormData] = useState<TUser>({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    role: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({});

  function closeModal() {
    setIsModalOpen(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const result = userSchema.safeParse({
      ...formData,
      name: String(formData.name),
      email: String(formData.email),
      password: String(formData.password),
      rePassword: String(formData.rePassword),
      role: String(formData.role),
    });
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
    const { rePassword, ...userToSave } = result.data;
    await api.post('users', userToSave, config)
    alert('Usuário incluído com sucesso.')
  }

  return (
    <div className="flex flex-col justify-between">
      <div className="flex flex-row justify-between items-center w-full pl-4 h-10 mb-6 bg-slate-200">
        <h3 className="font-semibold">Cadastro de Usuários</h3>
        <button
          className="px-3 py-1 text-white bg-red-400 hover:bg-red-500 hover:cursor-pointer font-bold text-lg"
          onClick={closeModal}
        >X</button>
      </div>

      <form className="flex flex-col flex-1 w-full h-fit gap-2 justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <label htmlFor="name" className="font-semibold">Nome:</label>
            {errors.name && <span className="text-red-700 text-sm">{errors.name}</span>}
          </div>
          <Input 
            id="name"
            className="w-full" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <label htmlFor="email" className="font-semibold">E-mail:</label>
            {errors.email && <span className="text-red-700 text-sm">{errors.email}</span>}
          </div>
          <Input 
            id="email"
            className="w-full" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value})}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <label htmlFor="password" className="font-semibold">Senha:</label>
            {errors.password && <span className="text-red-700 text-sm">{errors.password}</span>}
          </div>
          <Input 
            id="password"
            type="password"
            className="w-full" 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <label htmlFor="rePassword" className="font-semibold">Confirme a Senha:</label>
            {errors.rePassword && <span className="text-red-700 text-sm">{errors.rePassword}</span>}
          </div>
          <Input 
            id="rePassword"
            type="password"
            className="w-full" 
            value={formData.rePassword}
            onChange={(e) => setFormData({ ...formData, rePassword: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <label htmlFor="role" className="font-semibold">Tipo de usuário:</label>
             {errors.role && <span className="text-red-700 text-sm">{errors.role}</span>}
          </div>
          <Select onValueChange={(v) => setFormData({ ...formData, role:v })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="usuario">usuario</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSubmit} 
          className="mt-4 self-center w-32 hover:cursor-pointer bg-green-950 hover:bg-green-800"
        >
          Salvar
        </Button>
      </form>

    </div>
  )
}
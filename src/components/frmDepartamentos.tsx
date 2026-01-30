import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/lib/axios";
import { AxiosRequestConfig } from "axios";

interface IDepartment {
  id: number
  descricao: string
}

type Props = {  
  setIsModalOpen: (isOpen:boolean) => void 
  listDepartments: () => void
}

export default function FrmDepartamento({setIsModalOpen, listDepartments}: Props) {
  const [descricao, setDescricao] = useState('')

  function closeModal() {
    setIsModalOpen(false)
  }

  async function handleSubmit() {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    event?.preventDefault()
    const dataForm = { descricao: descricao }
    await api.post('departments', dataForm, config)
    alert('Departamento incluído com sucesso.')
  }

  return (
    <div>
      <div className="flex flex-row justify-between items-center pl-4 h-10 bg-blue-50 mb-6">
        <h3 className="font-semibold">Cadastro de Categorias</h3>
        <button
          className="px-3 py-1 text-white bg-red-400 hover:bg-red-500 hover:cursor-pointer font-bold text-lg"
          onClick={closeModal}
        >X</button>
      </div>
      <form className="flex flex-col h-36 justify-between">
        <div className="flex gap-2">
          <label htmlFor="descricao" className="font-semibold">Departamento:</label>
          <Input 
            id="descricao"
            className="w-full" 
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSubmit} 
          className="mt-4 self-center w-1/2 hover:cursor-pointer bg-blue-400 hover:bg-blue-500"
        >
          Salvar
        </Button>
      </form>
    </div>
  )
}
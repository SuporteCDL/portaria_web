import { useContext, useEffect, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { api } from "@/lib/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ReactModal from 'react-modal'
import { Button } from "@/components/ui/button";
import edit from '@/assets/edit.svg'
import trash from '@/assets/trash-2.svg'
import FrmUsuario from "@/components/frmUsuarios";

interface IUser {
  id: number
  name: string
  email: string
  password: string
  role: string
}

export default function Users() {
  
  const [users, setUsers] = useState<IUser[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function loadUsers() {
    const response = await api.get('users')
    if (response.data) {
      setUsers(response.data)
    }
  }

  function handleAddUser() {
    setIsModalOpen(true)
  }

  async function handleDeleteUser(id: number) {
    if (window.confirm(`Tem certeza que deseja excluír este usuário?`)) {
      await api.delete(`users/${id}`)
      alert('Usuário excluído com sucesso.')
      loadUsers()
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <div className="flex flex-col justify-start items-start w-full h-screen bg-slate-50 p-4">
      <div className="flex flex-row justify-between items-center w-full mb-4">
        <h2 className="font-semibold mb-2">Cadastro de usuários</h2>
        <Button onClick={handleAddUser} variant="outline" className="hover:bg-green-100">+ Adicionar</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-200">
            <TableHead className="flex-1">Nome</TableHead>
            <TableHead className="w-96 text-center">E-mail</TableHead>
            <TableHead colSpan={2} className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-center">{item.email}</TableCell>
              <TableCell className="w-20 text-center">
                <button onClick={()=>{}} className="p-2 hover:cursor-pointer hover:bg-blue-100">
                  <img src={edit} width={20} />
                </button>
              </TableCell>
              <TableCell className="w-20 text-center">
                <button onClick={()=>{handleDeleteUser(item.id)}} className="p-2 hover:cursor-pointer hover:bg-red-100">
                  <img src={trash} width={20} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ReactModal 
        isOpen={isModalOpen}
        onAfterClose={loadUsers}
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
            height: "550px",
            WebkitOverflowScrolling: "touch",
            borderRadius: window.innerWidth <= 768 ? "0" : "4px",
            outline: "none",
            padding: "10px",
          },
        }}
      >
        <FrmUsuario 
          setIsModalOpen={setIsModalOpen} 
          listUsers={loadUsers} 
        />
      </ReactModal>
      
    </div>
  )
}
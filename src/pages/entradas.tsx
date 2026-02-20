import { useState, useEffect } from 'react'
import { api } from '@/lib/axios'
import ReactModal from 'react-modal'
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AxiosRequestConfig } from 'axios'
import { TempoPermanencia } from '@/components/tempoPermanencia';
import svgSearch from '@/assets/search.svg'
import svgLogOut from '@/assets/logout.svg'
import FrmDepartamento from '@/components/frmDepartamentos';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { calcularPermanencia, formatarTempo, formatDate, formatDateBR, formatDateDB } from '@/lib/functions'
import { useAuth } from '@/contexts/AuthContext';

interface IDepartment {
  id: number
  descricao: string
}

interface IEntry {
  id: number;
  atendimento: string
  qtde_pessoas: number
  data: string
  hora_entrada: string
  hora_saida: string
  permanencia?: number | undefined
  observacao?: string | undefined
  nome?: string | undefined
  servico?: string | undefined
}

export default function Entradas() {
  let totalRegistros = 0
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOut, setIsOut] = useState(false)
  const [departments, setDepartments] = useState<IDepartment[]>([])
  const [diaHoje, setDiaHoje] = useState(new Date().toLocaleDateString())
  const [entries, setEntries] = useState<IEntry[]>([])
  const [atendimento, setAtendimento] = useState('')
  const [nome, setNome] = useState('')
  const [servico, setServico] = useState('')
  const [qtdePessoas, setQtdePessoas] = useState(1)
  const [observacao, setObservacao] = useState('')

   const increment = () => {
    setQtdePessoas((prev) => prev + 1)
  }

  const decrement = () => {
    setQtdePessoas((prev) => Math.max(1, prev - 1))
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (!Number.isNaN(value)) {
      setQtdePessoas(value)
    }
  }

  function onChangeFilter(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") {
      setDiaHoje(new Date().toLocaleDateString());  
    }
    setDiaHoje(formatDate(e.target.value));
  }
  
  function handleOpenModal() {
    setIsModalOpen(true)
  }

  async function ListaDepartmentos() {
    const response = await api.get('departments')
    if (response.data) {
      setDepartments(response.data)
    }
  }

  function onClickSearch() {
    if (diaHoje === "") {
      setDiaHoje(new Date().toLocaleDateString())
    }
    listEntries(diaHoje)
  }

  async function listEntries(dayEntry: string) {
    const diaDB = formatDateDB(dayEntry)
    if (dayEntry.length !== 10) return
    const response = await api.get(`entries/${diaDB}`)
    if (response.data) {
      setEntries(response.data)
    }
  }

  async function handleSubmit() {
    const dataAtual = new Date().toISOString().split('T')[0]
    const horaAtual = new Date().toLocaleTimeString('pt-BR', {
      hour12: false
    })
    event?.preventDefault()
    const dataForm = {
      atendimento: atendimento,
      qtde_pessoas: qtdePessoas,
      data: dataAtual,
      hora_entrada: horaAtual,
      permanencia: 0,
      observacao: observacao,
      nome: nome,
      servico: servico,
      usuario: user?.name
    }
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    await api.post('entries',dataForm, config)
    alert('Entrada registrada com sucesso!')
    listEntries(formatDateBR(dataAtual))
    setDiaHoje(formatDateBR(dataAtual))
  }

  async function updateEntry(entry: IEntry) {
    const newDateNow = new Date().toLocaleDateString()
    const newTimeOut = new Date().toLocaleTimeString('pt-BR', {
      hour12: false
    })
    const tempoPermanencia = calcularPermanencia(String(newDateNow),String(entry.hora_entrada),String(newTimeOut))
    const dataEntry = {
      id: entry.id,
      atendimento: entry.atendimento,
      qtde_pessoas: entry.qtde_pessoas,
      data: entry.data.slice(0, 10),
      hora_entrada: entry.hora_entrada,
      hora_saida: newTimeOut,
      permanencia: tempoPermanencia,
      observacao: entry.observacao,
      nome: entry.nome === null ? '' : entry.nome,
      servico: entry.servico === null ? '' : entry.servico
    }
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    await api.put('entries',dataEntry, config)
    alert(`Saida de ${entry.atendimento} registrada com sucesso!`)
    listEntries(diaHoje)
  }

  async function deleteEntry(entry: IEntry) {
    if (window.confirm(`Tem certeza que deseja excluír entrada do local ${entry.atendimento}?`)) {
       await api.delete(`entries/${entry.id}`)
       alert(`Registro de ${entry.atendimento} excluido com sucesso!`)
       listEntries(diaHoje)
    }
  }

  useEffect(() => {
     listEntries(diaHoje)
     ListaDepartmentos()
  },[diaHoje])

  return (
    <div className="flex flex-col justify-start items-start w-full h-screen bg-slate-50">
      <div className="w-full flex flex-row flex-1 gap-10">

        <div className="w-103 p-4 border-r border-slate-100 shadow-2xl">
          <h3 className='text-lg font-bold mb-4'>Incluir entrada:</h3>
          <form className="flex flex-col gap-4 w-full">
            <div className="flex flex-row justify-start items-center w-full">
              <label className="w-28">Setor:</label>
              <Select onValueChange={(v) => setAtendimento(v)}>
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {departments.map(item => (
                      <SelectItem key={item.id} value={item.descricao}>{item.descricao}</SelectItem>
                    ))}                    
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button 
                type='button' 
                className='ml-2' 
                onClick={handleOpenModal}
              >+</Button>

            </div>
            <div className="flex flex-row justify-start items-center w-full">
              <label className="w-28">Nome:</label>
              <Input 
                className="w-75" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="flex flex-row justify-start items-center w-full">
              <label className="w-28">Serviço:</label>
              <Input
                className="w-75" 
                value={servico}
                onChange={(e) => setServico(e.target.value)}
              />
            </div>

            <div className="flex flex-row justify-start items-center w-full">
              <label className="w-28">Qtd. Pessoas:</label>
              <Input 
                className="w-20 text-right" 
                placeholder="0" 
                type="number"
                value={qtdePessoas}
                onChange={onChange}
                min={1}
              />
              <Button 
                className="mx-8 bg-red-300 border border-red-400 text-blue-900 text-lg hover:bg-red-400 hover:cursor-pointer"
                type="button"
                variant="outline"
                size="icon"
                onClick={decrement}
              >-</Button>
              <Button 
                className="bg-blue-300 border border-blue-400 text-blue-900 text-lg hover:bg-blue-400 hover:cursor-pointer"
                type="button"
                variant="outline"
                size="icon"
                onClick={increment}
              >+</Button>
            </div>

            <div className="flex flex-row justify-start items-start w-full">
              <label className="w-28">Observação:</label>
              <Textarea 
                className="w-75" 
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>

            <Button onClick={handleSubmit} className="w-48 self-end hover:cursor-pointer bg-blue-400 hover:bg-blue-500">
              ENTRADA
            </Button>
          </form>
        </div>

        <div className="w-full pt-4 pr-2">
          <div className='flex flex-row gap-4 justify-between items-center mb-4'>
            <h3 className='text-lg font-bold'>Listagem de entradas no dia:</h3>
            <div>
              <label className='mr-4 font-semibold'>Filtrar por data:</label>
              <Input
                type='text'
                placeholder='dd/mm/aaaa'
                className='w-32' 
                onFocus={(e) => e.target.select()}
                value={diaHoje}
                onChange={onChangeFilter}
              />
              <Button variant="ghost" onClick={onClickSearch}>
                <img src={svgSearch} width={24} />
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className='bg-blue-100'>
                <TableHead className="w-25">Codigo</TableHead>
                <TableHead className="flex-1">Setor</TableHead>
                <TableHead className="w-52">Nome</TableHead>
                <TableHead className="w-52">Serviço</TableHead>
                <TableHead className="w-28">Hora Entrada</TableHead>
                <TableHead className="w-28">Hora Saída</TableHead>
                <TableHead className="w-28">Tempo</TableHead>
                <TableHead className="w-16 text-center">Qtd.<br /> Pessoas</TableHead>
                <TableHead className='w-20 text-center'>Marcar<br />Saída</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((item, index) => {
                totalRegistros ++
                return (
                  <TableRow key={item.id} className={index % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}>
                    <TableCell className='w-25'>{item.id}</TableCell>
                    <TableCell className="flex-1 font-medium">{item.atendimento}</TableCell>
                    <TableCell className="w-52 font-medium">{item.nome}</TableCell>
                    <TableCell className="w-52 font-medium">{item.servico}</TableCell>
                    <TableCell className='w-28'>{item.hora_entrada.toString()}</TableCell>
                    <TableCell className='w-28'>{item.hora_saida?.toString()}</TableCell>
                    <TableCell className='w-28'>
                      {Number(item.permanencia) < 1 ?
                        <TempoPermanencia data={new Date(item.data).toLocaleDateString()} entrada={item.hora_entrada} />
                        :
                        formatarTempo(Number(item.permanencia))
                      }
                    </TableCell>
                    <TableCell className="w-12 text-center">{item.qtde_pessoas}</TableCell>
                    <TableCell className="w-12 text-center">
                      { Number(item.permanencia) < 1 ?
                        <Button
                          className='bg-green-300 hover:bg-green-400 hover:cursor-pointer'
                          type='button'
                          variant="outline"
                          size="icon"
                          onClick={() => updateEntry(item)}
                        >
                        <img src={svgLogOut} width={24} />
                        </Button>
                          :
                        <Button
                          className='bg-slate-200'
                          type='button'
                          variant="outline"
                          size="icon"
                        > 
                          <img src={svgLogOut} width={24} />
                        </Button>
                      }
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8} className="text-right">Total de entradas em {diaHoje}:</TableCell>
                <TableCell className="text-center">{totalRegistros}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        
      </div>

      <ReactModal 
        isOpen={isModalOpen}
        onAfterClose={ListaDepartmentos}
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
            width: window.innerWidth <= 768 ? "100%" : "410px",
            height: "250px",
            WebkitOverflowScrolling: "touch",
            borderRadius: window.innerWidth <= 768 ? "0" : "4px",
            outline: "none",
            padding: "10px",
          },
        }}
      >
        <FrmDepartamento 
          setIsModalOpen={setIsModalOpen} 
          listDepartments={ListaDepartmentos} 
        />
      </ReactModal>

      <div className='flex flex-row w-full justify-center items-center text-md text-slate-400'>
        CopyRight &copy;2026
      </div>
    </div>
  )
}
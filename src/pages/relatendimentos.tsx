import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { formatDateDB } from "@/lib/functions";
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { Table, 
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow, } from "@/components/ui/table";
import { ImSpinner9 } from "react-icons/im";

interface EntryProps {
  id: number
  atendimento: string
  qtde_pessoas: number
  data: Date
  hora_entrada: string
  hora_saida: string
  permanencia: number
  observacao: string
  nome: string
  servico: string
}

export default function RelAtendimentos() {
  const [dtIni, setDtIni] = useState<Date | undefined>(new Date())
  const [dtFim, setDtFim] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [entries, setEntries] = useState<EntryProps[]>([])

  async function handleFilter() {
    setLoading(true)
    event?.preventDefault()
    const dini = formatDateDB(String(dtIni?.toLocaleDateString()))
    const dfim = formatDateDB(String(dtFim?.toLocaleDateString()))
    const response = await api.get(`entries/entriesbyperiod?dayEntryBegin=${dini}&dayEntryEnd=${dfim}`)
    if (response.data) {
      setEntries(response.data)
      setLoading(false)
    }
  }

    function exportarExcel() {
      const ws = XLSX.utils.json_to_sheet(entries)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Entradas")

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
      saveAs(blob, "entradas_periodo.xlsx")
    }

    function exportarPDF() {
      const doc = new jsPDF()
      doc.text("CONTROLE PATRIMONIAL CDL - Relatório de Ativos", 14, 10)

      // Cabeçalhos
      const colunas = ["Código", "Atendimento", "Data", "Hora Entrada", "Hora Saida", "Permanencia", "Nome", "Serviço", "Qtd Pessoas", "Observação"]
      const linhas = entries.map(e => [
        e.id,
        e.atendimento,
        e.data,
        e.hora_entrada,
        e.hora_saida,
        e.permanencia,
        e.nome,
        e.servico,
        e.qtde_pessoas,
        e.observacao
      ])

      doc.autoTable({
        head: [colunas],
        body: linhas,
        startY: 20,
      })

      doc.save("entradas_periodo.pdf")
    }


  return (
    <div className="w-full p-4 flex flex-col items-center">
      <div className="flex flex-row justify-end items-center w-full gap-4 pb-4 border-b border-slate-200 shadow-md">
        <form className="flex flex-row gap-8 items-center w-full ">
          <span className="font-semibold">Selecione o filtro para o relatório:</span>
          <div className="flex flex-row gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!dtIni}
                  className="data-[empty=true]:text-muted-foreground w-40 justify-between text-left font-normal"
                >
                  {dtIni ? format(dtIni, "dd/MM/yyyy", { locale: ptBR }) : <span>Data Inicial</span>}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={ptBR}
                  selected={dtIni}
                  onSelect={setDtIni}
                  defaultMonth={dtIni}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!dtFim}
                  className="data-[empty=true]:text-muted-foreground w-40 justify-between text-left font-normal"
                >
                  {dtFim ? format(dtFim, "dd/MM/yyyy", { locale: ptBR }) : <span>Data Final</span>}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={ptBR}
                  selected={dtFim}
                  onSelect={setDtFim}
                  defaultMonth={dtFim}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button 
            variant="default" 
            className="hover:cursor-pointer" 
            onClick={handleFilter}
          >
            {loading ? (
            <>
              <ImSpinner9 className="animate-spin" />
              <span style={{ marginLeft: 8 }}>Filtrando...</span>
            </>
            ) : (
              "Filtrar"
            )}
          </Button>
        </form>

        <Button className="md:w-20 w-full bg-green-600 hover:bg-green-700" onClick={exportarExcel}>XLS</Button>
        <Button className="md:w-20 w-full bg-red-500 hover:bg-red-700" onClick={exportarPDF}>PDF</Button>
      
      </div>
      
      <Table>
        <TableCaption>Lista de entradas por período</TableCaption>
        <TableHeader>
          <TableRow className="bg-slate-200">
            <TableHead className="w-96">Local</TableHead>
            <TableHead className="w-32 text-center">Data</TableHead>
            <TableHead className="w-32 text-center">Hora Entrada</TableHead>
            <TableHead className="w-32 text-center">Hora Saída</TableHead>
            <TableHead className="w-32 text-center">Permanencia</TableHead>
            <TableHead>Observação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.atendimento}</TableCell>
              <TableCell className="text-center">{new Date(item.data)
                .toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className=" text-center">{item.hora_entrada}</TableCell>
              <TableCell className=" text-center">{item.hora_saida}</TableCell>
              <TableCell className=" text-center">{item.permanencia}</TableCell>
              <TableCell>{item.observacao}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-right">Quantidade: {entries.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
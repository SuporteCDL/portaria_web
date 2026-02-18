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
import { calcularPermanencia, formatarTempo, formatDate, formatDateBR, formatDateDB } from "@/lib/functions";
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable";
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
  usuario: string
}
import logo from "@/assets/cdl.png"

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
    const obj = entries.map( e => (
      {
        id: e.id,
        atendimento: e.atendimento,
        data: new Date(e.data).toLocaleDateString("pt-BR"),
        hora_entrada: e.hora_entrada,
        hora_saida: e.hora_saida,
        permanencia: formatarTempo(e.permanencia),
        nome: e.nome,
        servico: e.servico,
        qtde_pessoas: e.qtde_pessoas,
        observacao: e.observacao}
    ))
    const ws = XLSX.utils.json_to_sheet(obj)
    const wb = XLSX.utils.book_new()
    console.log(ws)
    XLSX.utils.book_append_sheet(wb, ws, "Entradas")

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, "entradas_periodo.xlsx")
  }

    function exportarPDF() {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      })
      doc.addImage(logo, "PNG", 14, 8, 30, 15)

      doc.setFontSize(18)
      doc.text("Relatório de Atendimentos", 50, 15)
      
      doc.setFontSize(10)
      doc.text(`Emitido em: ${new Date().toLocaleDateString("pt-BR")}`, 247, 15)

      doc.setFontSize(10)
      doc.text(`Período: ${String(dtIni?.toLocaleDateString())} a ${String(dtFim?.toLocaleDateString())}`, 230, 22)
      
      const colunas = ["Código", "Atendimento", "Data", "Hora Entrada", "Hora Saida", "Permanencia", "Nome", "Serviço", "Qtd Pessoas", "Observação"]
      const linhas = entries.map(e => [
        e.id,
        e.atendimento,
        new Date(e.data).toLocaleDateString("pt-BR"),
        e.hora_entrada,
        e.hora_saida,
        formatarTempo(e.permanencia),
        e.nome,
        e.servico,
        e.qtde_pessoas,
        e.observacao
      ])

      autoTable(doc, {
        head: [colunas],
        body: linhas,
        startY: 30,
        theme: "grid",

        styles: {
          fontSize: 8,
          cellPadding: 2,
        },

        headStyles: {
          fillColor: [0, 65, 136], // azul
          textColor: 255,
          fontStyle: "bold",
        },

        alternateRowStyles: {
          fillColor: [240, 240, 240], // zebra
        },

        margin: { top: 30 },

        didDrawPage: (data) => {
          // Rodapé com número da página
          const pageCount = doc.getNumberOfPages()
          const pageSize = doc.internal.pageSize

          doc.setFontSize(9)
          doc.text(
            `Página ${data.pageNumber}`,
            pageSize.getWidth() - 40,
            pageSize.getHeight() - 10
          )
        }
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
            <TableHead className="w-32">Usuário</TableHead>
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
              <TableCell className="font-medium">{item.usuario}</TableCell>
              <TableCell className="font-medium">{item.atendimento}</TableCell>
              <TableCell className="text-center">{new Date(item.data)
                .toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className=" text-center">{item.hora_entrada}</TableCell>
              <TableCell className=" text-center">{item.hora_saida}</TableCell>
              <TableCell className=" text-center">{formatarTempo(item.permanencia)}</TableCell>
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
import { api } from "@/lib/axios"
import { useEffect, useState } from "react"

type TEntriesMostVisited = {
  atendimento: string
  qtde: number
  perc: number
}

export default function ChartListMaisVisitados() {
  const [entriesMostVisited, setEntriesMostVisited] = useState<TEntriesMostVisited[]>([])
  
  async function listEntriesAtendimentosPorLocal() {
    const response = await api.get('entries/entriesbylocal')
    if (response.data) {
      const total = response.data.reduce((acc:any, curr:any) => acc + curr.qtde, 0)
      const parsedData: TEntriesMostVisited[] = response.data.map((item: TEntriesMostVisited) => ({
        ...item,
        atendimento: item.atendimento,
        qtde: item.qtde,
        perc: ((item.qtde / total) * 100).toFixed(2)
      }))
      setEntriesMostVisited(parsedData)
    }
  }

  useEffect(() => {
    listEntriesAtendimentosPorLocal()
  }, [])

  return (
    <div className="flex-1 p-4 border border-slate-300 rounded-xl bg-slate-50">
      <h3 className="font-semibold">Mais visitados:</h3>
      <table className="w-full h-32 overflow-y-auto">
        <thead>
        {entriesMostVisited.map( item => (
          <tr key={item.atendimento} className="border-b border-b-slate-300 h-6">
            <td className="text-sm">{item.atendimento}</td>
            <td className="text-sm">{item.qtde}</td>
            <td className="text-sm">{item.perc}%</td>
          </tr>
        ))}
        </thead>
      </table>
    </div>
  )
}

import { api } from "@/lib/axios"
import { useEffect, useState } from "react"
import { ChartPieDonutAtendimentosLocal } from "@/components/chartPieDonutAtendimentosLocal"
import { ChartBarAtendimentosTotal } from "@/components/chartBarTotalAtendimentos"

type TEntryAtendimentoPorLocal = {
  atendimento: string;
  qtde: number;
  fill: string;
}

export default function Dashboard() {
  const [entriesAtendimentoPorLocal, setEntriesAtendimentoPorLocal] = useState<TEntryAtendimentoPorLocal[]>([])
 
  async function listEntriesAtendimentosPorLocal() {
    const response = await api.get('entries/entriesbylocal')
    if (response.data) {
      const parsedData: TEntryAtendimentoPorLocal[] = response.data.map((item: TEntryAtendimentoPorLocal) => ({
        ...item,
        atendimento: item.atendimento,
        qtde: item.qtde,
        fill: `var(--color-${item.atendimento.split(' ')[1] ? item.atendimento.split(' ')[1] : item.atendimento.split(' ')[0]})`
      }))
      setEntriesAtendimentoPorLocal(parsedData)
    }
  }

  useEffect(()=> {
    listEntriesAtendimentosPorLocal()
  },[])

  return (
    <div className="flex flex-col gap-2">
      <ChartBarAtendimentosTotal />
      <div className="flex flex-row gap-4">
        <ChartPieDonutAtendimentosLocal atendimentos={entriesAtendimentoPorLocal} />
      </div>
    </div>      
  )
}
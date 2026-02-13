import { ChartPieDonutAtendimentosLocal } from "@/components/chartPieDonutAtendimentosLocal"
import { ChartBarAtendimentosTotal } from "@/components/chartBarTotalAtendimentos"
import { ChartBarUsersAtendimento } from "@/components/chartBarUsersAtendimento"
import ChartListMaisVisitados from "@/components/chartListMaisVisitados"

export default function Dashboard() {
   
  return (
    <div className="flex flex-col gap-2">
      <ChartBarAtendimentosTotal />
      <div className="flex flex-row justify-between gap-2">
        <ChartPieDonutAtendimentosLocal />
        <ChartListMaisVisitados />
        <ChartBarUsersAtendimento />
      </div>
    </div>      
  )
}
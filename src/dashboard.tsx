import { Input } from "./components/ui/input"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { api } from "./lib/axios"
import { useEffect, useState } from "react"

type TEntryGroupByDay = {
  data: Date;
  total: number;
}

export default function Dashboard() {
  const [entriesGroupByDay, setEntriesGroupByDay] = useState<TEntryGroupByDay[]>([])
  const chartData = [
    { data: "2024-04-01", total: 222 },
    { data: "2024-04-02", total: 97 },
    { data: "2024-04-03", total: 167 },
    { data: "2024-04-04", total: 242 },
    { data: "2024-04-05", total: 373 },
    { data: "2024-04-06", total: 301 },
  ]
  const chartConfig = {
    views: {
      label: "Atendimentos",
    },
    total: {
      label: "Total",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  async function listEntriesGroupbyDay() {
    const response = await api.get('entries/entriesgroupbyday')
    if (response.data) {
    }
    console.log(response.data)
    console.log(chartData)
    setEntriesGroupByDay(response.data)
  }

  useEffect(()=> {
    listEntriesGroupbyDay()
  },[])

  return (
    <div className="flex flex-col">
      <div className="p-2">
        <Input placeholder="Pesquisar" className="w-96" />
      </div>

      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
            <CardTitle className="pt-2">Atendimentos por mês</CardTitle>
            <CardDescription className="pb-2">
              Totais de atendimentos no último ano
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-62.5 w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="data"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-37.5"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />
              <Bar dataKey={"total"} fill={`var(--color-total)`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="flex flex-row w-full gap-4 mt-4">
        <div className="w-1/2 p-2 border border-gray-200">
          
        </div>
        <div className="w-1/2 p-2 border border-gray-200">
          <h3>Total de Atendimentos</h3>
        </div>
      </div>
    </div>      
  )
}
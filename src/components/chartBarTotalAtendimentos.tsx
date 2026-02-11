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
import { api } from "../lib/axios"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

type TEntryAmountDay = {
  data: Date;
  total: number;
}

interface IDepartment {
  id: number
  descricao: string
}

export function ChartBarAtendimentosTotal() {
  const [entriesAmountDays, setEntriesAmountDays] = useState<TEntryAmountDay[]>([])
  const [departments, setDepartments] = useState<IDepartment[]>([])
  const [atendimento, setAtendimento] = useState('')

  async function ListaDepartmentos() {
    const response = await api.get('departments')
    if (response.data) {
      setDepartments([{ id: '0', descricao: 'Todos' },...response.data])
    }
  }

  async function listEntriesGroupbyDay() {
    const response = await api.get(`entries/entriesamountdays?atendimento=${atendimento}`)
    if (response.data) {
      const parsedData: TEntryAmountDay[] = response.data.map((item: TEntryAmountDay) => ({
        ...item,
        data: new Date(item.data).toISOString().slice(0, 10),
        total: Number(item.total)
      }))
      setEntriesAmountDays(parsedData)
    }
  }

  const chartConfig = {
    views: {
      label: "Atendimentos",
    },
    total: {
      label: "Total",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  useEffect(() => {
    ListaDepartmentos()
    listEntriesGroupbyDay()
  }, [atendimento])

  return (
    <>
      <Card className="py-0 w-full">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div className="flex flex-row justify-start items-center w-full h-12 p-4 gap-4">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
              <CardTitle className="pt-2">Quantidade de atendimentos</CardTitle>
              <CardDescription className="pb-2">Últimos 60 dias</CardDescription>
            </div>
            <div className="flex flex-row items-center gap-4">
              <label htmlFor="local" className="text-sm">Filtro por Local:</label>
              <Select onValueChange={(v) => setAtendimento(v)}>
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {departments.map(item => (
                      <SelectItem key={item.id} value={item.descricao }>{item.descricao}</SelectItem>
                    ))}                    
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-62.5 w-full"
          >
            <BarChart
              accessibilityLayer
              data={entriesAmountDays}
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
                      return new Date(value).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
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
    </>
  )
}
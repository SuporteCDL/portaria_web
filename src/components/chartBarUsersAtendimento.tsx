import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { api } from "@/lib/axios"

type TEntriesByUser = {
  usuario: string
  qtde: number
  fill: string
}

export function ChartBarUsersAtendimento() {
  const [entriesByUser, setEntriesByUser] = useState<TEntriesByUser[]>([])
  
  async function listEntriesAtendimentosPorUsuario() {
    const response = await api.get('entries/entriesbyuser')
    if (response.data) {
      const parsedData: TEntriesByUser[] = response.data.map((item: TEntriesByUser) => ({
        ...item,
        usuario: item.usuario,
        qtde: item.qtde,
        fill: `var(--color-${item.usuario.split(' ')[1] ? item.usuario.split(' ')[1] : item.usuario.split(' ')[0]})`,
      }))
      setEntriesByUser(parsedData)
      console.log(parsedData)
    }
  }
  
  const chartConfig = entriesByUser.reduce((acc, item, index) => {
    const colorIndex = (index % 5) + 1
    acc[item.usuario] = {
      label: item.usuario,
      color: `var(--chart-${colorIndex})`,
    }
    return acc
  }, {} as ChartConfig)

  useEffect(() => {
    listEntriesAtendimentosPorUsuario()
  },[])

  return (
    <Card className="w-1/5">
      <CardHeader>
        <CardTitle>Atendimentos por usuário</CardTitle>
        <CardDescription>Últimos 60 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={entriesByUser}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="usuario"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                String(chartConfig[value as keyof typeof chartConfig].label)
              }
            />
            <XAxis dataKey="qtde" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="qtde" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

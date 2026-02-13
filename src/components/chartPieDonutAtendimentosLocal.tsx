import { useEffect, useState } from "react"
import { Label, Pie, PieChart } from "recharts"
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
import { api } from "@/lib/axios"

type TEntryAtendimentoPorLocal = {
  atendimento: string;
  qtde: number;
  fill: string;
}

export function ChartPieDonutAtendimentosLocal() {
  const [entriesAtendimentoPorLocal, setEntriesAtendimentoPorLocal] = useState<TEntryAtendimentoPorLocal[]>([])
  const [totalVisitors, setTotalVisitors] = useState(0)
  
  async function listEntriesAtendimentosPorLocal() {
    const response = await api.get('entries/entriesbylocal')
    if (response.data) {
      const parsedData: TEntryAtendimentoPorLocal[] = response.data.map((item: TEntryAtendimentoPorLocal) => ({
        ...item,
        atendimento: item.atendimento,
        qtde: item.qtde,
        fill: `var(--color-${item.atendimento.split(' ')[1] ? item.atendimento.split(' ')[1] : item.atendimento.split(' ')[0]})`
      }))
      const total = parsedData.reduce((acc, curr) => acc + curr.qtde, 0)
      setTotalVisitors(total)
      setEntriesAtendimentoPorLocal(parsedData)
    }
  }
  
  const chartConfig = entriesAtendimentoPorLocal.reduce((acc, item, index) => {
    const colorIndex = (index % 5) + 1
    acc[item.atendimento] = {
      label: item.atendimento,
      color: `var(--chart-${colorIndex})`,
    }
    return acc
  }, {} as ChartConfig)

  useEffect(() => {
    listEntriesAtendimentosPorLocal()
  },[])

  return (
    <Card className="flex flex-col w-1/3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Atendimentos por Local</CardTitle>
        <CardDescription>Últimos 60 dias</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={entriesAtendimentoPorLocal}
              dataKey="qtde"
              nameKey="atendimento"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitantes
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
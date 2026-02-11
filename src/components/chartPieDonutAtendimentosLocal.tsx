import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
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

// const chartData = [
//   { atendimento: "chrome", qtde: 275, fill: "var(--color-chrome)" },
//   { atendimento: "safari", qtde: 200, fill: "var(--color-safari)" },
//   { atendimento: "firefox", qtde: 287, fill: "var(--color-firefox)" },
//   { atendimento: "edge", qtde: 173, fill: "var(--color-edge)" },
//   { atendimento: "other", qtde: 190, fill: "var(--color-other)" },
// ]

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "var(--chart-1)",
//   },
//   safari: {
//     label: "Safari",
//     color: "var(--chart-2)",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "var(--chart-3)",
//   },
//   edge: {
//     label: "Edge",
//     color: "var(--chart-4)",
//   },
//   other: {
//     label: "Other",
//     color: "var(--chart-5)",
//   },
// } satisfies ChartConfig

type TEntriesByLocal = {
  atendimento: string
  qtde: number
  fill: string
}

interface Props {
  atendimentos: TEntriesByLocal[]
}

export function ChartPieDonutAtendimentosLocal({ atendimentos }: Props) {
  const totalVisitors = React.useMemo(() => {
    return atendimentos.reduce((acc, curr) => acc + curr.qtde, 0)
  }, [atendimentos])
  
  const chartConfig = atendimentos.reduce((acc, item, index) => {
    const colorIndex = (index % 5) + 1
    acc[item.atendimento] = {
      label: item.atendimento,
      color: `var(--chart-${colorIndex})`,
    }
    return acc
  }, {} as ChartConfig)

  
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
              data={atendimentos}
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
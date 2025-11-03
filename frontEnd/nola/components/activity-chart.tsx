"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Download, ArrowLeft } from "lucide-react"
import salesData from "../public/data/exemplo_data.json"

const monthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"]
const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function getPeriod(date: Date) {
  const hour = date.getHours()
  if (hour < 12) return "Manhã"
  if (hour < 18) return "Tarde"
  return "Noite"
}

export function ActivityChart() {
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [selectedWeekDay, setSelectedWeekDay] = useState<string | null>(null)

  // <<Processa dados de forma dinâmica conforme o modo atual
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {}

    salesData.forEach((sale) => {
      const date = new Date(sale.created_at)
      if (selectedWeekDay) {
        // <<<Se um dia foi selecionado, mostra períodos (Manhã/Tarde/Noite)
        const weekDay = weekDays[date.getDay()]
        if (weekDay === selectedWeekDay) {
          const period = getPeriod(date)
          grouped[period] = (grouped[period] || 0) + sale.total_amount
        }
      } else if (viewMode === "month") {
        const month = monthNames[date.getMonth()]
        grouped[month] = (grouped[month] || 0) + sale.total_amount
      } else if (viewMode === "week") {
        const weekDay = weekDays[date.getDay()]
        grouped[weekDay] = (grouped[weekDay] || 0) + sale.total_amount
      } else if (viewMode === "day") {
        const period = getPeriod(date)
        grouped[period] = (grouped[period] || 0) + sale.total_amount
      }
    })

    return Object.entries(grouped).map(([label, value]) => ({
      label,
      value: Number(value.toFixed(2)),
    }))
  }, [viewMode, selectedWeekDay])

  return (
    <Card className="hover-lift smooth-transition animate-slide-up border-2 hover:border-accent/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {selectedWeekDay
            ? `Vendas por Período (${selectedWeekDay})`
            : "Atividade"}
        </CardTitle>
        <div className="flex items-center gap-2">
          {selectedWeekDay ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedWeekDay(null)}
              className="flex items-center gap-1 text-sm"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
          ) : (
            <>
              <Select
                defaultValue="month"
                onValueChange={(value) => {
                  setViewMode(value as any)
                  setSelectedWeekDay(null)
                }}
              >
                <SelectTrigger className="w-[120px] smooth-transition hover:border-accent">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mês</SelectItem>
                  <SelectItem value="week">Dia da Semana</SelectItem>
                  <SelectItem value="day">Período do Dia</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-accent hover:text-accent-foreground smooth-transition bg-transparent"
              >
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              onClick={(state) => {
                if (viewMode === "week" && state?.activeLabel) {
                  setSelectedWeekDay(state.activeLabel)
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="hsl(var(--accent))"
                radius={[4, 4, 0, 0]}
                className="cursor-pointer smooth-transition"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

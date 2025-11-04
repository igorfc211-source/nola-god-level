"use client"

import { useState, useMemo, useEffect } from "react"
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
  const [salesData, setSalesData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 🔹 Busca até 1000 vendas do backend FastAPI
  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch("http://localhost:8000/sales?limit=200000") // 👈 pede 1000 registros
        if (!res.ok) throw new Error("Erro ao buscar dados")
        const data = await res.json()

        // ✅ Garantir que o created_at é válido e convertível pra Date
        const cleanData = data.filter(
          (sale: any) => sale.created_at && !isNaN(new Date(sale.created_at).getTime())
        )

        setSalesData(cleanData)
      } catch (err) {
        console.error("Erro ao buscar vendas:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [])

  // 🔹 Processa dados dinamicamente conforme o modo atual
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {}
  
    if (salesData.length === 0) return []
  
    // 🔸 Caso tenha um dia específico selecionado
    if (selectedWeekDay) {
      salesData.forEach((sale) => {
        const date = new Date(sale.created_at)
        const weekDay = weekDays[date.getDay()]
        if (weekDay === selectedWeekDay) {
          const period = getPeriod(date)
          grouped[period] = (grouped[period] || 0) + sale.total_amount
        }
      })
    }
  
    // 🔸 Agrupamento mensal (considera ano também)
    else if (viewMode === "month") {
      salesData.forEach((sale) => {
        const date = new Date(sale.created_at)
        const month = monthNames[date.getMonth()]
        const year = date.getFullYear()
        const key = `${month}/${year}` // 👈 agrupa por mês e ano
        grouped[key] = (grouped[key] || 0) + sale.total_amount
      })
    }
  
    // 🔸 Agrupamento semanal (mostra por dia da semana + data)
    else if (viewMode === "week") {
      salesData.forEach((sale) => {
        const date = new Date(sale.created_at)
        const weekDay = weekDays[date.getDay()]
        const day = String(date.getDate()).padStart(2, "0")
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const key = `${weekDay} ${day}/${month}` // 👈 ex: "Seg 03/11"
        grouped[key] = (grouped[key] || 0) + sale.total_amount
      })
    }
  
    // 🔸 Agrupamento diário (por períodos de um mesmo dia)
    else if (viewMode === "day") {
      // Pega o dia mais recente com vendas
      const latestDate = new Date(
        Math.max(...salesData.map((s) => new Date(s.created_at).getTime()))
      )
      const targetDay = latestDate.toDateString()
  
      salesData.forEach((sale) => {
        const date = new Date(sale.created_at)
        if (date.toDateString() === targetDay) {
          const period = getPeriod(date)
          grouped[period] = (grouped[period] || 0) + sale.total_amount
        }
      })
    }
  
    return Object.entries(grouped)
      .map(([label, value]) => ({ label, value: Number(value.toFixed(2)) }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [viewMode, selectedWeekDay, salesData])
  
  if (loading) {
    return (
      <Card className="border-2 p-6 text-center">
        <p>Carregando dados...</p>
      </Card>
    )
  }

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

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ArrowUpRight, Sparkles } from "lucide-react"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { useState } from "react"
import salesData from "../public/data/exemplo_data.json"

// total deliverys

const totalDeliveryFee = salesData.reduce((acc, sale) => acc + sale.delivery_fee, 0);

// sem delivery

const zeroDeliveryCount = salesData.filter(sale => sale.delivery_fee === 0).length;

//
const CostDeliveryFee = totalDeliveryFee - zeroDeliveryCount;

const trendData = [
  { value: 20 },
  { value: 35 },
  { value: 25 },
  { value: 45 },
  { value: 38 },
  { value: 50 },
  { value: 42 },
]

const metrics = [
  {
    title: "Vendas com Delivery",
    value: CostDeliveryFee.toString(),
    subtitle: `/${totalDeliveryFee}`,
    icon: Users,
    trend: [],
    action: "Ver detalhes",
    sales: zeroDeliveryCount
  },
  {
    title: "Total Delivery Fee",
    value: totalDeliveryFee.toString(),
    subtitle: "Somatório",
    icon: Users,
    trend: [],
    action: "Ver detalhes",
    sales: totalDeliveryFee
  },

]

export function MetricsGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="relative overflow-hidden hover-lift smooth-transition animate-slide-up border-2 hover:border-accent/50"
          style={{ animationDelay: `${index * 0.1}s` }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 ${
              hoveredIndex === index ? "opacity-100" : ""
            }`}
          />

          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
            <div
              className={`p-2 rounded-lg bg-accent/10 transition-all duration-300 ${
                hoveredIndex === index ? "scale-110 bg-accent/20" : ""
              }`}
            >
              <metric.icon className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-1">
              <div className="text-3xl font-bold tracking-tight smooth-transition">{metric.value}</div>
              {metric.subtitle && <span className="text-lg text-muted-foreground">{metric.subtitle}</span>}
            </div>

            <div className={`mt-4 h-[40px] transition-all duration-300 ${hoveredIndex === index ? "scale-105" : ""}`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.trend}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--accent))"
                    strokeWidth={hoveredIndex === index ? 3 : 2}
                    dot={false}
                    className="transition-all duration-300"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full justify-between text-xs group hover:bg-accent/10 smooth-transition"
              onClick={() => console.log(`Action: ${metric.action}`)}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                {metric.action}
              </span>
              <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

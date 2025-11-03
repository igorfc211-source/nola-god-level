"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight } from "lucide-react"
import { useState } from "react"

const weakTopics = [
  {
    name: "Segurança Alimentar",
    icon: "🍕",
    progress: 74,
    label: "Correto",
    color: "bg-red-500",
  },
  {
    name: "Procedimentos de Compliance",
    icon: "📋",
    progress: 52,
    label: "Correto",
    color: "bg-orange-500",
  },
  {
    name: "Networking Empresarial",
    icon: "🤝",
    progress: 36,
    label: "Correto",
    color: "bg-red-600",
  },
]

const strongTopics = [
  {
    name: "Protocolos Covid",
    icon: "😷",
    progress: 95,
    label: "Correto",
    color: "bg-green-500",
  },
  {
    name: "Fundamentos de Cibersegurança",
    icon: "🔒",
    progress: 92,
    label: "Correto",
    color: "bg-green-500",
  },
  {
    name: "Políticas de Redes Sociais",
    icon: "📱",
    progress: 89,
    label: "Correto",
    color: "bg-green-600",
  },
]

export function TopicsSection() {
  const [hoveredWeak, setHoveredWeak] = useState<number | null>(null)


  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="hover-lift smooth-transition animate-slide-up border-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Tópicos Mais Fracos</CardTitle>
          <Button variant="ghost" size="sm" className="hover:bg-red-500/10 smooth-transition">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {weakTopics.map((topic, index) => (
            <div
              key={index}
              className="space-y-2 p-3 rounded-lg smooth-transition hover:bg-muted/50 cursor-pointer"
              onMouseEnter={() => setHoveredWeak(index)}
              onMouseLeave={() => setHoveredWeak(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xl smooth-transition ${hoveredWeak === index ? "scale-110 bg-red-500/20" : ""}`}
                  >
                    {topic.icon}
                  </div>
                  <span className="font-medium text-sm">{topic.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {topic.progress}% {topic.label}
                </span>
              </div>
              <Progress
                value={  topic.progress}
              
              />
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  )
}

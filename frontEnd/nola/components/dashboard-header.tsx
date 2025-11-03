import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Relatórios</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select defaultValue="all-time">
          <SelectTrigger className="w-[160px] smooth-transition hover:border-accent">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-time">Todo período</SelectItem>
            <SelectItem value="month">Este mês</SelectItem>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] smooth-transition hover:border-accent">
            <SelectValue placeholder="Pessoas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="inactive">Inativas</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] smooth-transition hover:border-accent">
            <SelectValue placeholder="Tópico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="security">Segurança</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          className="smooth-transition hover:bg-accent hover:text-accent-foreground bg-transparent"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  )
}

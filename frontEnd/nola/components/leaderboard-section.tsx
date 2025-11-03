"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowUpRight,  Trophy } from "lucide-react"

import { GitCompare as Compare } from "lucide-react"

type Loja = {
  id: number
  name: string
  city: string
  state: string
  is_active: boolean
}

type SaleRecord = {
  id?: number
  store_id: number
  total_amount: number // ← CORRIGIDO
  created_at?: string
}


type LojaMetrics = {
  store_id: number
  vendas_count: number
  revenue: number
  avg_ticket: number
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 3)
    .join("")
    .toUpperCase()
}

export function LeaderboardSection() {
  const [lojas, setLojas] = useState<Loja[]>([])
  const [metrics, setMetrics] = useState<Record<number, LojaMetrics>>({})
  const [hovered, setHovered] = useState<number | null>(null)
  const [selected, setSelected] = useState<Loja | null>(null)
  const [compareSet, setCompareSet] = useState<Loja[]>([])

  // Carrega lojas e tenta buscar vendas reais. Se não houver, gera métricas simuladas.
  useEffect(() => {
    // carrega lojas
    fetch("/data/lojas_data.json")
      .then((r) => r.json())
      .then((data: Loja[]) => {
        setLojas(data)
  
        // tenta carregar vendas reais
        return fetch("/data/exemplo_data.json")
          .then((r) => {
            if (!r.ok) throw new Error("no sales file")
            return r.json()
          })
          .then((sales: SaleRecord[]) => {
            // agrega vendas por loja
            const agg: Record<number, LojaMetrics> = {}
  
            for (const s of sales) {
              const id = s.store_id
              if (!agg[id]) {
                agg[id] = { store_id: id, vendas_count: 0, revenue: 0, avg_ticket: 0 }
              }
              agg[id].vendas_count += 1
              agg[id].revenue += Number(s.total_amount || 0)

            }
  
            // calcula ticket médio
            for (const idStr in agg) {
              const obj = agg[idStr]
              obj.avg_ticket = obj.vendas_count ? obj.revenue / obj.vendas_count : 0
            }
  
            setMetrics(agg)
          })
          .catch(() => {
            // se não houver arquivo de vendas, gerar métricas simuladas
            const sim: Record<number, LojaMetrics> = {}
            for (const loja of data) {
              const vendas_count = Math.floor(Math.random() * 500)
              const revenue = Math.round((Math.random() * 200000 + vendas_count * 20) * 100) / 100
              sim[loja.id] = {
                store_id: loja.id,
                vendas_count,
                revenue,
                avg_ticket: vendas_count ? +(revenue / vendas_count).toFixed(2) : 0,
              }
            }
            setMetrics(sim)
          })
      })
      .catch((err) => {
        console.error("Erro ao carregar /data/lojas_data.json:", err)
      })
  }, [])

  // lista de lojas ordenadas por revenue (mais vendidos)
  const lojasOrdenadas = useMemo(() => {
    return [...lojas].sort((a, b) => {
      const ma = metrics[a.id]?.revenue ?? 0
      const mb = metrics[b.id]?.revenue ?? 0
      return mb - ma
    })
  }, [lojas, metrics])

  function toggleCompare(loja: Loja) {
    setCompareSet((prev) => {
      const exists = prev.find((p) => p.id === loja.id)
      if (exists) return prev.filter((p) => p.id !== loja.id)
      if (prev.length >= 2) return [prev[1], loja] // mantém até 2: substitui o mais antigo
      return [...prev, loja]
    })
  }

  function formatCurrency(n = 0) {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 })
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Painel de Lista (esquerda) */}
      <Card className="hover-lift smooth-transition animate-slide-up border-2 hover:border-accent/30">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Comparativo de Lojas — Mais Vendidas</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-accent/10 smooth-transition">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
          {lojasOrdenadas.map((loja, idx) => {
            const m = metrics[loja.id]
            const revenue = m?.revenue ?? 0
            const vendas_count = m?.vendas_count ?? 0
            return (
              <div
                key={loja.id}
                onClick={() => setSelected(loja)}
                onMouseEnter={() => setHovered(loja.id)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer smooth-transition
                  ${
                    hovered === loja.id
                      ? "border-accent shadow-lg scale-105 bg-accent/5"
                      : "hover:border-accent/50"
                  } ${compareSet.find((c) => c.id === loja.id) ? "ring-2 ring-accent/30" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className={`smooth-transition ${hovered === loja.id ? "scale-110 ring-2 ring-accent" : ""}`}>
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                      {initialsFromName(loja.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{loja.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {loja.city} · {loja.state} · {loja.is_active ? "Ativa" : "Inativa"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold">{formatCurrency(revenue)}</div>
                    <div className="text-xs text-muted-foreground">{vendas_count} pedidos</div>
                  </div>
                  <Button
                    variant={compareSet.find((c) => c.id === loja.id) ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleCompare(loja)
                    }}
                    aria-pressed={!!compareSet.find((c) => c.id === loja.id)}
                    className="ml-2"
                  >
                    <Compare className="h-4 w-4 mr-2" />
                    {compareSet.find((c) => c.id === loja.id) ? "Comparando" : "Adicionar"}
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Painel de Detalhes + Comparação (direita) */}
      <Card className="hover-lift smooth-transition animate-slide-up border-2 hover:border-accent/30">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{selected ? selected.name : "Selecione uma loja"}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Clique numa loja à esquerda para ver detalhes. Use Adicionar para comparar até 2 lojas.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setCompareSet([]); setSelected(null) }}>
              Limpar
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {selected ? (
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Cidade:</span> {selected.city}
              </p>
              <p>
                <span className="font-semibold">Estado:</span> {selected.state}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className={selected.is_active ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                  {selected.is_active ? "Ativa" : "Inativa"}
                </span>
              </p>

              {/* métricas da loja selecionada */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Receita</div>
                  <div className="font-semibold text-lg">{formatCurrency(metrics[selected.id]?.revenue ?? 0)}</div>
                </div>
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Pedidos</div>
                  <div className="font-semibold text-lg">{metrics[selected.id]?.vendas_count ?? 0}</div>
                </div>
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Ticket Médio</div>
                  <div className="font-semibold text-lg">{formatCurrency(metrics[selected.id]?.avg_ticket ?? 0)}</div>
                </div>
              </div>

              <div className="pt-3">
                <Button onClick={() => toggleCompare(selected)}>{compareSet.find((c) => c.id === selected.id) ? "Remover da comparação" : "Adicionar à comparação"}</Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Nenhuma loja selecionada.</div>
          )}

          {/* Comparação lado-a-lado quando houver 2 lojas no compareSet */}
          {compareSet.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Compare className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">Comparação ({compareSet.length}/2)</h3>
                </div>
                <div className="text-xs text-muted-foreground">Receita · Pedidos · Ticket Médio</div>
              </div>

              <div className={`grid ${compareSet.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
                {compareSet.map((c) => {
                  const m = metrics[c.id] ?? { store_id: c.id, vendas_count: 0, revenue: 0, avg_ticket: 0 }
                  return (
                    <div key={c.id} className="p-3 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{initialsFromName(c.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-sm">{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.city} · {c.state}</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">{c.is_active ? "Ativa" : "Inativa"}</div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="text-xs text-muted-foreground">Receita</div>
                        <div className="text-lg font-semibold">{formatCurrency(m.revenue)}</div>

                        <div className="text-xs text-muted-foreground">Pedidos</div>
                        <div className="text-lg font-semibold">{m.vendas_count}</div>

                        <div className="text-xs text-muted-foreground">Ticket Médio</div>
                        <div className="text-lg font-semibold">{formatCurrency(m.avg_ticket)}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

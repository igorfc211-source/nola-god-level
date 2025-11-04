"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, GitCompare as Compare, ArrowUpRight } from "lucide-react";

type Loja = {
  id: number;
  name: string;
  city: string;
  state: string;
  is_active: boolean;
};

type SaleRecord = {
  id: number;
  store_id: number;
  total_amount: number;
  created_at: string;
};

type LojaMetrics = {
  store_id: number;
  vendas_count: number;
  revenue: number;
  avg_ticket: number;
};

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 3)
    .join("")
    .toUpperCase();
}

export function LeaderboardSection() {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [metrics, setMetrics] = useState<Record<number, LojaMetrics>>({});
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<Loja | null>(null);
  const [compareSet, setCompareSet] = useState<Loja[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [storesRes, salesRes] = await Promise.all([
          fetch("http://localhost:8000/stores"),
          fetch("http://localhost:8000/sales?limit=300000"),
        ]);

        const stores: Loja[] = await storesRes.json();
        const sales: SaleRecord[] = await salesRes.json();

        setLojas(stores);

        // agrega métricas
        const agg: Record<number, LojaMetrics> = {};

        for (const s of sales) {
          const id = s.store_id;
          if (!agg[id]) {
            agg[id] = { store_id: id, vendas_count: 0, revenue: 0, avg_ticket: 0 };
          }
          agg[id].vendas_count += 1;
          agg[id].revenue += s.total_amount;
        }

        for (const idStr in agg) {
          const m = agg[idStr];
          m.avg_ticket = m.revenue / m.vendas_count;
        }

        setMetrics(agg);
      } catch (err) {
        console.error("Erro ao carregar dados da API:", err);
      }
    }

    loadData();
  }, []);

  const lojasOrdenadas = useMemo(() => {
    return [...lojas].sort((a, b) => {
      const ma = metrics[a.id]?.revenue ?? 0;
      const mb = metrics[b.id]?.revenue ?? 0;
      return mb - ma;
    });
  }, [lojas, metrics]);

  function toggleCompare(loja: Loja) {
    setCompareSet((prev) => {
      const exists = prev.find((p) => p.id === loja.id);
      if (exists) return prev.filter((p) => p.id !== loja.id);
      if (prev.length >= 2) return [prev[1], loja];
      return [...prev, loja];
    });
  }

  function formatCurrency(n = 0) {
    return n.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Painel esquerdo */}
      <Card className="hover-lift smooth-transition animate-slide-up border-2 hover:border-accent/30">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Comparativo de Lojas — Mais Vendidas</CardTitle>
          </div>
          <Button variant="ghost" size="sm">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
          {lojasOrdenadas.map((loja) => {
            const m = metrics[loja.id];
            const revenue = m?.revenue ?? 0;
            const vendas_count = m?.vendas_count ?? 0;
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
                  <Avatar>
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
                      e.stopPropagation();
                      toggleCompare(loja);
                    }}
                  >
                    <Compare className="h-4 w-4 mr-2" />
                    {compareSet.find((c) => c.id === loja.id) ? "Comparando" : "Adicionar"}
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Painel direito */}
      <Card className="hover-lift smooth-transition animate-slide-up border-2 hover:border-accent/30">
        <CardHeader>
          <CardTitle>
            {compareSet.length === 2
              ? "Comparativo de Lojas"
              : selected
              ? selected.name
              : "Selecione uma loja"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {compareSet.length === 2 ? (
            <div className="grid grid-cols-2 gap-4">
              {compareSet.map((loja) => {
                const m = metrics[loja.id];
                return (
                  <div
                    key={loja.id}
                    className="border rounded-lg p-3 shadow-sm bg-muted/10 text-sm"
                  >
                    <p className="font-semibold">{loja.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {loja.city} - {loja.state}
                    </p>
                    <hr className="my-2" />
                    <p>Receita: {formatCurrency(m?.revenue ?? 0)}</p>
                    <p>Pedidos: {m?.vendas_count ?? 0}</p>
                    <p>Ticket Médio: {formatCurrency(m?.avg_ticket ?? 0)}</p>
                  </div>
                );
              })}
            </div>
          ) : selected ? (
            <div>
              <p>Cidade: {selected.city}</p>
              <p>Estado: {selected.state}</p>
              <p>Status: {selected.is_active ? "Ativa" : "Inativa"}</p>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div>
                  <div className="text-sm text-muted-foreground">Receita</div>
                  <div className="font-semibold text-lg">
                    {formatCurrency(metrics[selected.id]?.revenue ?? 0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Pedidos</div>
                  <div className="font-semibold text-lg">
                    {metrics[selected.id]?.vendas_count ?? 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Ticket Médio</div>
                  <div className="font-semibold text-lg">
                    {formatCurrency(metrics[selected.id]?.avg_ticket ?? 0)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma loja selecionada.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

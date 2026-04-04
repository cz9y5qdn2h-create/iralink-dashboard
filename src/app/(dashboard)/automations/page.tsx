"use client";

import { useState } from "react";
import { Zap, Filter, Plus, Sparkles } from "lucide-react";
import AutomationCard from "@/components/ui/AutomationCard";
import { mockAutomations } from "@/lib/mock-data";

type FilterType = "all" | "active" | "suggested" | "paused" | "failed";

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "active", label: "Actives" },
  { key: "suggested", label: "Suggerees IA" },
  { key: "paused", label: "En pause" },
  { key: "failed", label: "Erreurs" },
];

export default function AutomationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filtered =
    activeFilter === "all"
      ? mockAutomations
      : mockAutomations.filter((a) => a.status === activeFilter);

  const aiSuggested = mockAutomations.filter(
    (a) => a.status === "suggested"
  ).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold status-pulse" />
            <span className="tag">Automatisations</span>
          </div>
          <h1 className="font-serif text-display text-white">
            Vos automatisations
          </h1>
          <p className="text-body text-grey mt-1">
            {mockAutomations.length} automatisations dont{" "}
            <span className="text-gold">{aiSuggested} suggerees par l&apos;IA</span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gold text-black px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300">
          <Plus className="w-3.5 h-3.5" />
          Nouvelle
        </button>
      </div>

      {/* AI Suggestion Banner */}
      {aiSuggested > 0 && (
        <div className="bg-gold/[0.06] border border-gold/20 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-gold" />
            <div>
              <p className="text-small text-white">
                L&apos;IA a identifie {aiSuggested} nouvelle(s) automatisation(s)
                potentielle(s)
              </p>
              <p className="text-[11px] text-grey mt-0.5">
                Basees sur l&apos;analyse de vos flux de travail cette semaine
              </p>
            </div>
          </div>
          <button className="text-[11px] text-gold uppercase tracking-wider hover:text-gold-light transition-colors flex items-center gap-1.5">
            Voir les suggestions
            <Zap className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-1">
        <Filter className="w-3.5 h-3.5 text-grey mr-2" />
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider transition-all duration-300 ${
              activeFilter === f.key
                ? "bg-gold/10 text-gold border border-gold/20"
                : "text-grey hover:text-white border border-transparent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Automations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2px]">
        {filtered.map((automation, i) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
            delay={i * 80}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Zap className="w-8 h-8 text-grey mx-auto mb-3" />
          <p className="text-small text-grey">
            Aucune automatisation dans cette categorie
          </p>
        </div>
      )}
    </div>
  );
}

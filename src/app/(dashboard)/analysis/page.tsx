"use client";

import { useState } from "react";
import { Brain, Sparkles, TrendingUp, Clock, Zap, ArrowRight } from "lucide-react";
import AIInsightCard from "@/components/ui/AIInsightCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import { mockFindings, mockAILogs, mockMonthlyData } from "@/lib/mock-data";

export default function AnalysisPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisToast, setAnalysisToast] = useState(false);

  async function handleAnalyze() {
    if (analyzing) return;
    setAnalyzing(true);
    setAnalysisToast(false);
    await new Promise((r) => setTimeout(r, 2000));
    setAnalyzing(false);
    setAnalysisToast(true);
    setTimeout(() => setAnalysisToast(false), 5000);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Analysis toast banner */}
      {analysisToast && (
        <div className="bg-gold/10 border border-gold/30 px-5 py-3 flex items-center gap-3 animate-fade-up">
          <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
          <p className="text-small text-white">
            Analyse terminee — <span className="text-gold">3 nouvelles recommandations</span> disponibles
          </p>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold status-pulse" />
          <span className="tag">Analyse IA</span>
        </div>
        <h1 className="font-serif text-display text-white">
          Intelligence artificielle
        </h1>
        <p className="text-body text-grey mt-1">
          L&apos;IA Iralink analyse votre structure en continu et identifie les
          opportunites d&apos;automatisation.
        </p>
      </div>

      {/* AI Score Card */}
      <div className="bg-grey-light border border-border-dim p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start justify-between">
          <div>
            <span className="tag mb-3 block">Score d&apos;optimisation</span>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-[5rem] font-light text-white leading-none">
                82
              </span>
              <span className="text-heading text-grey font-serif">/ 100</span>
            </div>
            <p className="text-body text-grey mt-3 max-w-md">
              Votre entreprise utilise 82% de son potentiel d&apos;automatisation.
              L&apos;IA a identifie {mockFindings.length} axes d&apos;amelioration.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end mb-1">
                <TrendingUp className="w-3 h-3 text-gold" />
                <span className="font-mono text-mono-sm text-gold">+5pts</span>
              </div>
              <span className="text-[10px] text-grey">vs semaine derniere</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end mb-1">
                <Clock className="w-3 h-3 text-gold" />
                <span className="font-mono text-mono-sm text-gold">147h</span>
              </div>
              <span className="text-[10px] text-grey">sauvees au total</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end mb-1">
                <Zap className="w-3 h-3 text-gold" />
                <span className="font-mono text-mono-sm text-gold">8</span>
              </div>
              <span className="text-[10px] text-grey">automatisations actives</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1 bg-border-dim rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold/60 to-gold transition-all duration-1000"
            style={{ width: "82%" }}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[2px]">
        {/* Findings - 2 cols */}
        <div className="lg:col-span-2 space-y-[2px]">
          <div className="bg-grey-light border border-border-dim p-5 flex items-center gap-3">
            <div className="w-[22px] h-[2px] bg-gold" />
            <span className="tag">Recommandations</span>
            <span className="font-mono text-mono-sm text-gold">
              {mockFindings.length}
            </span>
          </div>
          {mockFindings.map((finding, i) => (
            <AIInsightCard key={i} finding={finding} delay={i * 100} />
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-[2px]">
          <ActivityChart
            data={mockMonthlyData}
            title="Heures sauvees par semaine"
            suffix="h"
          />

          {/* AI Log */}
          <div className="bg-grey-light border border-border-dim p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[22px] h-[2px] bg-gold" />
              <span className="tag">Journal IA</span>
            </div>
            <div className="space-y-3">
              {mockAILogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-2 pb-3 border-b border-border-dim last:border-0 last:pb-0"
                >
                  <Sparkles className={`w-3 h-3 mt-0.5 flex-shrink-0 ${
                    log.status === "error" ? "text-red-400" : "text-gold"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-[11px] text-white leading-tight truncate">
                      {log.action}
                    </p>
                    <p className="text-[10px] text-grey/50 font-mono mt-0.5">
                      {new Date(log.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Request Analysis CTA */}
          <div className="bg-grey-light border border-border-dim p-5 text-center">
            <Brain className="w-5 h-5 text-gold mx-auto mb-2" />
            <p className="text-small text-white mb-3">
              Lancer une analyse manuelle
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full bg-gold text-black py-2.5 text-[10px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300 flex items-center justify-center gap-1.5 disabled:opacity-70"
            >
              {analyzing ? (
                <>
                  <span className="animate-pulse">Analyse en cours...</span>
                </>
              ) : (
                <>
                  Analyser maintenant
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

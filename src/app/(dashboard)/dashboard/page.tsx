"use client";

import {
  Zap,
  Clock,
  BarChart3,
  Plug,
  Brain,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import MetricCard from "@/components/ui/MetricCard";
import AutomationCard from "@/components/ui/AutomationCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import {
  mockMetrics,
  mockAutomations,
  mockFindings,
  mockAILogs,
  mockWeeklyData,
} from "@/lib/mock-data";

const logStatusIcons = {
  success: { icon: CheckCircle, color: "text-gold" },
  error: { icon: AlertCircle, color: "text-red-400" },
  info: { icon: Info, color: "text-grey" },
};

export default function DashboardPage() {
  const recentAutomations = mockAutomations.slice(0, 3);
  const recentFindings = mockFindings.slice(0, 3);
  const recentLogs = mockAILogs.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold status-pulse" />
            <span className="tag">Dashboard</span>
          </div>
          <h1 className="font-serif text-display text-white">
            Bonjour, Theo
          </h1>
          <p className="text-body text-grey mt-1">
            Votre IA a sauve{" "}
            <span className="text-gold font-mono">
              {mockMetrics.time_saved_this_week}h
            </span>{" "}
            cette semaine. Voici le resume.
          </p>
        </div>
        <Link
          href="/automations"
          className="flex items-center gap-2 bg-gold text-black px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300"
        >
          Nouvelle automatisation
          <Zap className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px]">
        <MetricCard
          title="Automatisations actives"
          value={mockMetrics.active_automations}
          suffix={`/ ${mockMetrics.total_automations}`}
          trend={mockMetrics.trend_automations}
          trendLabel="vs semaine derniere"
          icon={Zap}
          delay={0}
        />
        <MetricCard
          title="Heures sauvees"
          value={mockMetrics.total_time_saved}
          suffix="h"
          trend={mockMetrics.trend_time_saved}
          trendLabel="ce mois"
          icon={Clock}
          delay={100}
        />
        <MetricCard
          title="Taux de succes"
          value={mockMetrics.success_rate}
          suffix="%"
          trend={2.1}
          icon={BarChart3}
          delay={200}
        />
        <MetricCard
          title="Score IA"
          value={mockMetrics.ai_score}
          suffix="/ 100"
          trend={5}
          trendLabel="en progression"
          icon={Brain}
          delay={300}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[2px]">
        {/* Automations - 2 cols */}
        <div className="lg:col-span-2 space-y-[2px]">
          {/* Section Header */}
          <div className="bg-grey-light border border-border-dim p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[22px] h-[2px] bg-gold" />
              <span className="tag">Automatisations recentes</span>
            </div>
            <Link
              href="/automations"
              className="flex items-center gap-1.5 text-grey hover:text-white transition-colors duration-300 group"
            >
              <span className="text-[11px] tracking-wide">Tout voir</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {recentAutomations.map((automation, i) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              delay={i * 100}
            />
          ))}
        </div>

        {/* AI Activity Log - 1 col */}
        <div className="space-y-[2px]">
          <div className="bg-grey-light border border-border-dim p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[22px] h-[2px] bg-gold" />
              <span className="tag">Activite IA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold status-pulse" />
              <span className="text-[10px] text-gold uppercase tracking-wider">
                En ligne
              </span>
            </div>
          </div>

          <div className="bg-grey-light border border-border-dim p-5 space-y-4">
            {recentLogs.map((log) => {
              const status = logStatusIcons[log.status];
              const StatusIcon = status.icon;
              return (
                <div key={log.id} className="flex gap-3 group">
                  <div className="flex flex-col items-center">
                    <StatusIcon
                      className={`w-4 h-4 ${status.color} flex-shrink-0 mt-0.5`}
                    />
                    <div className="w-px flex-1 bg-border-dim mt-2" />
                  </div>
                  <div className="flex-1 min-w-0 pb-4">
                    <p className="text-small text-white leading-tight">
                      {log.action}
                    </p>
                    <p className="text-[11px] text-grey mt-1 leading-relaxed">
                      {log.details}
                    </p>
                    <p className="text-[10px] text-grey/50 mt-1 font-mono">
                      {new Date(log.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts + Findings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[2px]">
        {/* Chart */}
        <ActivityChart
          data={mockWeeklyData}
          title="Heures sauvees cette semaine"
          suffix="h"
        />

        {/* AI Findings */}
        <div className="lg:col-span-2 space-y-[2px]">
          <div className="bg-grey-light border border-border-dim p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[22px] h-[2px] bg-gold" />
              <span className="tag">Dernieres recommandations IA</span>
            </div>
            <Link
              href="/analysis"
              className="flex items-center gap-1.5 text-grey hover:text-white transition-colors duration-300 group"
            >
              <span className="text-[11px] tracking-wide">
                Voir l&apos;analyse complete
              </span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {recentFindings.map((finding, i) => {
            const severityColor =
              finding.severity === "high"
                ? "border-l-gold"
                : finding.severity === "medium"
                ? "border-l-gold-light"
                : "border-l-grey";
            return (
              <div
                key={i}
                className={`bg-grey-light border border-border-dim border-l-2 ${severityColor} p-5 hover:bg-[#1A1A1A] transition-all duration-300 animate-fade-up`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Brain className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="tag">{finding.category}</span>
                      <span
                        className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 ${
                          finding.severity === "high"
                            ? "bg-gold/10 text-gold"
                            : "bg-gold-light/10 text-gold-light"
                        }`}
                      >
                        {finding.severity === "high"
                          ? "Prioritaire"
                          : "Moyen"}
                      </span>
                    </div>
                    <h4 className="text-small text-white mb-1">
                      {finding.title}
                    </h4>
                    <p className="text-[12px] text-grey leading-relaxed">
                      {finding.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integrations Quick View */}
      <div className="bg-grey-light border border-border-dim p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-[22px] h-[2px] bg-gold" />
            <span className="tag">Integrations connectees</span>
            <span className="font-mono text-mono-sm text-gold">
              {mockMetrics.connected_integrations}
            </span>
          </div>
          <Link
            href="/integrations"
            className="flex items-center gap-1.5 text-grey hover:text-white transition-colors duration-300 group"
          >
            <span className="text-[11px] tracking-wide">Gerer</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {["Google Workspace", "Slack", "Notion", "HubSpot", "Stripe", "Make"].map(
            (name, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 border border-border-dim hover:border-border transition-colors duration-300"
              >
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-[11px] text-white tracking-wide">
                  {name}
                </span>
              </div>
            )
          )}
          <Link
            href="/integrations"
            className="flex items-center gap-2 px-3 py-2 border border-border-dim text-grey hover:text-gold hover:border-border transition-all duration-300"
          >
            <Plug className="w-3 h-3" />
            <span className="text-[11px] tracking-wide">
              + Ajouter
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

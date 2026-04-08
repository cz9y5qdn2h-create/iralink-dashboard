"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Zap,
  Clock,
  CheckCircle,
  Play,
  Pause,
  Sparkles,
  Settings,
  Calendar,
  Loader2,
} from "lucide-react";
import { mockAutomations } from "@/lib/mock-data";

const mockExecutions = [
  { id: "1", date: "2026-04-04T09:15:00Z", status: "success", duration: "2.3s", trigger: "Email recu" },
  { id: "2", date: "2026-04-04T08:00:00Z", status: "success", duration: "1.8s", trigger: "Email recu" },
  { id: "3", date: "2026-04-03T16:42:00Z", status: "success", duration: "3.1s", trigger: "Email recu" },
  { id: "4", date: "2026-04-03T14:20:00Z", status: "error", duration: "0.5s", trigger: "Email recu" },
  { id: "5", date: "2026-04-03T11:05:00Z", status: "success", duration: "2.0s", trigger: "Email recu" },
  { id: "6", date: "2026-04-03T09:30:00Z", status: "success", duration: "1.9s", trigger: "Email recu" },
  { id: "7", date: "2026-04-02T17:00:00Z", status: "success", duration: "2.5s", trigger: "Email recu" },
  { id: "8", date: "2026-04-02T14:15:00Z", status: "success", duration: "1.7s", trigger: "Email recu" },
];

export default function AutomationDetailPage() {
  const params = useParams();
  const initialAutomation = mockAutomations.find((a) => a.id === params.id) || mockAutomations[0];
  const [automation, setAutomation] = useState(initialAutomation);
  const [statusLoading, setStatusLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function toggleStatus() {
    const newStatus = automation.status === "active" ? "paused" : "active";
    setStatusLoading(true);
    try {
      const res = await fetch(`/api/automations/${automation.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAutomation((prev) => ({ ...prev, status: newStatus }));
        setToast(`Automatisation ${newStatus === "active" ? "activée" : "mise en pause"}`);
        setTimeout(() => setToast(null), 3000);
      }
    } finally {
      setStatusLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gold text-black px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium shadow-lg animate-fade-up">
          {toast}
        </div>
      )}

      {/* Back + Header */}
      <div>
        <Link
          href="/automations"
          className="flex items-center gap-1.5 text-grey hover:text-white transition-colors text-[11px] uppercase tracking-wider mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Automatisations
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 border border-border flex items-center justify-center">
              <Zap className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="font-serif text-heading text-white">
                {automation.name}
              </h1>
              <p className="text-body text-grey mt-1 max-w-xl">
                {automation.description}
              </p>
              {automation.created_by === "ai" && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span className="text-[10px] text-gold uppercase tracking-widest">
                    Creee automatiquement par l&apos;IA Iralink
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 border border-border-dim text-grey hover:text-white hover:border-border transition-all duration-300">
              <Settings className="w-4 h-4" />
            </button>
            {automation.status === "active" ? (
              <button
                onClick={() => void toggleStatus()}
                disabled={statusLoading}
                className="flex items-center gap-2 px-4 py-2.5 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all duration-300 text-[11px] uppercase tracking-wider disabled:opacity-60"
              >
                {statusLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pause className="w-3.5 h-3.5" />}
                Pause
              </button>
            ) : (
              <button
                onClick={() => void toggleStatus()}
                disabled={statusLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-gold text-black hover:bg-gold-light transition-all duration-300 text-[11px] uppercase tracking-wider font-medium disabled:opacity-60"
              >
                {statusLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Activer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-[2px]">
        {[
          { icon: Clock, label: "Temps sauve", value: `${automation.time_saved_hours}h`, sub: "total" },
          { icon: Zap, label: "Executions", value: automation.runs_count.toString(), sub: "total" },
          { icon: CheckCircle, label: "Taux succes", value: `${automation.success_rate}%`, sub: "fiabilite" },
          { icon: Calendar, label: "Derniere exec.", value: automation.last_run_at ? new Date(automation.last_run_at).toLocaleDateString("fr-FR") : "---", sub: "" },
        ].map((stat, i) => (
          <div key={i} className="bg-grey-light border border-border-dim p-5">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className="w-4 h-4 text-gold" />
              <span className="tag">{stat.label}</span>
            </div>
            <span className="font-serif text-[1.75rem] text-white">{stat.value}</span>
            {stat.sub && <span className="text-[10px] text-grey ml-1.5">{stat.sub}</span>}
          </div>
        ))}
      </div>

      {/* Workflow Steps */}
      <div className="bg-grey-light border border-border-dim p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">Flux de travail</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Trigger */}
          <div className="bg-gold/10 border border-gold/20 px-4 py-3 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-gold" />
            <span className="text-[11px] text-white">{automation.trigger}</span>
          </div>
          {automation.actions.map((action, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-px bg-border-dim relative">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-gold/40 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent" />
              </div>
              <div className="bg-black border border-border-dim px-4 py-3 flex items-center gap-2">
                <span className="font-mono text-[10px] text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[11px] text-grey">{action.type.replace(/_/g, " ")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution History */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">Historique d&apos;execution</span>
          <span className="font-mono text-mono-sm text-gold">{mockExecutions.length}</span>
        </div>
        <div className="space-y-[1px]">
          {mockExecutions.map((exec, i) => (
            <div
              key={exec.id}
              className="bg-grey-light border border-border-dim px-5 py-3 flex items-center justify-between animate-fade-up hover:bg-[#1A1A1A] transition-colors duration-300"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${exec.status === "success" ? "bg-gold" : "bg-red-400"}`} />
                <span className="text-[12px] text-white font-mono">
                  {new Date(exec.date).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-[11px] text-grey">{exec.trigger}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-grey">{exec.duration}</span>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                    exec.status === "success"
                      ? "bg-gold/10 text-gold"
                      : "bg-red-400/10 text-red-400"
                  }`}
                >
                  {exec.status === "success" ? "Succes" : "Erreur"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

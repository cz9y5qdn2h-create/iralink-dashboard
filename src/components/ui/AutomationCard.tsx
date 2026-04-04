"use client";

import { Zap, Play, Pause, AlertTriangle, Sparkles, Clock, CheckCircle } from "lucide-react";
import type { Automation } from "@/types";

interface AutomationCardProps {
  automation: Automation;
  delay?: number;
}

const statusConfig = {
  active: {
    label: "Actif",
    color: "text-gold",
    bgColor: "bg-gold/10",
    icon: Play,
  },
  paused: {
    label: "En pause",
    color: "text-grey",
    bgColor: "bg-grey/10",
    icon: Pause,
  },
  suggested: {
    label: "Suggere par IA",
    color: "text-gold-light",
    bgColor: "bg-gold-light/10",
    icon: Sparkles,
  },
  failed: {
    label: "Erreur",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    icon: AlertTriangle,
  },
  draft: {
    label: "Brouillon",
    color: "text-grey",
    bgColor: "bg-grey/10",
    icon: Clock,
  },
};

export default function AutomationCard({
  automation,
  delay = 0,
}: AutomationCardProps) {
  const status = statusConfig[automation.status];
  const StatusIcon = status.icon;

  return (
    <div
      className="bg-grey-light border border-border-dim p-5 card-hover group animate-fade-up relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top bar on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400 ease-out" />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 border border-border flex items-center justify-center">
            <Zap className="w-4 h-4 text-gold" />
          </div>
          <div>
            <h3 className="text-small font-normal text-white leading-tight">
              {automation.name}
            </h3>
            {automation.created_by === "ai" && (
              <span className="text-[9px] text-gold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                Cree par l&apos;IA
              </span>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 ${status.bgColor}`}>
          <StatusIcon className={`w-3 h-3 ${status.color}`} />
          <span className={`text-[10px] uppercase tracking-wider ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      <p className="text-[13px] text-grey leading-relaxed mb-4 line-clamp-2">
        {automation.description}
      </p>

      <div className="flex items-center gap-4 pt-3 border-t border-border-dim">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-grey" />
          <span className="font-mono text-mono-sm text-gold">
            {automation.time_saved_hours}h
          </span>
          <span className="text-[10px] text-grey">sauvees</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3 h-3 text-grey" />
          <span className="font-mono text-mono-sm text-gold">
            {automation.success_rate}%
          </span>
          <span className="text-[10px] text-grey">succes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-grey" />
          <span className="font-mono text-mono-sm text-gold">
            {automation.runs_count}
          </span>
          <span className="text-[10px] text-grey">executions</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Brain, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Finding } from "@/types";

interface AIInsightCardProps {
  finding: Finding;
  delay?: number;
}

const severityColors = {
  high: "border-l-gold",
  medium: "border-l-gold-light",
  low: "border-l-grey",
};

export default function AIInsightCard({ finding, delay = 0 }: AIInsightCardProps) {
  const router = useRouter();

  return (
    <div
      className={`bg-grey-light border border-border-dim border-l-2 ${severityColors[finding.severity]} p-5 group animate-fade-up hover:bg-[#1A1A1A] transition-all duration-300`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
          <Brain className="w-4 h-4 text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="tag">{finding.category}</span>
            <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 ${
              finding.severity === "high" ? "bg-gold/10 text-gold" :
              finding.severity === "medium" ? "bg-gold-light/10 text-gold-light" :
              "bg-grey/10 text-grey"
            }`}>
              {finding.severity === "high" ? "Prioritaire" : finding.severity === "medium" ? "Moyen" : "Faible"}
            </span>
          </div>
          <h4 className="text-small text-white mb-1.5">{finding.title}</h4>
          <p className="text-[12px] text-grey leading-relaxed">{finding.description}</p>
        </div>
      </div>
      <button
        onClick={() => router.push("/automations")}
        className="flex items-center gap-1.5 mt-3 ml-11 text-gold/60 hover:text-gold transition-all duration-300 cursor-pointer group/btn"
      >
        <Sparkles className="w-3 h-3" />
        <span className="text-[10px] uppercase tracking-wider">Automatiser</span>
        <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
      </button>
    </div>
  );
}

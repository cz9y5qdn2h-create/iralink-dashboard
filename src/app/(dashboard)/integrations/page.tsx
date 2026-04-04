"use client";

import { Plug } from "lucide-react";
import IntegrationCard from "@/components/ui/IntegrationCard";
import { mockIntegrations } from "@/lib/mock-data";

export default function IntegrationsPage() {
  const connected = mockIntegrations.filter((i) => i.status === "connected");
  const available = mockIntegrations.filter((i) => i.status !== "connected");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold status-pulse" />
          <span className="tag">Integrations</span>
        </div>
        <h1 className="font-serif text-display text-white">
          Vos connecteurs
        </h1>
        <p className="text-body text-grey mt-1">
          Connectez vos outils pour que l&apos;IA puisse analyser et automatiser
          vos flux de travail.
        </p>
      </div>

      {/* Connected */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">
            Connectees ({connected.length})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[2px]">
          {connected.map((integration, i) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              delay={i * 80}
            />
          ))}
        </div>
      </div>

      {/* Available */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[22px] h-[2px] bg-grey" />
          <span className="tag text-grey">
            Disponibles ({available.length})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[2px]">
          {available.map((integration, i) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              delay={i * 80}
            />
          ))}
        </div>
      </div>

      {/* Custom Integration CTA */}
      <div className="bg-grey-light border border-border-dim p-8 text-center">
        <Plug className="w-6 h-6 text-grey mx-auto mb-3" />
        <h3 className="font-serif text-subheading text-white mb-2">
          Integration personnalisee ?
        </h3>
        <p className="text-body text-grey max-w-md mx-auto mb-5">
          Si votre outil n&apos;est pas dans la liste, contactez-nous. On peut
          connecter pratiquement n&apos;importe quelle API.
        </p>
        <button className="border border-gold text-gold px-6 py-2.5 text-[11px] uppercase tracking-[0.12em] hover:bg-gold hover:text-black transition-all duration-300">
          Demander une integration
        </button>
      </div>
    </div>
  );
}

"use client";

import { Check, X, Loader2, AlertCircle } from "lucide-react";
import type { Integration } from "@/types";

interface IntegrationCardProps {
  integration: Integration;
  onConnect?: () => void;
  delay?: number;
}

const statusIcons = {
  connected: { icon: Check, color: "text-gold", label: "Connecte" },
  disconnected: { icon: X, color: "text-grey", label: "Deconnecte" },
  error: { icon: AlertCircle, color: "text-red-400", label: "Erreur" },
  pending: { icon: Loader2, color: "text-gold-light", label: "En cours" },
};

const integrationIcons: Record<string, string> = {
  google_workspace: "G",
  notion: "N",
  slack: "S",
  make: "M",
  zapier: "Z",
  hubspot: "H",
  stripe_integration: "$",
  calendar: "C",
  drive: "D",
  gmail: "@",
  sheets: "#",
  trello: "T",
  airtable: "A",
  salesforce: "SF",
};

export default function IntegrationCard({
  integration,
  onConnect,
  delay = 0,
}: IntegrationCardProps) {
  const status = statusIcons[integration.status];
  const StatusIcon = status.icon;
  const isConnected = integration.status === "connected";

  return (
    <div
      className="bg-grey-light border border-border-dim p-5 card-hover group animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 border border-border flex items-center justify-center">
          <span className="font-mono text-sm text-gold">
            {integrationIcons[integration.type] || "?"}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 ${status.color}`}>
          <StatusIcon className={`w-3.5 h-3.5 ${integration.status === "pending" ? "loader" : ""}`} />
          <span className="text-[10px] uppercase tracking-wider">{status.label}</span>
        </div>
      </div>

      <h3 className="text-small font-normal text-white mb-1">{integration.name}</h3>

      {integration.last_sync_at && (
        <p className="text-[10px] text-grey">
          Derniere sync : {new Date(integration.last_sync_at).toLocaleDateString("fr-FR")}
        </p>
      )}

      <button
        onClick={onConnect}
        className={`mt-4 w-full py-2 text-[11px] uppercase tracking-wider transition-all duration-300 ${
          isConnected
            ? "border border-border-dim text-grey hover:text-white hover:border-border"
            : "bg-gold text-black hover:bg-gold-light font-medium"
        }`}
      >
        {isConnected ? "Configurer" : "Connecter"}
      </button>
    </div>
  );
}

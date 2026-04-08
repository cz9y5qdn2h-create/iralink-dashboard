"use client";

import { useState, useEffect } from "react";
import { Plug, ExternalLink, X, Loader2, CheckCircle, Link2 } from "lucide-react";

interface IntegrationDef {
  id: string;
  provider: string;
  name: string;
  description: string;
  isWebhook?: boolean;
  docUrl: string;
  envVar: string;
  envVarSecret?: string;
  logo: string;
}

const INTEGRATIONS: IntegrationDef[] = [
  {
    id: "google",
    provider: "google",
    name: "Google Workspace",
    description: "Gmail, Drive, Calendar — automatisez vos flux documentaires et emails.",
    docUrl: "https://console.cloud.google.com/apis/credentials",
    envVar: "GOOGLE_CLIENT_ID",
    envVarSecret: "GOOGLE_CLIENT_SECRET",
    logo: "G",
  },
  {
    id: "notion",
    provider: "notion",
    name: "Notion",
    description: "Synchronisez vos bases de données Notion avec vos automatisations.",
    docUrl: "https://www.notion.so/my-integrations",
    envVar: "NOTION_CLIENT_ID",
    envVarSecret: "NOTION_CLIENT_SECRET",
    logo: "N",
  },
  {
    id: "slack",
    provider: "slack",
    name: "Slack",
    description: "Envoyez des notifications et résumés IA directement dans vos canaux.",
    docUrl: "https://api.slack.com/apps",
    envVar: "SLACK_CLIENT_ID",
    envVarSecret: "SLACK_CLIENT_SECRET",
    logo: "S",
  },
  {
    id: "make",
    provider: "make",
    name: "Make (Integromat)",
    description: "Connectez vos scénarios Make via webhook pour déclencher vos automatisations.",
    docUrl: "https://www.make.com/en/api-documentation",
    envVar: "MAKE_WEBHOOK_URL",
    isWebhook: true,
    logo: "M",
  },
  {
    id: "hubspot",
    provider: "hubspot",
    name: "HubSpot",
    description: "Enrichissez vos contacts CRM avec des insights IA automatiques.",
    docUrl: "https://developers.hubspot.com/get-started",
    envVar: "HUBSPOT_CLIENT_ID",
    envVarSecret: "HUBSPOT_CLIENT_SECRET",
    logo: "H",
  },
];

interface ConnectedIntegration {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
}

type ModalState =
  | { type: "configure"; integration: IntegrationDef; envVar: string; docUrl: string }
  | { type: "webhook"; integration: IntegrationDef }
  | null;

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<ConnectedIntegration[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function loadConnected() {
    try {
      const res = await fetch("/api/integrations");
      if (!res.ok) return;
      const data = await res.json() as { integrations: ConnectedIntegration[] };
      setConnected(data.integrations ?? []);
    } catch { /* silent */ }
  }

  useEffect(() => {
    void loadConnected();
    // Check for ?connected= param
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("connected");
    if (provider) {
      showToast(`${provider} connecté avec succès !`);
      void loadConnected();
      window.history.replaceState({}, "", "/integrations");
    }
    const err = params.get("error");
    if (err) {
      showToast(`Erreur: ${err}`, "error");
      window.history.replaceState({}, "", "/integrations");
    }
  }, []);

  async function handleConnect(integration: IntegrationDef) {
    setLoadingId(integration.id);
    try {
      const res = await fetch(`/api/integrations/oauth/${integration.provider}`);

      if (integration.isWebhook) {
        setModal({ type: "webhook", integration });
        setLoadingId(null);
        return;
      }

      if (res.redirected) {
        // OAuth redirect happened
        window.location.href = res.url;
        return;
      }

      const data = await res.json() as { error?: string; provider?: string; docUrl?: string; envVar?: string };
      if (data.error === "not_configured") {
        setModal({
          type: "configure",
          integration,
          envVar: data.envVar ?? integration.envVar,
          docUrl: data.docUrl ?? integration.docUrl,
        });
      }
    } catch {
      showToast("Erreur de connexion", "error");
    }
    setLoadingId(null);
  }

  async function handleWebhookSave() {
    if (!webhookUrl || !modal || modal.type !== "webhook") return;
    // Save webhook URL as integration config
    const res = await fetch("/api/integrations/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: modal.integration.provider, webhookUrl }),
    });
    if (res.ok) {
      showToast(`${modal.integration.name} connecté !`);
      void loadConnected();
    } else {
      showToast("Erreur lors de la sauvegarde", "error");
    }
    setModal(null);
    setWebhookUrl("");
  }

  const connectedProviders = new Set(connected.map((c) => c.type));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium shadow-lg animate-fade-up ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-gold text-black"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold status-pulse" />
          <span className="tag">Intégrations</span>
        </div>
        <h1 className="font-serif text-display text-white">Vos connecteurs</h1>
        <p className="text-body text-grey mt-1">
          Connectez vos outils pour que l&apos;IA puisse analyser et automatiser vos flux de travail.
        </p>
      </div>

      {/* Connected */}
      {connected.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[22px] h-[2px] bg-gold" />
            <span className="tag">Connectées ({connected.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
            {connected.map((int, i) => (
              <div
                key={int.id}
                className="bg-grey-light border border-gold/20 rounded-2xl p-5 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gold/10 border border-gold/30 rounded-xl flex items-center justify-center">
                    <span className="text-gold font-bold">{int.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-small text-white">{int.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400">Connecté</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[22px] h-[2px] bg-grey" />
          <span className="tag text-grey">Disponibles ({INTEGRATIONS.length})</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
          {INTEGRATIONS.map((integration, i) => {
            const isConnected = connectedProviders.has(integration.provider);
            return (
              <div
                key={integration.id}
                className={`bg-grey-light border rounded-2xl p-5 animate-fade-up card-hover ${
                  isConnected ? "border-gold/20" : "border-border-dim"
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-gold/10 border border-border rounded-xl flex items-center justify-center">
                    <span className="text-gold font-bold text-sm">{integration.logo}</span>
                  </div>
                  {isConnected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-small text-white mb-1">{integration.name}</p>
                <p className="text-[11px] text-grey leading-relaxed mb-4">{integration.description}</p>
                <button
                  onClick={() => void handleConnect(integration)}
                  disabled={loadingId === integration.id || isConnected}
                  className={`w-full flex items-center justify-center gap-2 py-2 text-[11px] uppercase tracking-[0.1em] transition-all rounded-xl ${
                    isConnected
                      ? "bg-emerald-400/10 text-emerald-400 cursor-default"
                      : "border border-gold/40 text-gold hover:bg-gold hover:text-black"
                  }`}
                >
                  {loadingId === integration.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isConnected ? (
                    <><CheckCircle className="w-3.5 h-3.5" />Connecté</>
                  ) : integration.isWebhook ? (
                    <><Link2 className="w-3.5 h-3.5" />Configurer</>
                  ) : (
                    <><ExternalLink className="w-3.5 h-3.5" />Connecter</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Integration CTA */}
      <div className="bg-grey-light border border-border-dim rounded-2xl p-8 text-center">
        <Plug className="w-6 h-6 text-grey mx-auto mb-3" />
        <h3 className="font-serif text-subheading text-white mb-2">Intégration personnalisée ?</h3>
        <p className="text-body text-grey max-w-md mx-auto mb-5">
          Si votre outil n&apos;est pas dans la liste, contactez-nous. On peut connecter pratiquement n&apos;importe quelle API.
        </p>
        <a
          href="mailto:theo@iralink-agency.com?subject=Integration personnalisee"
          className="inline-block border border-gold text-gold px-6 py-2.5 text-[11px] uppercase tracking-[0.12em] hover:bg-gold hover:text-black transition-all duration-300 rounded-xl"
        >
          Demander une intégration
        </a>
      </div>

      {/* Configure Modal */}
      {modal?.type === "configure" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-grey-light border border-border rounded-2xl p-8 w-full max-w-lg animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-subheading text-white">Configuration requise</h2>
              <button onClick={() => setModal(null)} className="text-grey hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-body text-grey mb-4">
              Pour connecter <strong className="text-white">{modal.integration.name}</strong>, vous devez d&apos;abord
              créer une application OAuth et configurer les variables d&apos;environnement.
            </p>

            <div className="bg-black border border-border-dim rounded-xl p-4 space-y-3 mb-6">
              <p className="text-[10px] text-grey uppercase tracking-widest mb-2">Variables à configurer dans .env.local</p>
              <div className="font-mono text-[11px] text-gold space-y-1">
                <p>{modal.envVar}=votre_client_id</p>
                {modal.integration.envVarSecret && (
                  <p>{modal.integration.envVarSecret}=votre_client_secret</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-border-dim text-grey px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] hover:border-border hover:text-white transition-all rounded-xl"
              >
                Fermer
              </button>
              <a
                href={modal.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-gold text-black px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors rounded-xl"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Obtenir les clés
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Modal */}
      {modal?.type === "webhook" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-grey-light border border-border rounded-2xl p-8 w-full max-w-lg animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-subheading text-white">Configurer {modal.integration.name}</h2>
              <button onClick={() => setModal(null)} className="text-grey hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-body text-grey mb-4">
              Copiez l&apos;URL webhook depuis votre compte Make, puis collez-la ici.
            </p>

            <a
              href={modal.integration.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-gold hover:underline mb-4"
            >
              <ExternalLink className="w-3 h-3" />
              Ouvrir la documentation Make
            </a>

            <div>
              <label className="text-[10px] text-grey uppercase tracking-wider block mb-1.5">URL Webhook</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hook.eu1.make.com/..."
                className="w-full bg-black border border-border-dim rounded-xl px-4 py-2.5 text-small text-white placeholder:text-grey/50 outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-border-dim text-grey px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] hover:border-border hover:text-white transition-all rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={() => void handleWebhookSave()}
                disabled={!webhookUrl}
                className="flex-1 flex items-center justify-center gap-2 bg-gold text-black px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors rounded-xl disabled:opacity-60"
              >
                <Link2 className="w-3.5 h-3.5" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

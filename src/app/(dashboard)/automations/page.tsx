"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, Filter, Plus, Sparkles, Loader2, X } from "lucide-react";
import AutomationCard from "@/components/ui/AutomationCard";
import { mockAutomations } from "@/lib/mock-data";

type FilterType = "all" | "active" | "suggested" | "paused" | "failed";
type TriggerType = "Planifie" | "Webhook" | "Email" | "Formulaire" | "Manuel";

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "active", label: "Actives" },
  { key: "suggested", label: "Suggerees IA" },
  { key: "paused", label: "En pause" },
  { key: "failed", label: "Erreurs" },
];

export default function AutomationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showModal, setShowModal] = useState(false);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [declencheur, setDeclencheur] = useState<TriggerType>("Manuel");
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeFilter === "all"
      ? mockAutomations
      : mockAutomations.filter((a) => a.status === activeFilter);

  const aiSuggested = mockAutomations.filter(
    (a) => a.status === "suggested"
  ).length;

  function openModal() {
    setNom("");
    setDescription("");
    setDeclencheur("Manuel");
    setCreating(false);
    setCreated(false);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) closeModal();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setCreating(false);
    setCreated(true);
    setTimeout(() => {
      setShowModal(false);
    }, 1500);
  }

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    if (showModal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

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
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-gold text-black px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouvelle automatisation
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
          <button
            onClick={() => setActiveFilter("suggested")}
            className="text-[11px] text-gold uppercase tracking-wider hover:text-gold-light transition-colors flex items-center gap-1.5"
          >
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

      {/* Modal */}
      {showModal && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <div className="bg-[#111] border border-border-dim w-full max-w-lg mx-4 p-8 relative animate-fade-up">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-grey hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[22px] h-[2px] bg-gold" />
              <span className="tag">Nouvelle automatisation</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.14em] text-grey mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full bg-black border border-border-dim text-white px-4 py-3 text-small focus:border-gold/50 focus:outline-none transition-colors duration-300"
                  placeholder="Ex : Tri automatique des emails"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.14em] text-grey mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-border-dim text-white px-4 py-3 text-small focus:border-gold/50 focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Decrivez ce que fait cette automatisation..."
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.14em] text-grey mb-2">
                  Declencheur
                </label>
                <select
                  value={declencheur}
                  onChange={(e) => setDeclencheur(e.target.value as TriggerType)}
                  className="w-full bg-black border border-border-dim text-white px-4 py-3 text-small focus:border-gold/50 focus:outline-none transition-colors duration-300"
                >
                  <option value="Planifie">Planifie</option>
                  <option value="Webhook">Webhook</option>
                  <option value="Email">Email</option>
                  <option value="Formulaire">Formulaire</option>
                  <option value="Manuel">Manuel</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={creating || created}
                className="w-full bg-gold text-black py-3 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-80"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creation en cours...
                  </>
                ) : created ? (
                  "✓ Creee !"
                ) : (
                  "Creer l'automatisation"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

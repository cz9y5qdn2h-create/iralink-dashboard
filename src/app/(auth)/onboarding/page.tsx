"use client";

import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building2,
  Users,
  Plug,
  Brain,
  Check,
  Loader2,
} from "lucide-react";

const industries = [
  "Commerce / Retail",
  "Services / Consulting",
  "Restauration / Hotellerie",
  "Formation / Education",
  "Sante / Bien-etre",
  "BTP / Immobilier",
  "Tech / Digital",
  "Industrie / Fabrication",
  "Transport / Logistique",
  "Autre",
];

const teamSizes = [
  { label: "1-5", value: 3 },
  { label: "6-15", value: 10 },
  { label: "16-50", value: 30 },
  { label: "51-100", value: 75 },
  { label: "100+", value: 150 },
];

const tools = [
  { id: "google_workspace", name: "Google Workspace", icon: "G" },
  { id: "slack", name: "Slack", icon: "S" },
  { id: "notion", name: "Notion", icon: "N" },
  { id: "hubspot", name: "HubSpot", icon: "H" },
  { id: "make", name: "Make", icon: "M" },
  { id: "stripe", name: "Stripe", icon: "$" },
  { id: "trello", name: "Trello", icon: "T" },
  { id: "airtable", name: "Airtable", icon: "A" },
  { id: "salesforce", name: "Salesforce", icon: "SF" },
  { id: "calendar", name: "Google Calendar", icon: "C" },
];

const steps = [
  { icon: Building2, label: "Entreprise" },
  { icon: Users, label: "Equipe" },
  { icon: Plug, label: "Outils" },
  { icon: Brain, label: "Analyse" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState(0);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [processDescription, setProcessDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    setAnalyzing(true);
    // In production: save to Supabase, trigger first AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));
    window.location.href = "/";
  };

  const canNext =
    (step === 0 && industry) ||
    (step === 1 && teamSize > 0) ||
    (step === 2 && selectedTools.length > 0) ||
    step === 3;

  return (
    <div className="animate-fade-in">
      {/* Step Indicator */}
      <div className="flex items-center gap-3 mb-10">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          return (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 transition-all duration-300 ${
                  isActive
                    ? "text-gold"
                    : isDone
                    ? "text-gold/50"
                    : "text-grey/30"
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center border transition-all duration-300 ${
                    isActive
                      ? "border-gold bg-gold/10"
                      : isDone
                      ? "border-gold/30 bg-gold/5"
                      : "border-border-dim"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-wider hidden sm:inline">
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-px transition-colors duration-300 ${
                    i < step ? "bg-gold/30" : "bg-border-dim"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 0: Industry */}
      {step === 0 && (
        <div className="animate-fade-up">
          <h2 className="font-serif text-heading text-white mb-2">
            Votre secteur d&apos;activite
          </h2>
          <p className="text-body text-grey mb-6">
            L&apos;IA adaptera son analyse a votre industrie.
          </p>
          <div className="grid grid-cols-2 gap-[2px]">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={`p-4 text-left text-small transition-all duration-300 ${
                  industry === ind
                    ? "bg-gold/10 border border-gold/30 text-white"
                    : "bg-grey-light border border-border-dim text-grey hover:text-white hover:border-border"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Team Size */}
      {step === 1 && (
        <div className="animate-fade-up">
          <h2 className="font-serif text-heading text-white mb-2">
            Taille de votre equipe
          </h2>
          <p className="text-body text-grey mb-6">
            Cela nous aide a calibrer les recommandations d&apos;automatisation.
          </p>
          <div className="flex gap-[2px]">
            {teamSizes.map((ts) => (
              <button
                key={ts.label}
                onClick={() => setTeamSize(ts.value)}
                className={`flex-1 p-6 text-center transition-all duration-300 ${
                  teamSize === ts.value
                    ? "bg-gold/10 border border-gold/30"
                    : "bg-grey-light border border-border-dim hover:border-border"
                }`}
              >
                <span className="font-serif text-[1.75rem] text-white block">
                  {ts.label}
                </span>
                <span className="text-[10px] text-grey uppercase tracking-wider mt-1 block">
                  personnes
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Tools */}
      {step === 2 && (
        <div className="animate-fade-up">
          <h2 className="font-serif text-heading text-white mb-2">
            Vos outils actuels
          </h2>
          <p className="text-body text-grey mb-6">
            Selectionnez les outils que vous utilisez. L&apos;IA les connectera
            pour automatiser vos flux.
          </p>
          <div className="grid grid-cols-2 gap-[2px]">
            {tools.map((tool) => {
              const selected = selectedTools.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={`p-4 flex items-center gap-3 text-left transition-all duration-300 ${
                    selected
                      ? "bg-gold/10 border border-gold/30"
                      : "bg-grey-light border border-border-dim hover:border-border"
                  }`}
                >
                  <div
                    className={`w-9 h-9 border flex items-center justify-center ${
                      selected ? "border-gold/30" : "border-border-dim"
                    }`}
                  >
                    <span className="font-mono text-sm text-gold">
                      {tool.icon}
                    </span>
                  </div>
                  <span
                    className={`text-small ${
                      selected ? "text-white" : "text-grey"
                    }`}
                  >
                    {tool.name}
                  </span>
                  {selected && <Check className="w-3.5 h-3.5 text-gold ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Process Description */}
      {step === 3 && (
        <div className="animate-fade-up">
          <h2 className="font-serif text-heading text-white mb-2">
            Decrivez vos processus
          </h2>
          <p className="text-body text-grey mb-6">
            Optionnel mais precieux. Decrivez votre fonctionnement quotidien
            pour que l&apos;IA puisse faire une premiere analyse.
          </p>
          <textarea
            value={processDescription}
            onChange={(e) => setProcessDescription(e.target.value)}
            placeholder="Ex: Chaque matin, je verifie les emails clients, je trie les demandes de support et les demandes commerciales. Je mets a jour le CRM manuellement. Chaque vendredi, je compile les chiffres de la semaine dans un Google Sheet pour le rapport hebdomadaire..."
            rows={6}
            className="w-full bg-grey-light border border-border-dim text-white text-small px-4 py-3.5 resize-none placeholder:text-[#333] focus:border-gold/50 focus:outline-none transition-colors duration-300"
          />
          <div className="mt-4 bg-gold/[0.04] border border-gold/10 p-4 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] text-white">
                L&apos;IA Iralink va analyser votre structure
              </p>
              <p className="text-[11px] text-grey mt-0.5">
                Premiere analyse complete sous 24h. Resultats visibles dans
                votre dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 text-grey hover:text-white transition-colors text-[11px] uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            onClick={() => canNext && setStep(step + 1)}
            disabled={!canNext}
            className="flex items-center gap-2 bg-gold text-black px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-30"
          >
            Continuer
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={analyzing}
            className="flex items-center gap-2 bg-gold text-black px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-70"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 loader" />
                Analyse en cours...
              </>
            ) : (
              <>
                Lancer l&apos;analyse IA
                <Sparkles className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

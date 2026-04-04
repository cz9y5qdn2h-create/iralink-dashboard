"use client";

// Settings page - no lucide imports needed at top level

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
          <span className="tag">Parametres</span>
        </div>
        <h1 className="font-serif text-display text-white">Parametres</h1>
      </div>

      {/* Profile */}
      <div className="bg-grey-light border border-border-dim p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">Profil</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Nom complet", value: "Theo Coutard" },
            { label: "Email", value: "theo@iralink-agency.com" },
            { label: "Entreprise", value: "Iralink Agency" },
            { label: "Secteur", value: "Consulting / IA" },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-[10px] uppercase tracking-[0.14em] text-grey mb-2">
                {field.label}
              </label>
              <input
                type="text"
                defaultValue={field.value}
                className="w-full bg-black border border-border-dim text-white px-4 py-3 text-small focus:border-gold/50 focus:outline-none transition-colors duration-300"
              />
            </div>
          ))}
        </div>
        <button className="mt-5 bg-gold text-black px-6 py-2.5 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300">
          Sauvegarder
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-grey-light border border-border-dim p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">Notifications</span>
        </div>
        <div className="space-y-4">
          {[
            { label: "Rapports IA hebdomadaires", desc: "Recevoir le resume d'analyse par email chaque lundi", enabled: true },
            { label: "Alertes d'erreur", desc: "Etre notifie quand une automatisation echoue", enabled: true },
            { label: "Nouvelles suggestions IA", desc: "Notification quand l'IA identifie une nouvelle opportunite", enabled: true },
            { label: "Activite equipe", desc: "Recevoir les notifications d'activite de l'equipe", enabled: false },
          ].map((notif) => (
            <div
              key={notif.label}
              className="flex items-center justify-between py-3 border-b border-border-dim last:border-0"
            >
              <div>
                <p className="text-small text-white">{notif.label}</p>
                <p className="text-[11px] text-grey mt-0.5">{notif.desc}</p>
              </div>
              <button
                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                  notif.enabled ? "bg-gold" : "bg-grey/30"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black absolute top-0.5 transition-transform duration-300 ${
                    notif.enabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

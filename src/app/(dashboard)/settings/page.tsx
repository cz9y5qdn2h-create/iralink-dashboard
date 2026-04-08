"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  // Profile
  const [nom, setNom] = useState("Theo Coutard");
  const [email, setEmail] = useState("theo@iralink-agency.com");
  const [entreprise, setEntreprise] = useState("Iralink Agency");
  const [secteur, setSecteur] = useState("Consulting / IA");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Theme
  const [isDark, setIsDark] = useState(true);

  // Notifications
  const [notif1, setNotif1] = useState(true);
  const [notif2, setNotif2] = useState(true);
  const [notif3, setNotif3] = useState(true);
  const [notif4, setNotif4] = useState(false);

  // Security
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("iralink-theme");
    if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light-mode");
    }
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.remove("light-mode");
      localStorage.setItem("iralink-theme", "dark");
    } else {
      document.documentElement.classList.add("light-mode");
      localStorage.setItem("iralink-theme", "light");
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);
    await new Promise((r) => setTimeout(r, 1000));
    setSavingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordFeedback("Les mots de passe ne correspondent pas.");
      return;
    }
    setPasswordFeedback("Mot de passe mis a jour !");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setPasswordFeedback("");
      setShowPasswordForm(false);
    }, 2500);
  }

  const notifications = [
    { label: "Rapports IA hebdomadaires", desc: "Recevoir le resume d'analyse par email chaque lundi", value: notif1, set: setNotif1 },
    { label: "Alertes d'erreur", desc: "Etre notifie quand une automatisation echoue", value: notif2, set: setNotif2 },
    { label: "Nouvelles suggestions IA", desc: "Notification quand l'IA identifie une nouvelle opportunite", value: notif3, set: setNotif3 },
    { label: "Activite equipe", desc: "Recevoir les notifications d'activite de l'equipe", value: notif4, set: setNotif4 },
  ];

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
        <form onSubmit={saveProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Nom complet", value: nom, set: setNom },
              { label: "Email", value: email, set: setEmail },
              { label: "Entreprise", value: entreprise, set: setEntreprise },
              { label: "Secteur", value: secteur, set: setSecteur },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-[10px] uppercase tracking-[0.14em] text-grey mb-2">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className="w-full bg-black border border-border-dim text-white px-4 py-3 text-small focus:border-gold/50 focus:outline-none transition-colors duration-300"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-5">
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-gold text-black px-6 py-2.5 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-70"
            >
              {savingProfile ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            {profileSaved && (
              <span className="text-[11px] text-gold animate-fade-up">✓ Sauvegarde !</span>
            )}
          </div>
        </form>
      </div>

      {/* Appearance */}
      <div className="bg-grey-light border border-border-dim p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">Apparence</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-small text-white">Theme de l&apos;interface</p>
            <p className="text-[11px] text-grey mt-0.5">
              {isDark ? "Mode sombre actif" : "Mode clair actif"}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 border border-border-dim px-4 py-2.5 text-[11px] uppercase tracking-wider text-white hover:border-gold/50 transition-colors duration-300"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-gold" />
                Passer en clair
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-gold" />
                Passer en sombre
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-grey-light border border-border-dim p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">Notifications</span>
        </div>
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.label}
              className="flex items-center justify-between py-3 border-b border-border-dim last:border-0"
            >
              <div>
                <p className="text-small text-white">{notif.label}</p>
                <p className="text-[11px] text-grey mt-0.5">{notif.desc}</p>
              </div>
              <button
                onClick={() => notif.set((v: boolean) => !v)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                  notif.value ? "bg-gold" : "bg-grey/30"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black absolute top-0.5 transition-transform duration-300 ${
                    notif.value ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-grey-light border border-border-dim p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">Securite</span>
        </div>
        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="border border-border-dim text-white px-5 py-2.5 text-[11px] uppercase tracking-[0.12em] hover:border-gold/50 transition-colors duration-300"
          >
            Changer le mot de passe
          </button>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-sm">
            {[
              { label: "Ancien mot de passe", value: oldPassword, set: setOldPassword, show: showOld, toggle: () => setShowOld((v) => !v) },
              { label: "Nouveau mot de passe", value: newPassword, set: setNewPassword, show: showNew, toggle: () => setShowNew((v) => !v) },
              { label: "Confirmer le mot de passe", value: confirmPassword, set: setConfirmPassword, show: showNew, toggle: () => setShowNew((v) => !v) },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block text-[10px] uppercase tracking-[0.14em] text-grey mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.show ? "text" : "password"}
                    required
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    className="w-full bg-black border border-border-dim text-white px-4 py-3 pr-10 text-small focus:border-gold/50 focus:outline-none transition-colors duration-300"
                  />
                  <button
                    type="button"
                    onClick={field.toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-grey hover:text-white transition-colors"
                  >
                    {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            {passwordFeedback && (
              <p className={`text-[11px] animate-fade-up ${passwordFeedback.includes("pas") ? "text-red-400" : "text-gold"}`}>
                {passwordFeedback}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-gold text-black px-5 py-2.5 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300"
              >
                Mettre a jour
              </button>
              <button
                type="button"
                onClick={() => { setShowPasswordForm(false); setPasswordFeedback(""); }}
                className="border border-border-dim text-grey px-5 py-2.5 text-[11px] uppercase tracking-wider hover:text-white transition-colors duration-300"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account */}
      <div className="bg-grey-light border border-border-dim p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">Compte</span>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between py-2 border-b border-border-dim">
            <span className="text-[10px] uppercase tracking-[0.14em] text-grey">Email</span>
            <span className="text-small text-white">{email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border-dim">
            <span className="text-[10px] uppercase tracking-[0.14em] text-grey">Role</span>
            <span className="text-small text-gold">Admin</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[10px] uppercase tracking-[0.14em] text-grey">Date de creation</span>
            <span className="text-small text-white">10 mars 2026</span>
          </div>
        </div>
        <a
          href="mailto:theo@iralink-agency.com"
          className="inline-block border border-border-dim text-white px-5 py-2.5 text-[11px] uppercase tracking-[0.12em] hover:border-gold/50 transition-colors duration-300"
        >
          Contacter le support
        </a>
      </div>
    </div>
  );
}

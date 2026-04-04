"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    company_name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'inscription");
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "full_name", label: "Nom complet", type: "text", placeholder: "Theo Coutard" },
    { key: "email", label: "Email professionnel", type: "email", placeholder: "theo@entreprise.com" },
    { key: "company_name", label: "Entreprise", type: "text", placeholder: "Nom de votre entreprise" },
    { key: "password", label: "Mot de passe", type: "password", placeholder: "Min. 8 caracteres" },
  ];

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h2 className="font-serif text-heading text-white mb-2">
          Creer un compte
        </h2>
        <p className="text-body text-grey">
          14 jours d&apos;essai gratuit. Aucune carte requise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-400/10 border border-red-400/20 text-red-400 text-small">
            {error}
          </div>
        )}

        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-[10px] uppercase tracking-[0.14em] text-grey mb-2">
              {f.label}
            </label>
            <input
              type={f.type}
              value={form[f.key as keyof typeof form]}
              onChange={(e) => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              required
              className="w-full bg-grey-light border border-border-dim text-white px-4 py-3.5 text-small placeholder:text-[#333] focus:border-gold/50 focus:outline-none transition-colors duration-300"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-black py-3.5 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 loader" />
          ) : (
            <>
              Demarrer l&apos;essai gratuit
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-[11px] text-grey">
        Deja un compte ?{" "}
        <Link
          href="/login"
          className="text-gold hover:text-gold-light transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}

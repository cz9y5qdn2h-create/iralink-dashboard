"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Identifiants incorrects");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h2 className="font-serif text-heading text-white mb-2">Connexion</h2>
        <p className="text-body text-grey">
          Accedez a votre dashboard d&apos;automatisation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-400/10 border border-red-400/20 text-red-400 text-small">
            {error}
          </div>
        )}

        <div>
          <label className="block text-[10px] uppercase tracking-[0.14em] text-grey mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="theo@iralink-agency.com"
            required
            className="w-full bg-grey-light border border-border-dim text-white px-4 py-3.5 text-small placeholder:text-[#333] focus:border-gold/50 focus:outline-none transition-colors duration-300"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.14em] text-grey mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-grey-light border border-border-dim text-white px-4 py-3.5 text-small placeholder:text-[#333] focus:border-gold/50 focus:outline-none transition-colors duration-300"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 accent-gold bg-grey-light border-border-dim"
            />
            <span className="text-[11px] text-grey">Se souvenir de moi</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-[11px] text-gold hover:text-gold-light transition-colors"
          >
            Mot de passe oublie ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-black py-3.5 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 loader" />
          ) : (
            <>
              Se connecter
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-[11px] text-grey">
        Acces sur invitation uniquement.{" "}
        <a
          href="mailto:theo@iralink-agency.com"
          className="text-gold hover:text-gold-light transition-colors"
        >
          Contacter Iralink
        </a>
      </p>
    </div>
  );
}

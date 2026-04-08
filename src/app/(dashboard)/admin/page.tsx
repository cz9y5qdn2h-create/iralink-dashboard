"use client";

import { useState } from "react";
import { UserPlus, Copy, Check, Loader2, Shield, Eye, EyeOff, Trash2 } from "lucide-react";

interface GeneratedClient {
  company: string;
  email: string;
  password: string;
  createdAt: string;
}

function generatePassword(length = 16): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function AdminPage() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState<GeneratedClient | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedClient[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGenerated(null);

    const password = generatePassword();

    try {
      const res = await fetch("/api/admin/create-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la creation du compte");
        return;
      }

      const client: GeneratedClient = {
        company,
        email,
        password,
        createdAt: new Date().toISOString(),
      };
      setGenerated(client);
      setHistory((prev) => [client, ...prev]);
      setCompany("");
      setEmail("");
    } catch {
      setError("Erreur reseau");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-gold" />
          <span className="tag">Admin</span>
        </div>
        <h1 className="font-serif text-heading text-white">Gestion des acces</h1>
        <p className="text-body text-grey mt-1">
          Generez les identifiants d&apos;acces pour vos clients. Les comptes sont crees directement dans Supabase.
        </p>
      </div>

      {/* Form */}
      <div className="bg-grey-light border border-border-dim p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">Nouveau client</span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-400/10 border border-red-400/20 text-red-400 text-small">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.14em] text-grey mb-2">
                Nom de l&apos;entreprise
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                required
                className="w-full bg-black border border-border-dim text-white px-4 py-3 text-small placeholder:text-[#333] focus:border-gold/50 focus:outline-none transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.14em] text-grey mb-2">
                Email client
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@acme.com"
                required
                className="w-full bg-black border border-border-dim text-white px-4 py-3 text-small placeholder:text-[#333] focus:border-gold/50 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          <p className="text-[11px] text-grey">
            Un mot de passe securise sera genere automatiquement. Transmettez les identifiants au client par canal securise.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gold text-black px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 loader" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            Generer les identifiants
          </button>
        </form>
      </div>

      {/* Generated Credentials */}
      {generated && (
        <div className="bg-gold/5 border border-gold/20 p-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-[22px] h-[2px] bg-gold" />
            <span className="tag text-gold">Identifiants generes</span>
            <div className="w-2 h-2 rounded-full bg-gold status-pulse" />
          </div>

          <div className="space-y-3">
            {/* Company */}
            <div className="flex items-center justify-between bg-black border border-border-dim px-4 py-3">
              <div>
                <div className="text-[10px] text-grey uppercase tracking-wider mb-0.5">Entreprise</div>
                <div className="text-small text-white font-mono">{generated.company}</div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between bg-black border border-border-dim px-4 py-3">
              <div>
                <div className="text-[10px] text-grey uppercase tracking-wider mb-0.5">Email</div>
                <div className="text-small text-white font-mono">{generated.email}</div>
              </div>
              <button
                onClick={() => copyToClipboard(generated.email, "email")}
                className="p-2 text-grey hover:text-gold transition-colors"
              >
                {copied === "email" ? <Check className="w-4 h-4 text-gold" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between bg-black border border-border-dim px-4 py-3">
              <div>
                <div className="text-[10px] text-grey uppercase tracking-wider mb-0.5">Mot de passe</div>
                <div className="text-small text-white font-mono">
                  {showPassword ? generated.password : "•".repeat(generated.password.length)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-grey hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(generated.password, "password")}
                  className="p-2 text-grey hover:text-gold transition-colors"
                >
                  {copied === "password" ? <Check className="w-4 h-4 text-gold" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Copy all */}
            <button
              onClick={() =>
                copyToClipboard(
                  `Email: ${generated.email}\nMot de passe: ${generated.password}`,
                  "all"
                )
              }
              className="w-full flex items-center justify-center gap-2 border border-border-dim text-grey hover:text-white hover:border-border px-4 py-2.5 text-[11px] uppercase tracking-wider transition-all duration-300"
            >
              {copied === "all" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-gold" />
                  Copie !
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copier les deux
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[22px] h-[2px] bg-gold" />
            <span className="tag">Session en cours</span>
            <span className="font-mono text-mono-sm text-gold">{history.length}</span>
          </div>
          <div className="space-y-[1px]">
            {history.map((client, i) => (
              <div
                key={i}
                className="bg-grey-light border border-border-dim px-5 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                  <div>
                    <span className="text-[12px] text-white">{client.company}</span>
                    <span className="text-[11px] text-grey ml-3">{client.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-grey">
                    {new Date(client.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Email: ${client.email}\nMot de passe: ${client.password}`,
                        `history-${i}`
                      )
                    }
                    className="p-1.5 text-grey hover:text-gold transition-colors"
                  >
                    {copied === `history-${i}` ? (
                      <Check className="w-3.5 h-3.5 text-gold" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setHistory((prev) => prev.filter((_, idx) => idx !== i))}
                    className="p-1.5 text-grey hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

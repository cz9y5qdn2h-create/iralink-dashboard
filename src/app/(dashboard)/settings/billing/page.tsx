"use client";

import { CreditCard, Check, ArrowRight, Sparkles } from "lucide-react";
import { PLANS, type PlanKey } from "@/lib/stripe";

const currentPlan: PlanKey = "pro";

export default function BillingPage() {
  const handleCheckout = async (planKey: PlanKey) => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  const handlePortal = async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Portal error:", err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
          <span className="tag">Facturation</span>
        </div>
        <h1 className="font-serif text-display text-white">
          Abonnement
        </h1>
        <p className="text-body text-grey mt-1">
          Gerez votre plan et vos informations de paiement.
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-gold/[0.06] border border-gold/20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-small text-white">
              Plan actuel :{" "}
              <span className="text-gold font-medium">
                {PLANS[currentPlan].name}
              </span>
            </p>
            <p className="text-[11px] text-grey mt-0.5">
              Prochain paiement le 1er mai 2026 —{" "}
              <span className="font-mono text-gold">
                {PLANS[currentPlan].price} EUR
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={handlePortal}
          className="text-[11px] text-gold uppercase tracking-wider hover:text-gold-light transition-colors flex items-center gap-1.5"
        >
          Gerer le paiement
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
        {(Object.entries(PLANS) as [PlanKey, (typeof PLANS)[PlanKey]][]).map(
          ([key, plan]) => {
            const isCurrent = key === currentPlan;
            return (
              <div
                key={key}
                className={`bg-grey-light border p-6 relative ${
                  isCurrent
                    ? "border-gold/30"
                    : "border-border-dim"
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold" />
                )}
                {key === "pro" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gold text-black px-2.5 py-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-[9px] uppercase tracking-wider font-medium">
                      Populaire
                    </span>
                  </div>
                )}

                <h3 className="font-serif text-subheading text-white mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="font-serif text-[2.5rem] font-light text-white">
                    {plan.price}
                  </span>
                  <span className="text-small text-grey">EUR / mois</span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] text-grey">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !isCurrent && handleCheckout(key)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 text-[11px] uppercase tracking-[0.12em] transition-all duration-300 ${
                    isCurrent
                      ? "border border-gold/30 text-gold cursor-default"
                      : "bg-gold text-black hover:bg-gold-light font-medium"
                  }`}
                >
                  {isCurrent ? "Plan actuel" : "Choisir ce plan"}
                </button>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

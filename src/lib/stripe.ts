import Stripe from "stripe";

// Lazy initialization to avoid crash when env vars aren't set (build time)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  starter: {
    name: "Starter",
    price: 800,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "",
    features: [
      "Jusqu'a 5 automatisations actives",
      "Analyse IA hebdomadaire",
      "3 integrations",
      "Support email",
    ],
  },
  pro: {
    name: "Pro",
    price: 1200,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    features: [
      "Automatisations illimitees",
      "Analyse IA quotidienne",
      "Integrations illimitees",
      "Support prioritaire",
      "Rapports avances",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 1500,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
    features: [
      "Tout Pro inclus",
      "Agent IA dedie",
      "Onboarding personnalise",
      "SLA garanti",
      "Support telephone",
      "Formation equipe",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

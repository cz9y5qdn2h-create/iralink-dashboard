import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-grid overflow-hidden">
        <div className="glow-gold absolute inset-0" />
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-border flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-xl tracking-wider">
                <span className="text-gold">I</span>
                <span className="text-white">RALINK</span>
              </span>
              <span className="font-serif text-sm italic text-gold tracking-wide">
                dashboard
              </span>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="font-serif text-display text-white mb-6">
              L&apos;IA qui automatise votre entreprise.
            </h1>
            <p className="text-body text-grey leading-relaxed">
              Connectez vos outils. L&apos;IA analyse votre fonctionnement,
              identifie les taches repetitives, et cree les automatisations
              pour vous.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <div>
                <span className="font-serif text-[2rem] text-white">15h</span>
                <p className="text-[10px] text-grey uppercase tracking-wider mt-1">
                  Sauvees / semaine
                </p>
              </div>
              <div className="w-px h-12 bg-border-dim" />
              <div>
                <span className="font-serif text-[2rem] text-white">97%</span>
                <p className="text-[10px] text-grey uppercase tracking-wider mt-1">
                  Taux de succes
                </p>
              </div>
              <div className="w-px h-12 bg-border-dim" />
              <div>
                <span className="font-serif text-[2rem] text-white">0</span>
                <p className="text-[10px] text-grey uppercase tracking-wider mt-1">
                  Complexite
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-grey/40">
            &copy; 2026 Iralink Agency — theo@iralink-agency.com
          </p>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-serif text-[28vw] text-white/[0.012] select-none">
            IA
          </span>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Brain, Clock, Shield, Phone, Mail, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-[72px] border-b border-border-dim bg-black/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold/10 border border-border flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-lg tracking-wider">
              <span className="text-gold">I</span>
              <span className="text-white">RALINK</span>
            </span>
            <span className="font-serif text-sm italic text-gold tracking-wide">dashboard</span>
          </div>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 border border-border-dim text-grey hover:text-white hover:border-border px-5 py-2.5 text-[11px] uppercase tracking-wider transition-all duration-300"
        >
          Connexion client
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="pt-[72px] min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto px-8 py-24">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-gold status-pulse" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em]">Outil exclusif — sur invitation</span>
          </div>

          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-white mb-6 max-w-3xl">
            L&apos;intelligence artificielle au{" "}
            <span className="text-gold italic">service</span>{" "}
            de votre entreprise.
          </h1>

          <p className="text-body text-grey max-w-xl leading-relaxed mb-12">
            Iralink Dashboard automatise vos processus metier, analyse vos operations en temps reel et genere des economies de temps mesurables — sans effort de votre part.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="mailto:theo@iralink-agency.com"
              className="flex items-center gap-2 bg-gold text-black px-8 py-4 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300"
            >
              Prendre rendez-vous
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://iralink-agency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-border-dim text-grey hover:text-white hover:border-border px-8 py-4 text-[11px] uppercase tracking-wider transition-all duration-300"
            >
              Notre agence
              <Globe className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-border-dim" />

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="text-[10px] text-gold uppercase tracking-[0.2em]">Fonctionnalites</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          {[
            {
              icon: Zap,
              title: "Automatisations intelligentes",
              desc: "Creez, activez et monitorer des automatisations complexes en quelques clics. L'IA suggere de nouvelles optimisations chaque semaine.",
            },
            {
              icon: Brain,
              title: "Analyse IA continue",
              desc: "Votre assistant IA analyse en permanence vos processus et identifie les opportunites d'economie de temps et de cout.",
            },
            {
              icon: Clock,
              title: "ROI mesurable",
              desc: "Chaque heure economisee est tracee. Visualisez l'impact reel de l'automatisation sur votre activite en temps reel.",
            },
            {
              icon: Shield,
              title: "Outil sur-mesure",
              desc: "Le dashboard est configure specifiquement pour votre entreprise, vos outils et vos processus. Rien de generique.",
            },
          ].map((f, i) => (
            <div key={i} className="bg-grey-light border border-border-dim p-8 group hover:bg-[#151515] transition-colors duration-300">
              <div className="w-10 h-10 border border-border-dim flex items-center justify-center mb-6 group-hover:border-gold/30 transition-colors duration-300">
                <f.icon className="w-4 h-4 text-gold" />
              </div>
              <h3 className="font-serif text-subheading text-white mb-3">{f.title}</h3>
              <p className="text-body text-grey leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-border-dim" />

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="grid grid-cols-3 gap-[2px]">
          {[
            { value: "40h+", label: "Economisees par mois en moyenne" },
            { value: "98%", label: "Taux de succes des automatisations" },
            { value: "24/7", label: "L'IA travaille pour vous" },
          ].map((s, i) => (
            <div key={i} className="bg-grey-light border border-border-dim p-8 text-center">
              <div className="font-serif text-[3rem] text-gold leading-none mb-3">{s.value}</div>
              <div className="text-[11px] text-grey uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-border-dim" />

      {/* Contact / CTA */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-[22px] h-[2px] bg-gold" />
              <span className="text-[10px] text-gold uppercase tracking-[0.2em]">Acces sur demande</span>
            </div>
            <h2 className="font-serif text-[2.5rem] leading-tight text-white mb-6">
              Interessé par Iralink Dashboard ?
            </h2>
            <p className="text-body text-grey leading-relaxed mb-8">
              L&apos;outil n&apos;est pas en vente libre. Chaque acces est configure sur mesure pour l&apos;entreprise cliente apres un echange avec notre equipe.
            </p>
            <p className="text-body text-grey leading-relaxed">
              Contactez-nous pour discuter de votre situation et voir si Iralink Dashboard peut transformer votre activite.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="mailto:theo@iralink-agency.com"
              className="flex items-center gap-4 bg-grey-light border border-border-dim p-5 hover:border-gold/30 hover:bg-[#151515] transition-all duration-300 group"
            >
              <div className="w-10 h-10 border border-border-dim flex items-center justify-center group-hover:border-gold/30 transition-colors duration-300">
                <Mail className="w-4 h-4 text-gold" />
              </div>
              <div>
                <div className="text-[10px] text-grey uppercase tracking-wider mb-0.5">Email</div>
                <div className="text-small text-white">theo@iralink-agency.com</div>
              </div>
            </a>

            <a
              href="tel:+33000000000"
              className="flex items-center gap-4 bg-grey-light border border-border-dim p-5 hover:border-gold/30 hover:bg-[#151515] transition-all duration-300 group"
            >
              <div className="w-10 h-10 border border-border-dim flex items-center justify-center group-hover:border-gold/30 transition-colors duration-300">
                <Phone className="w-4 h-4 text-gold" />
              </div>
              <div>
                <div className="text-[10px] text-grey uppercase tracking-wider mb-0.5">Telephone</div>
                <div className="text-small text-white">Disponible sur demande</div>
              </div>
            </a>

            <a
              href="https://iralink-agency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-grey-light border border-border-dim p-5 hover:border-gold/30 hover:bg-[#151515] transition-all duration-300 group"
            >
              <div className="w-10 h-10 border border-border-dim flex items-center justify-center group-hover:border-gold/30 transition-colors duration-300">
                <Globe className="w-4 h-4 text-gold" />
              </div>
              <div>
                <div className="text-[10px] text-grey uppercase tracking-wider mb-0.5">Site web</div>
                <div className="text-small text-white">iralink-agency.com</div>
              </div>
            </a>

            <a
              href="mailto:theo@iralink-agency.com"
              className="mt-2 w-full flex items-center justify-center gap-2 bg-gold text-black px-8 py-4 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300"
            >
              Demander un acces
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="w-full h-px bg-border-dim" />
      <footer className="max-w-5xl mx-auto px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[11px] text-grey">
            © {new Date().getFullYear()} Iralink Agency — Outil exclusif sur invitation
          </span>
        </div>
        <Link
          href="/login"
          className="text-[11px] text-grey hover:text-gold transition-colors"
        >
          Espace client
        </Link>
      </footer>
    </div>
  );
}

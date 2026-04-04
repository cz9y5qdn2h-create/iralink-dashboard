"use client";

import { Users, Plus, Mail, Shield, Eye } from "lucide-react";

const members = [
  { name: "Theo Coutard", email: "theo@iralink-agency.com", role: "admin", initials: "TC" },
  { name: "Marie Dupont", email: "marie@entreprise.com", role: "editor", initials: "MD" },
  { name: "Lucas Martin", email: "lucas@entreprise.com", role: "viewer", initials: "LM" },
];

const roleLabels: Record<string, { label: string; icon: typeof Shield }> = {
  admin: { label: "Administrateur", icon: Shield },
  editor: { label: "Editeur", icon: Users },
  viewer: { label: "Lecteur", icon: Eye },
};

export default function TeamPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="tag">Equipe</span>
          </div>
          <h1 className="font-serif text-display text-white">Votre equipe</h1>
          <p className="text-body text-grey mt-1">
            Gerez les acces a votre dashboard d&apos;automatisation.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gold text-black px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300">
          <Plus className="w-3.5 h-3.5" />
          Inviter
        </button>
      </div>

      <div className="space-y-[2px]">
        {members.map((member, i) => {
          const role = roleLabels[member.role];
          const RoleIcon = role.icon;
          return (
            <div
              key={i}
              className="bg-grey-light border border-border-dim p-5 flex items-center justify-between card-hover animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold/10 border border-border flex items-center justify-center">
                  <span className="text-tag text-gold">{member.initials}</span>
                </div>
                <div>
                  <p className="text-small text-white">{member.name}</p>
                  <p className="text-[11px] text-grey flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3" />
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 border border-border-dim">
                <RoleIcon className="w-3 h-3 text-gold" />
                <span className="text-[10px] text-grey uppercase tracking-wider">
                  {role.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

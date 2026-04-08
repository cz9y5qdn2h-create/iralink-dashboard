"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Mail, Shield, Eye, Trash2, Edit2, Loader2, X } from "lucide-react";

interface TeamMember {
  id: string;
  owner_id: string;
  email: string;
  full_name: string;
  role: "admin" | "editor" | "viewer";
  created_at: string;
}

const roleLabels: Record<string, { label: string; icon: typeof Shield }> = {
  admin: { label: "Administrateur", icon: Shield },
  editor: { label: "Editeur", icon: Users },
  viewer: { label: "Lecteur", icon: Eye },
};

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Invite form state
  const [form, setForm] = useState({ email: "", full_name: "", role: "viewer" });
  const [submitting, setSubmitting] = useState(false);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function loadMembers() {
    try {
      const res = await fetch("/api/team");
      if (!res.ok) return;
      const data = await res.json() as { members: TeamMember[] };
      setMembers(data.members ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadMembers(); }, []);

  async function handleInvite() {
    if (!form.email || !form.full_name) {
      showToast("Tous les champs sont requis", "error");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json() as { member: TeamMember };
      setMembers((prev) => [...prev, data.member]);
      setForm({ email: "", full_name: "", role: "viewer" });
      setShowModal(false);
      showToast("Membre ajouté !");
    } else {
      const err = await res.json() as { error: string };
      showToast(err.error, "error");
    }
    setSubmitting(false);
  }

  async function handleRoleUpdate(id: string, newRole: string) {
    const res = await fetch(`/api/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      const data = await res.json() as { member: TeamMember };
      setMembers((prev) => prev.map((m) => m.id === id ? data.member : m));
      showToast("Rôle mis à jour");
    } else {
      showToast("Erreur lors de la mise à jour", "error");
    }
    setEditingId(null);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer ${name} de l'équipe ?`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      showToast("Membre supprimé");
    } else {
      showToast("Erreur lors de la suppression", "error");
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium shadow-lg animate-fade-up ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-gold text-black"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="tag">Equipe</span>
          </div>
          <h1 className="font-serif text-display text-white">Votre équipe</h1>
          <p className="text-body text-grey mt-1">
            Gérez les accès à votre dashboard d&apos;automatisation.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gold text-black px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300 rounded-2xl"
        >
          <Plus className="w-3.5 h-3.5" />
          Inviter
        </button>
      </div>

      {/* Members List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-gold animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="bg-grey-light border border-border-dim rounded-2xl p-12 text-center">
          <Users className="w-8 h-8 text-grey mx-auto mb-3" />
          <p className="text-body text-grey">Aucun membre dans l&apos;équipe</p>
        </div>
      ) : (
        <div className="space-y-[2px]">
          {members.map((member, i) => {
            const role = roleLabels[member.role] ?? roleLabels.viewer;
            const RoleIcon = role.icon;
            return (
              <div
                key={member.id}
                className="bg-grey-light border border-border-dim rounded-2xl p-5 flex items-center justify-between card-hover animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 border border-border rounded-xl flex items-center justify-center">
                    <span className="text-tag text-gold">{getInitials(member.full_name)}</span>
                  </div>
                  <div>
                    <p className="text-small text-white">{member.full_name}</p>
                    <p className="text-[11px] text-grey flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {editingId === member.id ? (
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      onBlur={() => void handleRoleUpdate(member.id, editRole)}
                      autoFocus
                      className="bg-black border border-gold/40 text-gold text-[10px] uppercase tracking-wider px-2 py-1 rounded-lg outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editeur</option>
                      <option value="viewer">Lecteur</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 border border-border-dim rounded-xl">
                      <RoleIcon className="w-3 h-3 text-gold" />
                      <span className="text-[10px] text-grey uppercase tracking-wider">{role.label}</span>
                    </div>
                  )}

                  <button
                    onClick={() => { setEditingId(member.id); setEditRole(member.role); }}
                    className="p-1.5 text-grey hover:text-white transition-colors"
                    title="Modifier le rôle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => void handleDelete(member.id, member.full_name)}
                    disabled={deletingId === member.id}
                    className="p-1.5 text-grey hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    {deletingId === member.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-grey-light border border-border rounded-2xl p-8 w-full max-w-md animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-subheading text-white">Inviter un membre</h2>
              <button onClick={() => setShowModal(false)} className="text-grey hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-grey uppercase tracking-wider block mb-1.5">Nom complet</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  placeholder="Marie Dupont"
                  className="w-full bg-black border border-border-dim rounded-xl px-4 py-2.5 text-small text-white placeholder:text-grey/50 outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-grey uppercase tracking-wider block mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="marie@entreprise.com"
                  className="w-full bg-black border border-border-dim rounded-xl px-4 py-2.5 text-small text-white placeholder:text-grey/50 outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-grey uppercase tracking-wider block mb-1.5">Rôle</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full bg-black border border-border-dim rounded-xl px-4 py-2.5 text-small text-white outline-none focus:border-gold/50 transition-colors"
                >
                  <option value="admin">Administrateur</option>
                  <option value="editor">Editeur</option>
                  <option value="viewer">Lecteur</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-border-dim text-grey px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] hover:border-border hover:text-white transition-all rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={() => void handleInvite()}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-gold text-black px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors rounded-xl disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Inviter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

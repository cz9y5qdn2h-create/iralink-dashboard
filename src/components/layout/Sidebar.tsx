"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  Plug,
  Brain,
  FileText,
  Settings,
  CreditCard,
  Users,
  ChevronLeft,
  LogOut,
  Sparkles,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Automatisations", href: "/automations", icon: Zap },
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Analyse IA", href: "/analysis", icon: Brain },
  { name: "Fichiers", href: "/files", icon: FileText },
  { name: "Equipe", href: "/team", icon: Users },
];

const bottomNav = [
  { name: "Facturation", href: "/settings/billing", icon: CreditCard },
  { name: "Parametres", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-grey-light border-r border-border-dim flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-[72px] px-5 border-b border-border-dim">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-none bg-gold/10 border border-border flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          {!collapsed && (
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-lg tracking-wider">
                <span className="text-gold">I</span>
                <span className="text-white">RALINK</span>
              </span>
              <span className="font-serif text-sm italic text-gold tracking-wide">
                dashboard
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* AI Status */}
      <div className={`mx-4 mt-5 mb-2 p-3 bg-black rounded-none border border-border-dim ${collapsed ? "mx-2 p-2" : ""}`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gold status-pulse" />
          {!collapsed && (
            <span className="text-tag uppercase text-gold">
              IA active — analyse en cours
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-none transition-all duration-300 group relative ${
                active
                  ? "bg-gold/8 text-white border-l-2 border-gold"
                  : "text-grey hover:text-white hover:bg-white/[0.03] border-l-2 border-transparent"
              } ${collapsed ? "justify-center px-2" : ""}`}
            >
              <item.icon
                className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-300 ${
                  active ? "text-gold" : "text-grey group-hover:text-white"
                }`}
              />
              {!collapsed && (
                <span className="text-small tracking-wide">{item.name}</span>
              )}
              {active && !collapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-border-dim space-y-1">
        {bottomNav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-none transition-all duration-300 ${
                active ? "text-white" : "text-grey hover:text-white"
              } ${collapsed ? "justify-center px-2" : ""}`}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && (
                <span className="text-small tracking-wide">{item.name}</span>
              )}
            </Link>
          );
        })}

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-none transition-all duration-300 text-grey hover:text-white w-full ${
            collapsed ? "justify-center px-2" : ""
          }`}
        >
          <ChevronLeft
            className={`w-[18px] h-[18px] flex-shrink-0 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
          {!collapsed && (
            <span className="text-small tracking-wide">Reduire</span>
          )}
        </button>

        {/* Logout */}
        <button
          className={`flex items-center gap-3 px-3 py-2.5 rounded-none transition-all duration-300 text-grey hover:text-red-400 w-full ${
            collapsed ? "justify-center px-2" : ""
          }`}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && (
            <span className="text-small tracking-wide">Deconnexion</span>
          )}
        </button>
      </div>
    </aside>
  );
}

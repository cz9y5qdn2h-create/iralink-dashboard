"use client";

import { Bell, Search, ChevronDown, User, Shield, LogOut } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockAutomations } from "@/lib/mock-data";

export default function Topbar() {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredAutomations = searchQuery.trim().length > 0
    ? mockAutomations.filter((a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Click outside detection
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const applySearch = useCallback((value: string) => {
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  }, []);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      applySearch(value);
    }, 300);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      applySearch(searchQuery);
    }
    if (e.key === "Escape") {
      setShowSearchResults(false);
      setSearchQuery("");
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/login");
  }

  return (
    <header className="h-[72px] border-b border-border-dim bg-black/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search */}
      <div
        ref={searchRef}
        className={`relative transition-all duration-300 ${searchFocused ? "w-[400px]" : "w-[320px]"}`}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" />
        <input
          type="text"
          value={searchQuery}
          placeholder="Rechercher automatisations, integrations..."
          className="w-full bg-grey-light border border-border-dim rounded-none pl-10 pr-4 py-2.5 text-small text-white placeholder:text-[#333] focus:border-gold/50 focus:outline-none transition-all duration-300"
          onFocus={() => {
            setSearchFocused(true);
            if (searchQuery.trim()) setShowSearchResults(true);
          }}
          onBlur={() => setSearchFocused(false)}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
        />
        {!searchQuery && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-grey border border-border-dim px-1.5 py-0.5">
            /
          </kbd>
        )}

        {/* Search results dropdown */}
        {showSearchResults && filteredAutomations.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#111] border border-border-dim z-50 shadow-xl">
            {filteredAutomations.map((a) => (
              <button
                key={a.id}
                onMouseDown={() => {
                  router.push(`/automations/${a.id}`);
                  setShowSearchResults(false);
                  setSearchQuery("");
                }}
                className="w-full text-left px-4 py-3 text-small text-white hover:bg-gold/10 transition-colors border-b border-border-dim last:border-0 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                <span className="truncate">{a.name}</span>
              </button>
            ))}
          </div>
        )}

        {showSearchResults && searchQuery.trim() && filteredAutomations.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#111] border border-border-dim z-50 shadow-xl">
            <div className="px-4 py-3 text-[11px] text-grey">
              Aucun resultat pour &quot;{searchQuery}&quot;
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2 text-grey hover:text-white transition-colors duration-300">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold status-pulse" />
        </button>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-3 pl-5 border-l border-border-dim group"
          >
            <div className="w-8 h-8 bg-gold/10 border border-border flex items-center justify-center">
              <span className="text-tag text-gold">TC</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-small text-white leading-none">Theo Coutard</p>
              <p className="text-[10px] text-grey leading-none mt-1">Iralink Agency</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-grey group-hover:text-white transition-all duration-200 ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-[#111] border border-border-dim z-50 shadow-xl animate-fade-up">
              <Link
                href="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-small text-white hover:bg-gold/10 transition-colors border-b border-border-dim"
              >
                <User className="w-3.5 h-3.5 text-grey" />
                Mon profil
              </Link>
              <Link
                href="/admin"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-small text-white hover:bg-gold/10 transition-colors border-b border-border-dim"
              >
                <Shield className="w-3.5 h-3.5 text-grey" />
                Gestion des acces
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-small text-white hover:bg-gold/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-grey" />
                Deconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-[72px] border-b border-border-dim bg-black/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search */}
      <div className={`relative transition-all duration-300 ${searchFocused ? "w-[400px]" : "w-[320px]"}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" />
        <input
          type="text"
          placeholder="Rechercher automatisations, integrations..."
          className="w-full bg-grey-light border border-border-dim rounded-none pl-10 pr-4 py-2.5 text-small text-white placeholder:text-[#333] focus:border-gold/50 focus:outline-none transition-all duration-300"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-grey border border-border-dim px-1.5 py-0.5">
          /
        </kbd>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2 text-grey hover:text-white transition-colors duration-300">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold status-pulse" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-3 pl-5 border-l border-border-dim group">
          <div className="w-8 h-8 bg-gold/10 border border-border flex items-center justify-center">
            <span className="text-tag text-gold">TC</span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-small text-white leading-none">Theo Coutard</p>
            <p className="text-[10px] text-grey leading-none mt-1">Iralink Agency</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-grey group-hover:text-white transition-colors" />
        </button>
      </div>
    </header>
  );
}

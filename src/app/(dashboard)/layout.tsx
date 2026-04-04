"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div
        className={`flex-1 ml-[260px] transition-all duration-300 ${
          chatOpen ? "mr-[420px]" : ""
        }`}
      >
        <Topbar />
        <main className="p-8">{children}</main>
      </div>

      {/* AI Chat Panel */}
      <AIChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Floating AI Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gold flex items-center justify-center hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/20 z-50 group"
        >
          <Sparkles className="w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full status-pulse border-2 border-black" />
        </button>
      )}
    </div>
  );
}

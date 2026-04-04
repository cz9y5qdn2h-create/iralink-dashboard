"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Brain,
  Zap,
  FileText,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  {
    icon: Brain,
    label: "Analyser mes processus",
    prompt:
      "Analyse mes processus actuels et identifie les taches repetitives que je pourrais automatiser.",
  },
  {
    icon: Zap,
    label: "Suggerer une automatisation",
    prompt:
      "Quelles automatisations me recommandes-tu en priorite pour gagner du temps cette semaine ?",
  },
  {
    icon: FileText,
    label: "Resume hebdomadaire",
    prompt:
      "Fais-moi un resume de la performance de mes automatisations cette semaine.",
  },
];

export default function AIChatPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour, je suis Iralink, votre assistant IA. Je peux analyser vos processus, suggerer des automatisations, et repondre a vos questions. Comment puis-je vous aider ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = [...messages, userMessage]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Desole, je rencontre une erreur de connexion. Verifiez que la cle API Anthropic est configuree dans les variables d'environnement.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed right-0 top-0 h-screen bg-grey-light border-l border-border-dim flex flex-col z-[60] transition-all duration-300 ${
        expanded ? "w-[600px]" : "w-[420px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-[72px] px-5 border-b border-border-dim flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-border flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gold status-pulse" />
          </div>
          <div>
            <h3 className="text-small text-white font-normal">
              Iralink IA
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold status-pulse" />
              <span className="text-[9px] text-gold uppercase tracking-wider">
                En ligne
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-grey hover:text-white transition-colors"
          >
            {expanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-grey hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-fade-up ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 border border-border flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
              </div>
            )}
            <div
              className={`max-w-[85%] p-3.5 text-[13px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-gold/10 border border-gold/20 text-white"
                  : "bg-black border border-border-dim text-grey"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <p className="text-[9px] text-grey/40 mt-2 font-mono">
                {msg.timestamp.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-fade-up">
            <div className="w-7 h-7 border border-border flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-gold status-pulse" />
            </div>
            <div className="bg-black border border-border-dim p-3.5 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-gold loader" />
              <span className="text-[12px] text-grey">
                Iralink analyse...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts (only show when conversation is fresh) */}
      {messages.length <= 1 && (
        <div className="px-5 pb-3 space-y-1.5">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => sendMessage(qp.prompt)}
              className="w-full flex items-center gap-3 p-3 bg-black border border-border-dim hover:border-border text-left transition-all duration-300 group"
            >
              <qp.icon className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="text-[12px] text-grey group-hover:text-white transition-colors">
                {qp.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border-dim flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question a Iralink..."
            rows={1}
            className="flex-1 bg-black border border-border-dim text-white text-[13px] px-4 py-3 resize-none placeholder:text-[#333] focus:border-gold/50 focus:outline-none transition-colors duration-300"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 bg-gold flex items-center justify-center hover:bg-gold-light transition-colors duration-300 disabled:opacity-30 flex-shrink-0"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </div>
        <p className="text-[9px] text-grey/30 mt-2 text-center">
          Iralink IA propulse par Claude — Anthropic
        </p>
      </div>
    </div>
  );
}

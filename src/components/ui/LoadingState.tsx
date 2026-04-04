"use client";

import { Sparkles, Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-12 h-12 border border-border flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-gold status-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 text-gold loader" />
          <span className="text-small text-grey">Chargement...</span>
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-[2px]">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-grey-light border border-border-dim p-5 animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-border-dim" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-border-dim w-2/3" />
              <div className="h-2 bg-border-dim w-full" />
              <div className="h-2 bg-border-dim w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-14 h-14 border border-border-dim flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-grey" />
      </div>
      <h3 className="font-serif text-subheading text-white mb-1">{title}</h3>
      <p className="text-body text-grey text-center max-w-sm">{description}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="mt-5 bg-gold text-black px-6 py-2.5 text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-gold-light transition-colors duration-300"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

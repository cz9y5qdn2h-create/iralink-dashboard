"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  suffix,
  trend,
  trendLabel,
  icon: Icon,
  delay = 0,
}: MetricCardProps) {
  const isPositive = trend && trend > 0;

  return (
    <div
      className="bg-grey-light border border-border-dim p-6 card-hover relative overflow-hidden group animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gold glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.02] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2" />

      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 border border-border flex items-center justify-center">
          <Icon className="w-[18px] h-[18px] text-gold" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-[11px] font-mono ${
              isPositive ? "text-gold" : "text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {isPositive ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>

      <p className="tag mb-2">{title}</p>

      <div className="flex items-baseline gap-1.5">
        <span className="font-serif text-[2rem] font-light text-white leading-none">
          {value}
        </span>
        {suffix && (
          <span className="text-small text-grey">{suffix}</span>
        )}
      </div>

      {trendLabel && (
        <p className="text-[11px] text-grey mt-2">{trendLabel}</p>
      )}
    </div>
  );
}

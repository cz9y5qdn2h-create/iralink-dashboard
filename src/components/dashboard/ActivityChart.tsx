"use client";

interface DataPoint {
  label: string;
  value: number;
}

interface ActivityChartProps {
  data: DataPoint[];
  title: string;
  suffix?: string;
}

export default function ActivityChart({ data, title, suffix = "" }: ActivityChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-grey-light border border-border-dim p-6">
      <h3 className="tag mb-6">{title}</h3>

      <div className="flex items-end gap-1 h-[140px]">
        {data.map((point, i) => {
          const height = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <span className="text-[9px] font-mono text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                {point.value}{suffix}
              </span>
              <div className="w-full relative" style={{ height: "100%" }}>
                <div
                  className="absolute bottom-0 left-[15%] right-[15%] bg-gold/20 group-hover:bg-gold/40 transition-all duration-300"
                  style={{
                    height: `${height}%`,
                    transition: "height 0.8s ease",
                  }}
                />
              </div>
              <span className="text-[9px] text-grey">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

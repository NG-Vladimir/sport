"use client";

interface ActivityRingsProps {
  values: [number, number, number];
  labels?: [string, string, string];
  className?: string;
}

const defaultLabels: [string, string, string] = ["План", "Неделя", "Достижения"];
const colors = ["#84cc16", "#22c55e", "#06b6d4"];

export function ActivityRings({
  values,
  labels = defaultLabels,
  className = "",
}: ActivityRingsProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {values.map((v, i) => (
        <div key={i}>
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span style={{ color: colors[i] }}>{labels[i]}</span>
            <span>{Math.round((values[i] ?? 0) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.round((values[i] ?? 0) * 100)}%`, backgroundColor: colors[i] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

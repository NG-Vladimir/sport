"use client";

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercent?: boolean;
  color?: "lime" | "green" | "cyan" | "pink";
  height?: "sm" | "md" | "lg";
  className?: string;
}

const colorClasses = {
  lime: "bg-lime-500",
  green: "bg-green-500",
  cyan: "bg-cyan-500",
  pink: "bg-pink-500",
};

const heightClasses = { sm: "h-2", md: "h-3", lg: "h-4" };

export function ProgressBar({
  value,
  label,
  showPercent = true,
  color = "lime",
  height = "md",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value));
  const pct = Math.round(clamped * 100);

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          {label && <span>{label}</span>}
          {showPercent && <span>{pct}%</span>}
        </div>
      )}
      <div className={`overflow-hidden rounded-full bg-gray-800 ${heightClasses[height]}`}>
        <div
          className={`rounded-full ${colorClasses[color]} ${heightClasses[height]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

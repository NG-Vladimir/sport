"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0..1
  label?: string;
  showPercent?: boolean;
  color?: "lime" | "green" | "cyan" | "pink";
  height?: "sm" | "md" | "lg";
  className?: string;
}

const colorClasses = {
  lime: "bg-neon-lime text-dark-bg",
  green: "bg-neon-green text-dark-bg",
  cyan: "bg-neon-cyan text-dark-bg",
  pink: "bg-neon-pink text-dark-bg",
};

const heightClasses = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export function ProgressBar({
  value,
  label,
  showPercent = true,
  color = "lime",
  height = "md",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value));

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="mb-1 flex justify-between text-xs font-semibold uppercase tracking-wider text-dark-muted">
          {label && <span>{label}</span>}
          {showPercent && <span>{Math.round(clamped * 100)}%</span>}
        </div>
      )}
      <div className={`overflow-hidden rounded-full bg-dark-border ${heightClasses[height]}`}>
        <motion.div
          className={`rounded-full ${colorClasses[color]} ${heightClasses[height]}`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

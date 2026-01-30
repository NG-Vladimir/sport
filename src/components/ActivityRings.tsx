"use client";

import { motion } from "framer-motion";

interface Ring {
  value: number; // 0..1
  color: string;
  strokeDasharray: string;
  strokeDashoffset: number;
}

const size = 120;
const stroke = 10;
const r = (size - stroke) / 2;
const circumference = 2 * Math.PI * r;

function buildRing(value: number, color: string): Ring {
  const clamped = Math.min(1, Math.max(0, value));
  const offset = circumference * (1 - clamped);
  return {
    value: clamped,
    color,
    strokeDasharray: `${circumference}`,
    strokeDashoffset: offset,
  };
}

interface ActivityRingsProps {
  values: [number, number, number]; // e.g. [0.8, 0.6, 1]
  labels?: [string, string, string];
  className?: string;
}

const defaultLabels: [string, string, string] = ["Тренировки", "Подходы", "Достижения"];
const colors = ["#b8ff3c", "#00ff88", "#00d4ff"];

export function ActivityRings({
  values,
  labels = defaultLabels,
  className = "",
}: ActivityRingsProps) {
  const rings: Ring[] = values.map((v, i) => buildRing(v, colors[i]));

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative" style={{ width: size + 40, height: size + 40 }}>
        {rings.map((ring, i) => {
          const offset = i * 14;
          const s = size - offset * 2;
          const r2 = (s - stroke) / 2;
          const c = 2 * Math.PI * r2;
          const doff = c * (1 - ring.value);
          return (
            <motion.svg
              key={i}
              width={size + 40}
              height={size + 40}
              className="absolute"
              style={{ transform: "rotate(-90deg)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <circle
                cx={(size + 40) / 2}
                cy={(size + 40) / 2}
                r={r2}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={stroke}
              />
              <motion.circle
                cx={(size + 40) / 2}
                cy={(size + 40) / 2}
                r={r2}
                fill="none"
                stroke={ring.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                animate={{ strokeDashoffset: doff }}
                transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
              />
            </motion.svg>
          );
        })}
      </div>
      <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider text-dark-muted">
        {labels.map((l, i) => (
          <span key={i} style={{ color: colors[i] }}>
            {l}: {Math.round((values[i] ?? 0) * 100)}%
          </span>
        ))}
      </div>
    </div>
  );
}

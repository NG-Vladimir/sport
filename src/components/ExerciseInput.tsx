"use client";

import { motion } from "framer-motion";
import type { ExerciseType, ExerciseSet } from "@/types";

const exerciseLabels: Record<ExerciseType, string> = {
  pullups: "Подтягивания",
  squats: "Приседания",
  abs: "Пресс",
  pushups: "Отжимания",
};

interface ExerciseInputProps {
  type: ExerciseType;
  sets: ExerciseSet[];
  values: number[]; // reps per set
  onChange: (setIndex: number, reps: number) => void;
  disabled?: boolean;
  className?: string;
}

export function ExerciseInput({
  type,
  sets,
  values,
  onChange,
  disabled = false,
  className = "",
}: ExerciseInputProps) {
  return (
    <motion.div
      className={`rounded-xl border border-dark-border bg-dark-card p-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-neon-lime">
        {exerciseLabels[type]}
      </h4>
      <div className="flex flex-wrap gap-2">
        {sets.map((set, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="text-xs text-dark-muted">×{i + 1}</span>
            <input
              type="number"
              min={0}
              max={999}
              value={values[i] ?? ""}
              onChange={(e) => onChange(i, parseInt(e.target.value, 10) || 0)}
              disabled={disabled}
              className="h-10 w-16 rounded-lg border border-dark-border bg-dark-bg px-2 text-center font-bold text-white outline-none transition focus:border-neon-lime focus:ring-1 focus:ring-neon-lime"
            />
            <span className="text-xs text-dark-muted">/ {set.targetReps}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

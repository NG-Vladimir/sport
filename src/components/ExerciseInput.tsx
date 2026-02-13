"use client";

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
  values: number[];
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
    <div className={`rounded-xl border border-gray-800 bg-[#1a1a1a] p-4 ${className}`}>
      <h4 className="mb-3 text-sm font-semibold text-lime-400">{exerciseLabels[type]}</h4>
      <div className="flex flex-wrap gap-3">
        {sets.map((set, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-gray-500">×{i + 1}</span>
            <input
              type="number"
              inputMode="numeric" // <-- Вот это заставит телефон показать только цифры
              pattern="[0-9]*"    // <-- Дополнительная страховка для iOS
              min={0}
              max={999}
              value={values[i] ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                // Позволяем вводить только целые числа
                if (/^\d*$/.test(val)) {
                  onChange(i, parseInt(val, 10) || 0);
                }
              }}
              disabled={disabled}
              className="h-12 w-20 rounded-lg border border-gray-700 bg-[#0f0f0f] px-2 text-center text-lg font-semibold text-white outline-none focus:border-lime-500 transition-colors"
            />
            <span className="text-xs text-gray-500">/ {set.targetReps}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

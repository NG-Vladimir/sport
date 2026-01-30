"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Target } from "lucide-react";
import type { WorkoutDay as WorkoutDayType } from "@/types";

const focusLabels: Record<string, string> = {
  strength: "Сила",
  endurance: "Выносливость",
  explosive: "Взрывная",
};

interface WorkoutCardProps {
  workout: WorkoutDayType;
  onStart?: () => void;
  startHref?: string;
  isToday?: boolean;
  completed?: boolean;
  className?: string;
}

export function WorkoutCard({ workout, onStart, startHref, isToday, completed, className = "" }: WorkoutCardProps) {
  const totalExercises = workout.exercises.length;
  const totalSets = workout.exercises.reduce((s, e) => s + e.sets.length, 0);

  return (
    <motion.article
      className={`rounded-2xl border border-dark-border bg-dark-card p-5 shadow-lg transition ${
        isToday ? "border-neon-lime/50 shadow-[0_0_30px_rgba(184,255,60,0.15)]" : ""
      } ${completed ? "opacity-80" : ""} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!completed ? { scale: 1.01, boxShadow: "0 0 40px rgba(184,255,60,0.1)" } : undefined}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-display text-lg font-bold text-white">
            Тренировка {workout.dayNumber}
            {workout.isMaxCheck && (
              <span className="ml-2 rounded bg-neon-pink/20 px-2 py-0.5 text-xs text-neon-pink">Макс</span>
            )}
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm text-dark-muted">
            <Calendar className="h-4 w-4" />
            {workout.date}
          </p>
        </div>
        {isToday && (
          <span className="rounded-full bg-neon-lime/20 px-3 py-1 text-xs font-bold text-neon-lime">Сегодня</span>
        )}
        {completed && (
          <span className="rounded-full bg-neon-green/20 px-3 py-1 text-xs font-bold text-neon-green">Готово</span>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-lg bg-dark-bg px-2 py-1 text-xs font-semibold text-neon-lime">
          <Target className="h-3 w-3" />
          {focusLabels[workout.focus] ?? workout.focus}
        </span>
        <span className="rounded-lg bg-dark-bg px-2 py-1 text-xs text-dark-muted">
          {totalExercises} упр. · {totalSets} подходов
        </span>
      </div>

      <ul className="space-y-1 text-sm text-dark-muted">
        {workout.exercises.map((ex) => (
          <li key={ex.type} className="flex justify-between">
            <span>{ex.type === "pullups" ? "Подтягивания" : ex.type === "squats" ? "Приседания" : ex.type === "abs" ? "Пресс" : "Отжимания"}</span>
            <span>
              {ex.sets.map((s) => s.targetReps).join(" + ")} ({ex.sets.length} подх.)
            </span>
          </li>
        ))}
      </ul>

      {(onStart || startHref) && !completed && (
        startHref ? (
          <Link href={startHref} className="mt-4 block w-full">
            <motion.span
              className="block w-full rounded-xl bg-neon-lime py-3 text-center font-display font-bold text-dark-bg transition hover:bg-neon-lime/90"
              whileTap={{ scale: 0.98 }}
            >
              Начать
            </motion.span>
          </Link>
        ) : (
          <motion.button
            type="button"
            onClick={onStart}
            className="mt-4 w-full rounded-xl bg-neon-lime py-3 font-display font-bold text-dark-bg transition hover:bg-neon-lime/90"
            whileTap={{ scale: 0.98 }}
          >
            Начать
          </motion.button>
        )
      )}
    </motion.article>
  );
}

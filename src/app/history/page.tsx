"use client";

import { useMemo, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { generate90DayPlan } from "@/lib/workoutPlan";

export default function HistoryPage() {
  const { progress, hydrated } = useProgress();
  const [month, setMonth] = useState(new Date());

  const plan = useMemo(() => {
    if (!progress?.maxes) return [];
    return generate90DayPlan(new Date(), progress.maxes);
  }, [progress?.maxes]);

  const completedDates = useMemo(() => {
    return new Set(progress?.completedWorkouts?.map((w) => w.date) ?? []);
  }, [progress?.completedWorkouts]);

  const planDates = useMemo(() => new Set(plan.map((w) => w.date)), [plan]);

  const days = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  }, [month]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-neon-lime border-t-transparent" />
      </div>
    );
  }

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white">
          История
        </h1>
        <p className="mt-1 text-dark-muted">Календарь тренировок</p>
      </header>

      <div className="rounded-2xl border border-dark-border bg-dark-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonth(subMonths(month, 1))}
            className="rounded-lg p-2 text-dark-muted transition hover:bg-dark-bg hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-display text-lg font-bold uppercase text-white">
            {format(month, "LLLL yyyy", { locale: ru })}
          </span>
          <button
            type="button"
            onClick={() => setMonth(addMonths(month, 1))}
            className="rounded-lg p-2 text-dark-muted transition hover:bg-dark-bg hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-dark-muted">
          {weekDays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({ length: (startOfMonth(month).getDay() + 6) % 7 }, (_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isWorkoutDay = planDates.has(dateStr);
            const isCompleted = completedDates.has(dateStr);
            const isCurrentMonth = isSameMonth(day, month);
            const isToday = isSameDay(day, new Date());

            return (
              <motion.div
                key={dateStr}
                className={`flex aspect-square items-center justify-center rounded-lg text-sm font-bold ${
                  !isCurrentMonth ? "text-dark-muted/50" : ""
                } ${
                  isCompleted
                    ? "bg-neon-green/20 text-neon-green"
                    : isWorkoutDay
                    ? "bg-dark-border text-white"
                    : "text-dark-muted"
                } ${isToday ? "ring-2 ring-neon-lime" : ""}`}
                whileHover={{ scale: 1.05 }}
              >
                {format(day, "d")}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 text-sm text-dark-muted">
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-neon-green/20" /> Выполнено
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-dark-border" /> День тренировки
        </span>
      </div>
    </motion.div>
  );
}

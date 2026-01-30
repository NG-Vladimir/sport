"use client";

import { useMemo, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
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
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-lime-500 border-t-transparent" />
      </div>
    );
  }

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">История</h1>
        <p className="mt-0.5 text-sm text-gray-500">Календарь тренировок</p>
      </header>

      <div className="rounded-xl border border-gray-800 bg-[#1a1a1a] p-4">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonth(subMonths(month, 1))}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-500 active:bg-gray-800"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold text-white">
            {format(month, "LLLL yyyy", { locale: ru })}
          </span>
          <button
            type="button"
            onClick={() => setMonth(addMonths(month, 1))}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-500 active:bg-gray-800"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
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
              <div
                key={dateStr}
                className={`flex aspect-square items-center justify-center rounded-lg text-sm font-medium ${
                  !isCurrentMonth ? "text-gray-600" : ""
                } ${
                  isCompleted
                    ? "bg-green-500/20 text-green-400"
                    : isWorkoutDay
                    ? "bg-gray-700 text-white"
                    : "text-gray-500"
                } ${isToday ? "ring-2 ring-lime-500" : ""}`}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-green-500/30" /> Выполнено
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-gray-700" /> День тренировки
        </span>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Calendar, Target } from "lucide-react";
import type { WorkoutDay as WorkoutDayType } from "@/types";

const focusLabels: Record<string, string> = {
  strength: "Сила",
  endurance: "Выносливость",
  explosive: "Взрывная",
};

const exLabels: Record<string, string> = {
  pullups: "Подтягивания",
  squats: "Приседания",
  abs: "Пресс",
  pushups: "Отжимания",
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
  const totalSets = workout.exercises.reduce((s, e) => s + e.sets.length, 0);

  return (
    <article
      className={`rounded-xl border border-gray-800 bg-[#1a1a1a] p-4 ${isToday ? "border-lime-500/50" : ""} ${
        completed ? "opacity-75" : ""
      } ${className}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="font-semibold text-white">
            День {workout.dayNumber}
            {workout.isMaxCheck && (
              <span className="ml-2 rounded bg-pink-500/20 px-1.5 py-0.5 text-xs text-pink-400">Макс</span>
            )}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            {workout.date}
          </p>
        </div>
        <div className="flex gap-1">
          {isToday && <span className="rounded bg-lime-500/20 px-2 py-1 text-xs font-medium text-lime-400">Сегодня</span>}
          {completed && <span className="rounded bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">Готово</span>}
        </div>
      </div>

      <p className="mb-2 flex items-center gap-1 text-sm text-gray-400">
        <Target className="h-4 w-4" />
        {focusLabels[workout.focus] ?? workout.focus} · {totalSets} подходов
      </p>

      <ul className="mb-4 space-y-1 text-sm text-gray-500">
        {workout.exercises.map((ex) => (
          <li key={ex.type} className="flex justify-between">
            <span>{exLabels[ex.type]}</span>
            <span>{ex.sets.map((s) => s.targetReps).join(" + ")}</span>
          </li>
        ))}
      </ul>

      {(onStart || startHref) && !completed && (
        startHref ? (
          <Link
            href={startHref}
            className="block w-full rounded-lg bg-lime-500 py-3 text-center font-semibold text-black"
          >
            Начать
          </Link>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="w-full rounded-lg bg-lime-500 py-3 font-semibold text-black"
          >
            Начать
          </button>
        )
      )}
    </article>
  );
}

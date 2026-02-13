"use client";

import Link from "next/link";
import { Calendar, Target, RotateCcw } from "lucide-react"; // Добавили иконку сброса
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
  onReset?: () => void; // Добавили функцию сброса
  startHref?: string;
  isToday?: boolean;
  completed?: boolean;
  className?: string;
}

export function WorkoutCard({ 
  workout, 
  onStart, 
  onReset, // Проп для сброса
  startHref, 
  isToday, 
  completed, 
  className = "" 
}: WorkoutCardProps) {
  // Теперь считаем подходы (их будет 4, если в данных так прописано)
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
            {/* Здесь будут отображаться все 4 подхода через + */}
            <span>{ex.sets.map((s) => s.targetReps).join(" + ")}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        {(onStart || startHref) && !completed && (
          startHref ? (
            <Link
              href={startHref}
              className="flex-1 block rounded-lg bg-lime-500 py-3 text-center font-semibold text-black hover:bg-lime-400 transition-colors"
            >
              Начать
            </Link>
          ) : (
            <button
              type="button"
              onClick={onStart}
              className="flex-1 rounded-lg bg-lime-500 py-3 font-semibold text-black hover:bg-lime-400 transition-colors"
            >
              Начать
            </button>
          )
        )}

        {/* Кнопка Сброса */}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center w-12 rounded-lg border border-gray-700 bg-transparent text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
            title="Сбросить прогресс"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        )}
      </div>
    </article>
  );
}

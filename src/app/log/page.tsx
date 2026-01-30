"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { useProgress } from "@/context/ProgressContext";
import { generate90DayPlan, getWorkoutForDate } from "@/lib/workoutPlan";
import { ExerciseInput } from "@/components/ExerciseInput";
import { ProgressBar } from "@/components/ProgressBar";
import type { ExerciseType, CompletedSet } from "@/types";

function LogContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const workoutDate = dateParam || todayStr;

  const { progress, completeWorkout, hydrated } = useProgress();
  const plan = useMemo(
    () => (progress?.maxes ? generate90DayPlan(new Date(), progress.maxes) : []),
    [progress?.maxes]
  );
  const workout = useMemo(
    () => getWorkoutForDate(plan, workoutDate),
    [plan, workoutDate]
  );

  const [values, setValues] = useState<Record<ExerciseType, number[]>>({
    pullups: [],
    squats: [],
    abs: [],
    pushups: [],
  });
  const [saved, setSaved] = useState(false);

  const completedDates = useMemo(
    () => new Set(progress?.completedWorkouts?.map((w) => w.date) ?? []),
    [progress?.completedWorkouts]
  );
  const alreadyCompleted = completedDates.has(workoutDate);

  const setReps = useCallback((type: ExerciseType, setIndex: number, reps: number) => {
    setValues((prev) => {
      const next = [...(prev[type] ?? [])];
      next[setIndex] = reps;
      return { ...prev, [type]: next };
    });
  }, []);

  const buildCompletedSets = useCallback((): CompletedSet[] => {
    if (!workout) return [];
    const sets: CompletedSet[] = [];
    workout.exercises.forEach((ex) => {
      const v = values[ex.type] ?? [];
      ex.sets.forEach((_, i) => {
        const reps = v[i] ?? 0;
        if (reps > 0) {
          sets.push({
            exerciseType: ex.type,
            setIndex: i,
            reps,
            completedAt: new Date().toISOString(),
          });
        }
      });
    });
    return sets;
  }, [workout, values]);

  const handleSave = useCallback(() => {
    if (!workout || !progress) return;
    const completedSets = buildCompletedSets();
    if (completedSets.length === 0) return;
    completeWorkout(workout.id, workoutDate, completedSets);
    setSaved(true);
  }, [workout, workoutDate, progress, buildCompletedSets, completeWorkout]);

  if (!hydrated || !progress) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-lime-500 border-t-transparent" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="rounded-xl border border-gray-800 bg-[#1a1a1a] p-8 text-center text-gray-500">
        <p>На эту дату нет тренировки.</p>
        <p className="mt-2 text-sm">Пн, Ср, Пт — дни тренировок</p>
      </div>
    );
  }

  if (saved || alreadyCompleted) {
    return (
      <div className="rounded-xl border border-green-500/40 bg-[#1a1a1a] p-8 text-center">
        <p className="text-lg font-semibold text-green-400">Тренировка засчитана</p>
        <p className="mt-2 text-sm text-gray-500">{workoutDate}</p>
      </div>
    );
  }

  const totalTarget = workout.exercises.reduce(
    (s, e) => s + e.sets.reduce((a, set) => a + set.targetReps, 0),
    0
  );
  const totalDone = Object.entries(values).reduce(
    (s, [, v]) => s + (Array.isArray(v) ? v.reduce((a, n) => a + (n ?? 0), 0) : 0),
    0
  );
  const progressValue = totalTarget ? Math.min(1, totalDone / totalTarget) : 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-bold text-white">Лог тренировки</h1>
        <p className="mt-0.5 text-sm text-gray-500">{workoutDate} · День {workout.dayNumber}</p>
      </header>

      <ProgressBar
        value={progressValue}
        label="Прогресс"
        showPercent={true}
        color="lime"
        height="md"
      />

      <div className="space-y-4">
        {workout.exercises.map((ex) => (
          <ExerciseInput
            key={ex.type}
            type={ex.type}
            sets={ex.sets}
            values={values[ex.type] ?? ex.sets.map(() => 0)}
            onChange={(setIndex, reps) => setReps(ex.type, setIndex, reps)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={buildCompletedSets().length === 0}
        className="w-full rounded-lg bg-lime-500 py-4 font-semibold text-black disabled:opacity-50"
      >
        Сохранить тренировку
      </button>
    </div>
  );
}

export default function LogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-lime-500 border-t-transparent" />
        </div>
      }
    >
      <LogContent />
    </Suspense>
  );
}

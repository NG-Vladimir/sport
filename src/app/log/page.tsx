"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { generate90DayPlan, getWorkoutForDate } from "@/lib/workoutPlan";
import { ExerciseInput } from "@/components/ExerciseInput";
import { ProgressBar } from "@/components/ProgressBar";
import type { ExerciseType, CompletedSet } from "@/types";

export default function LogPage() {
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
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-neon-lime border-t-transparent" />
      </div>
    );
  }

  if (!workout) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-dark-border bg-dark-card p-8 text-center"
      >
        <p className="text-dark-muted">На эту дату нет тренировки в плане.</p>
        <p className="mt-2 text-sm text-dark-muted">Выберите Пн, Ср или Пт.</p>
      </motion.div>
    );
  }

  if (saved || alreadyCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-neon-green/50 bg-dark-card p-8 text-center"
      >
        <p className="font-display text-xl font-bold text-neon-green">Тренировка засчитана</p>
        <p className="mt-2 text-dark-muted">{workoutDate}</p>
      </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <header>
        <h1 className="font-display text-2xl font-bold uppercase text-white">
          Лог тренировки
        </h1>
        <p className="mt-1 text-dark-muted">{workoutDate} · День {workout.dayNumber}</p>
      </header>

      <ProgressBar
        value={progressValue}
        label="Прогресс по повторениям"
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

      <motion.button
        type="button"
        onClick={handleSave}
        disabled={buildCompletedSets().length === 0}
        className="w-full rounded-xl bg-neon-lime py-4 font-display font-bold text-dark-bg disabled:opacity-50"
        whileTap={{ scale: 0.98 }}
      >
        Сохранить тренировку
      </motion.button>
    </motion.div>
  );
}

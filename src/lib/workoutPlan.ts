import { addDays, format, getDay, startOfDay } from "date-fns";
import type { WorkoutDay, WorkoutExercise, ExerciseSet, UserMaxes, LoadType } from "@/types";

const WORKOUT_WEEKDAYS = [1, 3, 5]; // Mon=1, Wed=3, Fri=5

function getVolumeIncreaseForWeek(weekNumber: number): number {
  if (weekNumber <= 4) return 1.02;
  if (weekNumber <= 8) return 1.035;
  return 1.045;
}

function roundReps(n: number): number {
  return Math.max(1, Math.round(n));
}

function distributeSets(totalReps: number, setCount: number): number[] {
  const perSet = Math.floor(totalReps / setCount);
  const remainder = totalReps % setCount;
  const sets: number[] = Array(setCount).fill(perSet);
  for (let i = 0; i < remainder; i++) sets[i]++;
  return sets.reverse();
}

function buildExerciseSets(
  type: "pullups" | "squats" | "abs" | "pushups",
  baseMax: number,
  weekNumber: number,
  loadType: LoadType,
  isMaxCheck: boolean
): ExerciseSet[] {
  const weeklyGrowth = Math.pow(getVolumeIncreaseForWeek(weekNumber), (weekNumber - 1));
  const volume = baseMax * weeklyGrowth;

  if (isMaxCheck) {
    return [{ targetReps: Math.min(roundReps(baseMax * 1.15), roundReps(volume * 0.4)), restSeconds: 180, loadType: "strength" }];
  }

  // ВАЙБ-ПРАВКА: Теперь всегда 4 подхода для всех упражнений
  const setCount = 4; 
  
  const totalTarget = roundReps(volume * (loadType === "endurance" ? 1.2 : loadType === "explosive" ? 0.9 : 1));
  const repsPerSet = distributeSets(totalTarget, setCount);

  const restMap: Record<LoadType, number> = {
    strength: 90,
    endurance: 45,
    explosive: 120,
  };

  return repsPerSet.map((targetReps) => ({
    targetReps,
    restSeconds: restMap[loadType],
    loadType,
  }));
}

export function getFocusForDay(dayNumber: number): LoadType {
  const cycle = dayNumber % 9;
  if (cycle < 3) return "strength";
  if (cycle < 6) return "endurance";
  return "explosive";
}

export function isMaxCheckDay(dayNumber: number): boolean {
  return dayNumber > 0 && dayNumber % 14 === 0;
}

export function generate90DayPlan(startDate: Date, maxes: UserMaxes): WorkoutDay[] {
  const plan: WorkoutDay[] = [];
  let date = startOfDay(startDate);
  let dayNumber = 0;

  while (dayNumber < 90) {
    const dayOfWeek = getDay(date);
    if (WORKOUT_WEEKDAYS.includes(dayOfWeek)) {
      dayNumber++;
      const weekNumber = Math.ceil(dayNumber / 3);
      const isMaxCheck = isMaxCheckDay(dayNumber);
      const focus = getFocusForDay(dayNumber);

      const exercises: WorkoutExercise[] = [
        {
          type: "pullups",
          sets: buildExerciseSets("pullups", maxes.pullups, weekNumber, focus, isMaxCheck),
          notes: isMaxCheck ? "Проверка максимума" : undefined,
        },
        {
          type: "squats",
          sets: buildExerciseSets("squats", maxes.squats, weekNumber, focus, isMaxCheck),
          notes: isMaxCheck ? "Проверка максимума" : undefined,
        },
        {
          type: "abs",
          sets: buildExerciseSets("abs", maxes.abs, weekNumber, focus, isMaxCheck),
          notes: isMaxCheck ? "Проверка максимума" : undefined,
        },
        {
          type: "pushups",
          sets: buildExerciseSets("pushups", maxes.pushups, weekNumber, focus, isMaxCheck),
          notes: isMaxCheck ? "Проверка максимума" : undefined,
        },
      ];

      plan.push({
        id: `w${dayNumber}`,
        date: format(date, "yyyy-MM-dd"),
        weekNumber,
        dayNumber,
        isMaxCheck,
        exercises,
        focus,
      });
    }
    date = addDays(date, 1);
  }

  return plan;
}

export function getWorkoutForDate(plan: WorkoutDay[], dateStr: string): WorkoutDay | undefined {
  return plan.find((w) => w.date === dateStr);
}

export function getNextWorkoutDate(plan: WorkoutDay[], fromDateStr: string): string | null {
  for (const w of plan) {
    if (w.date > fromDateStr) return w.date;
  }
  return null;
}

export function getPlanProgress(plan: WorkoutDay[], completedDates: Set<string>): { completed: number; total: number; percent: number } {
  const total = plan.length;
  const completed = plan.filter((w) => completedDates.has(w.date)).length;
  return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
}

export const DEFAULT_MAXES: UserMaxes = {
  pullups: 7,
  squats: 40,
  abs: 30,
  pushups: 30,
};

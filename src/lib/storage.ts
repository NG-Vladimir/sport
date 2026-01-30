import type { UserProgress, CompletedWorkout, UserMaxes } from "@/types";

const STORAGE_KEY = "fit-track-progress";

export function loadProgress(): UserProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as UserProgress;
    return data;
  } catch {
    return null;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
}

export function getDefaultProgress(maxes?: Partial<UserMaxes>): UserProgress {
  return {
    maxes: {
      pullups: maxes?.pullups ?? 7,
      squats: maxes?.squats ?? 40,
      abs: maxes?.abs ?? 30,
      pushups: maxes?.pushups ?? 30,
    },
    completedWorkouts: [],
    totalXp: 0,
    level: 1,
    unlockedAchievements: [],
    streakDays: 0,
    lastWorkoutDate: null,
  };
}

export function addCompletedWorkout(progress: UserProgress, workout: CompletedWorkout): UserProgress {
  const completed = [...progress.completedWorkouts, workout];
  const totalXp = progress.totalXp + workout.xpEarned;
  const level = xpToLevel(totalXp);
  const dates = new Set(completed.map((w) => w.date)).size;
  const lastDate = progress.lastWorkoutDate;
  const streakDays = lastDate
    ? (() => {
        const prev = new Date(lastDate);
        const curr = new Date(workout.date);
        const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return progress.streakDays;
        if (diff === 1) return progress.streakDays + 1;
        return 1;
      })()
    : 1;

  return {
    ...progress,
    completedWorkouts: completed,
    totalXp,
    level,
    lastWorkoutDate: workout.date,
    streakDays,
  };
}

export function xpToLevel(xp: number): number {
  let level = 1;
  let required = 100;
  let total = 0;
  while (total + required <= xp) {
    total += required;
    level++;
    required = Math.floor(required * 1.2);
  }
  return level;
}

export function xpForLevel(level: number): number {
  let total = 0;
  let required = 100;
  for (let i = 1; i < level; i++) {
    total += required;
    required = Math.floor(required * 1.2);
  }
  return total;
}

export function xpToNextLevel(totalXp: number): { current: number; required: number; progress: number } {
  const level = xpToLevel(totalXp);
  const currentLevelStart = xpForLevel(level);
  const nextLevelStart = currentLevelStart + (level === 1 ? 100 : Math.floor(100 * Math.pow(1.2, level - 1)));
  const required = nextLevelStart - currentLevelStart;
  const progress = totalXp - currentLevelStart;
  return { current: progress, required, progress: required ? Math.min(1, progress / required) : 1 };
}

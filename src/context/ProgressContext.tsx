"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { UserProgress, CompletedWorkout, CompletedSet } from "@/types";
import {
  loadProgress,
  saveProgress,
  getDefaultProgress,
  addCompletedWorkout,
  xpToNextLevel,
} from "@/lib/storage";
import { updateUnlockedAchievements } from "@/lib/achievements";
import { calculateWorkoutXp } from "@/lib/xp";

interface ProgressContextValue {
  progress: UserProgress | null;
  setProgress: (p: UserProgress) => void;
  completeWorkout: (workoutId: string, date: string, completedSets: CompletedSet[]) => void;
  xpProgress: ReturnType<typeof xpToNextLevel> | null;
  hydrated: boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState<UserProgress | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadProgress();
    setProgressState(loaded ?? getDefaultProgress());
    setHydrated(true);
  }, []);

  const setProgress = useCallback((p: UserProgress) => {
    setProgressState(p);
    saveProgress(p);
  }, []);

  useEffect(() => {
    if (progress && hydrated) saveProgress(progress);
  }, [progress, hydrated]);

  const completeWorkout = useCallback(
    (workoutId: string, date: string, completedSets: CompletedSet[]) => {
      if (!progress) return;
      const xpEarned = calculateWorkoutXp(completedSets);
      const completed: CompletedWorkout = {
        workoutId,
        date,
        completedSets,
        completedAt: new Date().toISOString(),
        xpEarned,
      };
      let next = addCompletedWorkout(progress, completed);
      next = updateUnlockedAchievements(next);
      setProgress(next);
    },
    [progress, setProgress]
  );

  const xpProgress = progress ? xpToNextLevel(progress.totalXp) : null;

  return (
    <ProgressContext.Provider
      value={{
        progress,
        setProgress,
        completeWorkout,
        xpProgress,
        hydrated,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}

import type { CompletedSet } from "@/types";

const BASE_XP_PER_WORKOUT = 50;
const XP_PER_REP: Record<string, number> = {
  pullups: 3,
  squats: 0.5,
  abs: 0.5,
  pushups: 0.5,
};

export function calculateWorkoutXp(completedSets: CompletedSet[]): number {
  let xp = BASE_XP_PER_WORKOUT;
  for (const set of completedSets) {
    xp += (XP_PER_REP[set.exerciseType] ?? 0.5) * set.reps;
  }
  return Math.round(xp);
}

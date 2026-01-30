import type { UserProgress, CompletedWorkout } from "@/types";
import { xpToLevel } from "./storage";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  check: (progress: UserProgress) => boolean;
}

function totalReps(workouts: CompletedWorkout[], type: string): number {
  return workouts.reduce((sum, w) => {
    return (
      sum +
      w.completedSets
        .filter((s) => s.exerciseType === type)
        .reduce((s, set) => s + set.reps, 0)
    );
  }, 0);
}

function uniqueWorkoutDays(workouts: CompletedWorkout[]): number {
  return new Set(workouts.map((w) => w.date)).size;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-hundred-squats",
    name: "Первая сотня приседаний",
    description: "Выполнить 100 приседаний в сумме за все тренировки",
    icon: "Dumbbell",
    xpReward: 50,
    check: (p) => totalReps(p.completedWorkouts, "squats") >= 100,
  },
  {
    id: "king-of-the-bar",
    name: "Король турника",
    description: "50 подтягиваний в сумме",
    icon: "Trophy",
    xpReward: 80,
    check: (p) => totalReps(p.completedWorkouts, "pullups") >= 50,
  },
  {
    id: "push-master",
    name: "Мастер отжиманий",
    description: "100 отжиманий в сумме",
    icon: "Flame",
    xpReward: 50,
    check: (p) => totalReps(p.completedWorkouts, "pushups") >= 100,
  },
  {
    id: "core-100",
    name: "Сотня пресса",
    description: "100 повторений на пресс в сумме",
    icon: "Target",
    xpReward: 50,
    check: (p) => totalReps(p.completedWorkouts, "abs") >= 100,
  },
  {
    id: "week-streak",
    name: "Неделя без пропусков",
    description: "7 тренировок подряд без пропусков",
    icon: "Calendar",
    xpReward: 100,
    check: (p) => p.streakDays >= 7,
  },
  {
    id: "thirty-days",
    name: "30 дней без пропусков",
    description: "30 тренировок подряд",
    icon: "Star",
    xpReward: 300,
    check: (p) => p.streakDays >= 30,
  },
  {
    id: "first-workout",
    name: "Первая тренировка",
    description: "Завершить первую тренировку",
    icon: "Zap",
    xpReward: 25,
    check: (p) => p.completedWorkouts.length >= 1,
  },
  {
    id: "ten-workouts",
    name: "10 тренировок",
    description: "Завершить 10 тренировок",
    icon: "Medal",
    xpReward: 75,
    check: (p) => uniqueWorkoutDays(p.completedWorkouts) >= 10,
  },
  {
    id: "level-five",
    name: "Уровень 5",
    description: "Достигнуть 5 уровня",
    icon: "TrendingUp",
    xpReward: 0,
    check: (p) => p.level >= 5,
  },
];

export function getNewlyUnlocked(progress: UserProgress, previousUnlocked: string[]): string[] {
  return ACHIEVEMENTS.filter((a) => a.check(progress) && !previousUnlocked.includes(a.id)).map((a) => a.id);
}

export function updateUnlockedAchievements(progress: UserProgress): UserProgress {
  const unlocked = ACHIEVEMENTS.filter((a) => a.check(progress)).map((a) => a.id);
  const newIds = unlocked.filter((id) => !progress.unlockedAchievements.includes(id));
  let extraXp = 0;
  for (const id of newIds) {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (a) extraXp += a.xpReward;
  }
  const newTotalXp = progress.totalXp + extraXp;
  return {
    ...progress,
    unlockedAchievements: unlocked,
    totalXp: newTotalXp,
    level: xpToLevel(newTotalXp),
  };
}

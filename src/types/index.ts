// === Workout & Plan ===
export type ExerciseType = "pullups" | "squats" | "abs" | "pushups";

export type LoadType = "strength" | "endurance" | "explosive";

export interface ExerciseSet {
  targetReps: number;
  restSeconds?: number;
  loadType?: LoadType;
}

export interface WorkoutExercise {
  type: ExerciseType;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  date: string; // YYYY-MM-DD
  weekNumber: number;
  dayNumber: number; // 1-90
  isMaxCheck: boolean;
  exercises: WorkoutExercise[];
  focus: LoadType;
}

export interface CompletedSet {
  exerciseType: ExerciseType;
  setIndex: number;
  reps: number;
  completedAt: string; // ISO
}

export interface CompletedWorkout {
  workoutId: string;
  date: string;
  completedSets: CompletedSet[];
  completedAt: string;
  xpEarned: number;
}

// === User & Progress ===
export interface UserMaxes {
  pullups: number;
  squats: number;
  abs: number;
  pushups: number;
}

export interface UserProgress {
  maxes: UserMaxes;
  completedWorkouts: CompletedWorkout[];
  totalXp: number;
  level: number;
  unlockedAchievements: string[];
  streakDays: number;
  lastWorkoutDate: string | null;
}

// === Achievements ===
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: (progress: UserProgress) => boolean;
}

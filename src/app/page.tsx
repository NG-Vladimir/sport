"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { useProgress } from "@/context/ProgressContext";
import { generate90DayPlan, getWorkoutForDate } from "@/lib/workoutPlan";
import { WorkoutCard } from "@/components/WorkoutCard";
import { ProgressBar } from "@/components/ProgressBar";
import { ActivityRings } from "@/components/ActivityRings";

export default function DashboardPage() {
  const { progress, xpProgress, hydrated } = useProgress();

  const plan = useMemo(() => {
    if (!progress?.maxes) return [];
    return generate90DayPlan(new Date(), progress.maxes);
  }, [progress?.maxes]);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayWorkout = plan.length ? getWorkoutForDate(plan, todayStr) : undefined;
  const completedDates = useMemo(() => {
    if (!progress?.completedWorkouts) return new Set<string>();
    return new Set(progress.completedWorkouts.map((w) => w.date));
  }, [progress?.completedWorkouts]);
  const planProgress = useMemo(() => {
    const total = plan.length;
    const completed = plan.filter((w) => completedDates.has(w.date)).length;
    const percent = total ? (completed / total) * 100 : 0;
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    const workoutsThisWeek = plan.filter((w) => {
      const d = new Date(w.date);
      return d >= weekStart && d <= now;
    }).length;
    const completedThisWeek = plan.filter((w) => {
      if (!completedDates.has(w.date)) return false;
      const d = new Date(w.date);
      return d >= weekStart && d <= now;
    }).length;
    const weekPercent = workoutsThisWeek ? (completedThisWeek / workoutsThisWeek) * 100 : 0;
    const achievementsTotal = 9;
    const achievementsUnlocked = progress?.unlockedAchievements?.length ?? 0;
    const achievementsPercent = achievementsTotal ? (achievementsUnlocked / achievementsTotal) * 100 : 0;
    return {
      planPercent: percent / 100,
      weekPercent: weekPercent / 100,
      achievementsPercent: achievementsPercent / 100,
    };
  }, [plan, completedDates, progress?.unlockedAchievements]);

  if (!hydrated || !progress) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-lime-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Fit Track</h1>
        <p className="mt-0.5 text-sm text-gray-500">90 дней</p>
      </header>

      <section className="rounded-xl border border-gray-800 bg-[#1a1a1a] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Уровень</span>
          <span className="text-xl font-bold text-white">LVL {progress.level}</span>
        </div>
        <ProgressBar
          value={xpProgress?.progress ?? 0}
          label={`${xpProgress?.current ?? 0} / ${xpProgress?.required ?? 100} XP`}
          showPercent={false}
          color="lime"
          height="lg"
        />
      </section>

      <ActivityRings
        values={[
          planProgress.planPercent,
          planProgress.weekPercent,
          planProgress.achievementsPercent,
        ]}
        labels={["План", "Неделя", "Достижения"]}
      />

      <section>
        <h2 className="mb-2 text-lg font-semibold text-white">Сегодня</h2>
        {todayWorkout ? (
          <WorkoutCard
            workout={todayWorkout}
            isToday
            completed={completedDates.has(todayStr)}
            startHref={"/log?date=" + todayStr}
          />
        ) : (
          <div className="rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 text-center text-gray-500">
            <p>Сегодня выходной.</p>
            <p className="mt-1 text-sm">Пн, Ср, Пт — тренировки</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-white">Статистика</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-800 bg-[#1a1a1a] p-4">
            <p className="text-xs text-gray-500">Тренировок</p>
            <p className="text-xl font-bold text-lime-400">{progress.completedWorkouts.length}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-[#1a1a1a] p-4">
            <p className="text-xs text-gray-500">Серия</p>
            <p className="text-xl font-bold text-green-400">{progress.streakDays} дн.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

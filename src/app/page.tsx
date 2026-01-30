"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
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
    const workoutsThisWeek = plan.filter((w) => {
      const d = new Date(w.date);
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1);
      return d >= weekStart && d <= now;
    }).length;
    const completedThisWeek = plan.filter(
      (w) => completedDates.has(w.date) && (() => {
        const d = new Date(w.date);
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1);
        return d >= weekStart && d <= now;
      })()
    ).length;
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
        <motion.div
          className="h-12 w-12 rounded-full border-2 border-neon-lime border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white">
          Fit Track
        </h1>
        <p className="mt-1 text-dark-muted">90 дней прогресса</p>
      </header>

      <section className="rounded-2xl border border-dark-border bg-dark-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display text-sm font-bold uppercase text-neon-lime">Уровень</span>
          <span className="font-display text-2xl font-bold text-white">LVL {progress.level}</span>
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
        labels={["План 90 дн.", "Неделя", "Достижения"]}
      />

      <section>
        <h2 className="mb-3 font-display text-lg font-bold uppercase tracking-wider text-white">
          Сегодня
        </h2>
        {todayWorkout ? (
          <WorkoutCard
            workout={todayWorkout}
            isToday
            completed={completedDates.has(todayStr)}
            startHref={"/log?date=" + todayStr}
          />
        ) : (
          <motion.div
            className="rounded-2xl border border-dark-border bg-dark-card p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-dark-muted">Сегодня выходной. Следующая тренировка — в плане.</p>
            <p className="mt-2 text-sm text-dark-muted">
              Пн, Ср, Пт — тренировочные дни
            </p>
          </motion.div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold uppercase tracking-wider text-white">
          Статистика
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            className="rounded-xl border border-dark-border bg-dark-card p-4"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs font-semibold uppercase text-dark-muted">Тренировок</p>
            <p className="font-display text-2xl font-bold text-neon-lime">
              {progress.completedWorkouts.length}
            </p>
          </motion.div>
          <motion.div
            className="rounded-xl border border-dark-border bg-dark-card p-4"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs font-semibold uppercase text-dark-muted">Серия</p>
            <p className="font-display text-2xl font-bold text-neon-green">
              {progress.streakDays} дн.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

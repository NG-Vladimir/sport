"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { AchievementBadge } from "@/components/AchievementBadge";
import { ACHIEVEMENTS } from "@/lib/achievements";

export default function AchievementsPage() {
  const { progress, hydrated } = useProgress();
  const unlockedSet = useMemo(
    () => new Set(progress?.unlockedAchievements ?? []),
    [progress?.unlockedAchievements]
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-neon-lime border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white">
          Достижения
        </h1>
        <p className="mt-1 text-dark-muted">
          {progress?.unlockedAchievements?.length ?? 0} из {ACHIEVEMENTS.length}
        </p>
      </header>

      <div className="grid gap-3">
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <AchievementBadge
              name={a.name}
              description={a.description}
              icon={a.icon}
              unlocked={unlockedSet.has(a.id)}
              xpReward={a.xpReward}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

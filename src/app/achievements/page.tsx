"use client";

import { useMemo } from "react";
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
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-lime-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Достижения</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          {progress?.unlockedAchievements?.length ?? 0} из {ACHIEVEMENTS.length}
        </p>
      </header>

      <div className="space-y-3">
        {ACHIEVEMENTS.map((a) => (
          <AchievementBadge
            key={a.id}
            name={a.name}
            description={a.description}
            icon={a.icon}
            unlocked={unlockedSet.has(a.id)}
            xpReward={a.xpReward}
          />
        ))}
      </div>
    </div>
  );
}

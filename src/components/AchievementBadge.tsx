"use client";

import {
  Trophy,
  Flame,
  Target,
  Calendar,
  Star,
  Zap,
  Medal,
  TrendingUp,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Dumbbell,
  Trophy,
  Flame,
  Target,
  Calendar,
  Star,
  Zap,
  Medal,
  TrendingUp,
};

interface AchievementBadgeProps {
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xpReward?: number;
  className?: string;
}

export function AchievementBadge({
  name,
  description,
  icon,
  unlocked,
  xpReward = 0,
  className = "",
}: AchievementBadgeProps) {
  const Icon = iconMap[icon] ?? Trophy;

  return (
    <div
      className={`rounded-xl border bg-[#1a1a1a] p-4 ${
        unlocked ? "border-lime-500/40 text-white" : "border-gray-800 text-gray-500"
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            unlocked ? "bg-lime-500/20 text-lime-400" : "bg-gray-800 text-gray-500"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{name}</p>
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
          {unlocked && xpReward > 0 && (
            <p className="mt-1 text-xs font-medium text-lime-400">+{xpReward} XP</p>
          )}
        </div>
      </div>
    </div>
  );
}

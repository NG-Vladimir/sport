"use client";

import { motion } from "framer-motion";
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
    <motion.div
      className={`rounded-xl border bg-dark-card p-4 transition-colors ${
        unlocked
          ? "border-neon-lime/50 shadow-[0_0_20px_rgba(184,255,60,0.1)]"
          : "border-dark-border opacity-60"
      } ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            unlocked ? "bg-neon-lime/20 text-neon-lime" : "bg-dark-muted text-dark-muted"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-display font-bold ${unlocked ? "text-white" : "text-dark-muted"}`}>{name}</p>
          <p className="mt-0.5 text-sm text-dark-muted">{description}</p>
          {unlocked && xpReward > 0 && (
            <p className="mt-1 text-xs font-semibold text-neon-lime">+{xpReward} XP</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

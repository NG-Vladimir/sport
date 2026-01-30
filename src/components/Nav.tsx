"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Dumbbell, Trophy, History } from "lucide-react";

const links = [
  { href: "/", label: "Дашборд", icon: LayoutDashboard },
  { href: "/log", label: "Тренировка", icon: Dumbbell },
  { href: "/achievements", label: "Достижения", icon: Trophy },
  { href: "/history", label: "История", icon: History },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-dark-border bg-dark-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className="relative flex flex-col items-center gap-0.5 px-4 py-2">
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-neon-lime/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className={`relative h-5 w-5 ${active ? "text-neon-lime" : "text-dark-muted"}`} />
              <span className={`relative text-xs font-bold ${active ? "text-neon-lime" : "text-dark-muted"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

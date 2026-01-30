"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, Trophy, History } from "lucide-react";

const links = [
  { href: "/", label: "Главная", icon: LayoutDashboard },
  { href: "/log", label: "Тренировка", icon: Dumbbell },
  { href: "/achievements", label: "Достижения", icon: Trophy },
  { href: "/history", label: "История", icon: History },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-[#141414] pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg justify-around py-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 px-4 py-2 ${
                active ? "text-lime-400" : "text-gray-500"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

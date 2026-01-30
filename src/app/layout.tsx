import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/context/ProgressContext";
import { Nav } from "@/components/Nav";

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Fit Track — Тренировки на 90 дней",
  description: "Адаптивная программа тренировок с прогрессией и геймификацией",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${oswald.variable} ${inter.variable}`}>
      <body className="antialiased">
        <ProgressProvider>
          <main className="mx-auto min-h-screen max-w-lg px-4 pb-24 pt-6">{children}</main>
          <Nav />
        </ProgressProvider>
      </body>
    </html>
  );
}

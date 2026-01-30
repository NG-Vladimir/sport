import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/context/ProgressContext";
import { Nav } from "@/components/Nav";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Fit Track — Тренировки 90 дней",
  description: "Программа тренировок на 90 дней. Сохраняй прогресс в телефоне.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-[#0f0f0f] text-gray-200 antialiased">
        <ProgressProvider>
          <main className="mx-auto min-h-screen max-w-lg px-4 pb-20 pt-4">{children}</main>
          <Nav />
        </ProgressProvider>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  // На главной название/подзаголовок уже показаны крупно внутри
  // hero-полосы — здесь они были бы дублем. На остальных страницах
  // (посты) hero нет, поэтому шапка нужна для навигации/идентификации.
  if (pathname === "/") return null;

  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-2xl px-4 py-6 flex items-baseline justify-between">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-display text-2xl text-ink">Егор Андреев</span>
          <span className="text-sm text-text-muted">стихи и песни</span>
        </Link>
      </div>
    </header>
  );
}

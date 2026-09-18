"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/#hero", label: "Главная" },
  { href: "/#about", label: "Обо мне" },
  { href: "/#stihi", label: "Стихи" },
  { href: "/#books", label: "Книги" },
  { href: "/#events", label: "События" },
  { href: "/#subscribe", label: "Контакты" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    // Шапка намеренно всегда тёмная (fixed-*, не theme-токены) в обеих
    // темах — она "стеклянно" лежит поверх hero-фото на весь скролл до
    // якоря #hero, а светлый текст на тёмном полупрозрачном стекле
    // одинаково хорошо читается что на фото, что на светлом контенте ниже.
    <header className="fixed top-0 left-0 right-0 z-50 bg-fixed-dark/40 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-display text-xl text-fixed-light">Егор Андреев</span>
          <span className="text-[11px] tracking-[0.25em] uppercase text-fixed-light/70">
            Поэт
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-fixed-light/70 hover:text-fixed-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/#subscribe"
            className="hidden md:inline-flex items-center px-5 py-2 border border-fixed-gold/60 text-fixed-gold text-sm tracking-wide rounded-full hover:bg-fixed-gold hover:text-fixed-dark transition-colors"
          >
            Связаться
          </Link>

          <button
            type="button"
            aria-label="Открыть меню"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-fixed-light p-2 -mr-2"
          >
            <span className="sr-only">Меню</span>
            <div className="w-6 h-[1.5px] bg-current mb-1.5" />
            <div className="w-6 h-[1.5px] bg-current mb-1.5" />
            <div className="w-4 h-[1.5px] bg-current" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden mx-4 mb-4 rounded-2xl bg-fixed-dark/70 backdrop-blur-md border border-white/10 px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base text-fixed-light hover:text-fixed-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

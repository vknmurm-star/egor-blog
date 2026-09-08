"use client";

import Link from "next/link";
import { useState } from "react";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-deep/40 backdrop-blur-md border-b border-line/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-display text-xl text-paper">Егор Андреев</span>
          <span className="text-[11px] tracking-[0.25em] uppercase text-paper-muted">
            Поэт
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-paper-muted hover:text-gold-soft transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#subscribe"
          className="hidden md:inline-flex items-center px-5 py-2 border border-gold/60 text-gold-soft text-sm tracking-wide rounded-full hover:bg-gold hover:text-bg-deep transition-colors"
        >
          Связаться
        </Link>

        <button
          type="button"
          aria-label="Открыть меню"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-paper p-2 -mr-2"
        >
          <span className="sr-only">Меню</span>
          <div className="w-6 h-[1.5px] bg-current mb-1.5" />
          <div className="w-6 h-[1.5px] bg-current mb-1.5" />
          <div className="w-4 h-[1.5px] bg-current" />
        </button>
      </div>

      {open && (
        <nav className="md:hidden mx-4 mb-4 rounded-2xl glass-card px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base text-paper hover:text-gold-soft transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

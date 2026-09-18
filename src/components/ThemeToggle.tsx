"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "theme";

export default function ThemeToggle() {
  // Тема на <html> уже выставлена синхронно инлайн-скриптом в layout.tsx
  // (до гидратации, чтобы не мигало тёмным при загрузке светлой темы) —
  // здесь просто читаем итог, чтобы кнопка отражала актуальное состояние.
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.getAttribute("data-theme") === "light");
  }, []);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.setAttribute("data-theme", next ? "light" : "dark");
    localStorage.setItem(STORAGE_KEY, next ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Включить тёмную тему" : "Включить светлую тему"}
      title={isLight ? "Тёмная тема" : "Светлая тема"}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-fixed-light/80 hover:text-fixed-gold hover:border-fixed-gold/50 transition-colors"
    >
      {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}

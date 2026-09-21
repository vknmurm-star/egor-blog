"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Лёгкий parallax фона — смещение до 10% высоты блока. scale-120 даёт
  // запас 10% с каждой стороны кадра, этого достаточно, чтобы при сдвиге
  // не обнажались края фотографии.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
    >
      <div className="absolute inset-0 bg-fixed-dark" />
      {/* Фото — вечерний кабинет поэта, блокнот, перьевая ручка, лампа,
          панорамное окно на закатный город. Кадр очень широкий (2.25:1),
          поэтому на мобильных используется bg-position со сдвигом влево —
          иначе center-кроп показывает только тетрадь, теряя лампу и стопку
          книг по краям (как было с широким фото на GENHOME). На десктопе
          при обычных пропорциях экрана видна большая часть композиции,
          поэтому там достаточно center. */}
      <motion.div
        className="absolute inset-0 bg-cover bg-[position:38%_center] md:bg-center scale-[1.2]"
        style={{
          backgroundImage: "url('/images/hero-placeholder.jpg')",
          y: bgY,
        }}
      />
      {/* Затемнение сильно облегчено (было 70/55/100%) — фото должно быть
          видно, читаемость текста держится в основном на text-shadow (как
          в цитатном блоке), направленность градиента (темнее у краёв,
          светлее в центре снимка) сохранена.
          fixed-dark, а не bg-deep — текст и скрим над фото не должны
          светлеть в светлой теме, иначе исчезнет контраст. */}
      <div className="absolute inset-0 bg-gradient-to-b from-fixed-dark/35 via-fixed-dark/15 to-fixed-dark/55" />

      {/* pt-24 + justify-start на мобильных — намеренно НЕ justify-center
          на всю высоту секции: на реальных телефонах видимая высота
          вьюпорта (за вычетом адресной строки браузера) заметно меньше,
          чем в devtools, и центрирование по min-h-screen задвигало верх
          заголовка ПОД фиксированную шапку (~83px). pt-24 (96px) гарантирует
          отступ независимо от высоты вьюпорта. С sm (640px+) возвращаем
          прежнее центрирование — на десктопе/планшетах вьюпорт всегда выше
          шапки с большим запасом, там ничего не менялось. */}
      <div className="relative flex-1 flex flex-col justify-start sm:justify-center pt-24 sm:pt-0 px-6 sm:px-10 max-w-6xl mx-auto w-full">
        <div className="max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="font-display font-medium leading-[1.05] text-5xl sm:text-6xl md:text-7xl text-fixed-light"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)" }}
          >
            Слова,
            <br />
            которые остаются
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="mt-6 max-w-md text-fixed-light/75 text-lg leading-relaxed"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
          >
            Современная поэзия о людях, времени, любви и тишине, которая
            делает нас живыми.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            className="mt-10"
          >
            <a
              href="#stihi"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-fixed-gold text-fixed-dark font-medium tracking-wide rounded-full hover:brightness-110 transition-[filter]"
            >
              Читать стихи →
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-14"
          >
            <p
              className="font-heading italic text-xl sm:text-2xl text-fixed-light/90"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
            >
              «В каждом слове — немного больше, чем тишина»
            </p>
            <p
              className="font-signature text-3xl text-fixed-gold mt-2"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
            >
              Егор Андреев
            </p>
          </motion.div>
        </div>
      </div>

      {/* Подсказка "листайте вниз" — только для мобильных (md:hidden).
          На десктопе подсказка не нужна: там весь Hero виден целиком с
          первого взгляда вместе с намёком "Читать стихи →" выше, а вот на
          мобильных, где Hero растянут на весь экран (min-h-screen) и
          основной контент подан крупным блоком сверху, лёгкий намёк на
          скролл снижает риск того, что посетитель решит, будто ниже
          ничего нет. Иконка вместо текстовой подписи — минимальный,
          ненавязчивый штрих, не текстовый блок, конкурирующий с
          заголовком/кнопкой. */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="md:hidden relative pb-8 flex justify-center text-fixed-gold"
        aria-label="Пролистать к содержанию"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.8))" }}
        >
          <ChevronDown className="w-7 h-7" strokeWidth={2} />
        </motion.span>
      </motion.a>
    </section>
  );
}

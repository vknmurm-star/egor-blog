"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
      <div className="absolute inset-0 bg-bg-deep" />
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
      <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/70 via-bg-deep/55 to-bg-deep" />

      <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-10 max-w-6xl mx-auto w-full">
        <div className="max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="font-display font-medium leading-[1.05] text-5xl sm:text-6xl md:text-7xl text-paper"
          >
            Слова,
            <br />
            которые остаются
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="mt-6 max-w-md text-paper-muted text-lg leading-relaxed"
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
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-bg-deep font-medium tracking-wide rounded-full hover:bg-gold-soft transition-colors"
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
            <p className="font-heading italic text-xl sm:text-2xl text-paper/90">
              «В каждом слове — немного больше, чем тишина»
            </p>
            <p className="font-signature text-3xl text-gold-soft mt-2">
              Егор Андреев
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative pb-10 flex flex-col items-center gap-2 text-paper-muted text-xs tracking-[0.2em] uppercase"
      >
        Листайте вниз
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}

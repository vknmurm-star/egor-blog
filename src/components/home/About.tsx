"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="relative bg-bg-raised texture-paper">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          // На мобильных grid схлопывается в одну колонку — этот блок,
          // чисто декоративное фото почти без текста, оказывается ПЕРВЫМ
          // перед бионаписанием и списком стихов. При 420px он один
          // занимал больше половины экрана, из-за чего "Последние
          // публикации" уезжали на 2+ экрана вниз ещё до какого-либо
          // читаемого контента. На md+ раскладка двухколоночная (фото
          // рядом с текстом) — там min-h нужен побольше, не трогаем.
          className="relative min-h-[220px] md:min-h-[560px]"
        >
          <div
            className="about-photo absolute inset-0 bg-cover bg-[position:center_28%] grayscale"
            style={{ backgroundImage: "url('/images/portrait-placeholder.jpg')" }}
          />
          <div className="absolute inset-0 bg-bg-deep/30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col justify-center px-6 sm:px-12 py-16 md:py-0"
        >
          <p className="text-xs tracking-[0.25em] uppercase text-gold-soft mb-4">
            Обо мне
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-paper leading-tight">
            Поэзия — мой способ
            <br />
            быть ближе
          </h2>
          <p className="mt-6 max-w-md text-paper-muted leading-relaxed">
            Меня зовут Егор Андреев. Я пишу стихи о том, что обычно остаётся
            между строк: мгновениях, людях, воспоминаниях и надежде.
          </p>
          <a
            href="#stihi"
            className="mt-8 inline-flex w-fit items-center px-7 py-3 border border-gold/50 text-gold-soft text-sm tracking-wide rounded-full hover:bg-gold hover:text-bg-deep transition-colors"
          >
            Узнать больше
          </a>
        </motion.div>
      </div>
    </section>
  );
}

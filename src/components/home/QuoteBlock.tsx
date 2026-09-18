"use client";

import { motion } from "framer-motion";

export default function QuoteBlock() {
  return (
    <section className="relative py-32 px-6 sm:px-10 overflow-hidden">
      {/* Горный пейзаж на закате. bg-position смещён вниз — самая яркая
          часть неба у солнца уходит за верхний край кадра, а под текстом
          остаются более тёмные горы и долина, на которых лучше читается
          светлый текст. */}
      <div
        className="absolute inset-0 bg-cover bg-[position:center_70%]"
        style={{ backgroundImage: "url('/images/quote-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-fixed-dark/25" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 60% at 50% 50%, rgba(11,13,18,0.4), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl text-center"
      >
        {/* Затемнение фона сильно облегчено, чтобы был виден пейзаж —
            читаемость текста держится в основном на text-shadow (как в
            hero на GENHOME), а не на плотном оверлее. */}
        <p
          className="font-heading text-2xl sm:text-3xl md:text-4xl leading-snug text-fixed-light"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
        >
          «Поэзия не меняет мир. Но она меняет людей.
          <br className="hidden sm:block" /> А люди — это и есть мир.»
        </p>
        <p
          className="font-signature text-3xl text-fixed-gold mt-8"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
        >
          Егор Андреев
        </p>
      </motion.div>
    </section>
  );
}

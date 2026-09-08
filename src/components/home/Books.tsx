"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// TODO: демо-данные — заменить на реальные сборники, когда появятся.
const BOOKS = [
  {
    title: "Там, где начинается утро",
    year: "2020",
    cover: "/images/book-cover-1.jpg",
  },
  {
    title: "Ближе к тишине",
    year: "2022",
    cover: "/images/book-cover-2.jpg",
  },
  {
    title: "Люди и дожди",
    year: "2024",
    cover: "/images/book-cover-3.jpg",
  },
];

function BookCard({ book, index }: { book: (typeof BOOKS)[number]; index: number }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: y * -8, ry: x * 8 });
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
      className="[perspective:1000px]"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
        className="hidden md:block transition-transform duration-200 ease-out will-change-transform"
      >
        <div className="aspect-[3/4] rounded-md overflow-hidden bg-bg-raised shadow-2xl shadow-black/40">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${book.cover}')` }}
          />
        </div>
      </div>

      {/* Мобильная/планшетная версия — без 3D-hover, он неинтуитивен на touch. */}
      <div className="md:hidden aspect-[3/4] rounded-md overflow-hidden bg-bg-raised shadow-xl shadow-black/30">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${book.cover}')` }}
        />
      </div>

      <p className="mt-4 font-heading text-xl text-paper">{book.title}</p>
      <p className="text-sm text-paper-muted mt-1">{book.year}</p>
    </motion.div>
  );
}

export default function Books() {
  return (
    <section id="books" className="bg-bg-base py-24 px-6 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-soft mb-4">
            Книги
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-paper leading-tight">
            Мои сборники
          </h2>
          <p className="mt-4 text-paper-muted leading-relaxed">
            Каждая книга — отдельный этап, настроение и взгляд на мир.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {BOOKS.map((book, i) => (
            <BookCard key={book.title} book={book} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

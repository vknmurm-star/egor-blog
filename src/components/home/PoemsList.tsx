"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Music } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import Pagination from "@/components/home/Pagination";
import type { PostMeta } from "@/lib/posts";

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  // Egor иногда сохраняет через CMS без поля "Дата" — без этой проверки
  // показывалось "Invalid Date" вместо того, чтобы просто скрыть строку.
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function PoemsList({
  posts,
  currentPage = 1,
  totalPages = 1,
  prevPageLastSlug,
  nextPageFirstSlug,
  pageFirstSlugs,
}: {
  posts: PostMeta[];
  currentPage?: number;
  totalPages?: number;
  prevPageLastSlug?: string;
  nextPageFirstSlug?: string;
  pageFirstSlugs?: string[];
}) {
  return (
    <section id="stihi" className="bg-bg-base py-24 px-6 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-soft mb-4">
            Стихи
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-paper leading-tight">
            {currentPage > 1 ? `Стихи — страница ${currentPage}` : "Последние публикации"}
          </h2>
          <p className="mt-4 text-paper-muted leading-relaxed">
            Стихи и песни, написанные в свободное время. Иногда со звуком —
            под некоторыми текстами есть плеер с песней на эти слова.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-10"
        >
          {posts.map((post) => (
            <motion.article
              key={post.slug}
              id={post.slug}
              variants={item}
              className="border-b border-line pb-10 flex flex-col sm:flex-row gap-5 scroll-mt-28"
            >
              {post.cover && (
                <Link
                  href={`/${post.slug}`}
                  className="shrink-0 self-start block w-fit p-1.5 border border-gold/40 rounded-sm"
                >
                  <div className="w-24 h-24 overflow-hidden bg-bg-raised">
                    <CoverImage
                      src={post.cover}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              )}
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-xs text-gold-soft mb-2 tracking-wide uppercase">
                  {formatDate(post.date)}
                  {post.audio && (
                    <span className="flex items-center gap-1 text-gold normal-case">
                      <Music className="w-4 h-4" />
                      песня
                    </span>
                  )}
                </p>
                <h3 className="font-heading text-2xl text-paper mb-3">
                  <Link href={`/${post.slug}`} className="hover:text-gold-soft transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-paper-muted leading-relaxed mb-3">{post.excerpt}</p>
                <Link
                  href={`/${post.slug}`}
                  className="text-sm text-gold-soft hover:text-gold underline underline-offset-4"
                >
                  Читать →
                </Link>
              </div>
            </motion.article>
          ))}
          {posts.length === 0 && (
            <p className="text-paper-muted">Пока здесь пусто — скоро появятся первые публикации.</p>
          )}
        </motion.div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          prevPageLastSlug={prevPageLastSlug}
          nextPageFirstSlug={nextPageFirstSlug}
          pageFirstSlugs={pageFirstSlugs}
        />
      </div>
    </section>
  );
}

import Link from "next/link";
import { Feather, Music } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import CoverImage from "@/components/CoverImage";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero — фон готов принять реальное фото (см. /images/hero-placeholder.jpg),
          пока используется CSS-градиент из токенов темы */}
      <section className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/hero-placeholder.jpg'), linear-gradient(135deg, var(--rust) 0%, var(--rust-deep) 45%, var(--ink) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="relative h-full flex flex-col items-center justify-end text-center px-4 pb-10">
          <p className="flex items-center gap-2 text-paper/80 text-xs tracking-[0.2em] uppercase mb-3">
            <Feather className="w-4 h-4" />
            Записная книжка поэта
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-paper drop-shadow-sm">
            Егор Андреев
          </h1>
          <p className="text-paper/85 mt-2">стихи и песни</p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-14">
        <p className="text-text-muted mb-10 leading-relaxed">
          Стихи и песни, написанные в свободное время. Иногда со звуком —
          под некоторыми текстами есть плеер с песней на эти слова.
        </p>
        <div className="space-y-10">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-line pb-10 flex flex-col sm:flex-row gap-5"
            >
              {post.cover && (
                <Link
                  href={`/${post.slug}`}
                  className="shrink-0 block w-full sm:w-32 aspect-video sm:aspect-square rounded overflow-hidden bg-paper-raised border border-line"
                >
                  <CoverImage
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </Link>
              )}
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-xs text-rust mb-2 tracking-wide uppercase">
                  {formatDate(post.date)}
                  {post.audio && (
                    <span className="flex items-center gap-1 text-gold normal-case">
                      <Music className="w-4 h-4" />
                      песня
                    </span>
                  )}
                </p>
                <h2 className="font-display text-2xl text-ink mb-3">
                  <Link href={`/${post.slug}`} className="hover:text-rust transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-text-muted leading-relaxed mb-3">{post.excerpt}</p>
                <Link
                  href={`/${post.slug}`}
                  className="text-sm text-rust-deep hover:text-rust underline underline-offset-4"
                >
                  Читать →
                </Link>
              </div>
            </article>
          ))}
          {posts.length === 0 && (
            <p className="text-text-muted">Пока здесь пусто — скоро появятся первые публикации.</p>
          )}
        </div>
      </section>
    </>
  );
}

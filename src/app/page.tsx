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
      {/* Hero — на весь первый экран. Плотная заливка --rust как основа
          (видна, пока /images/hero-placeholder.jpg не заменён на реальное
          фото), поверх — затемнение для читаемости белого текста. */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col">
        <div className="absolute inset-0 bg-rust" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-placeholder.jpg')" }}
        />
        <div className="absolute inset-0 bg-ink/55" />

        <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
          <p
            className="inline-flex items-center gap-2 w-fit mx-auto px-3 py-1 rounded-full bg-black/22 border border-white/15 backdrop-blur-sm text-white text-xs tracking-[0.2em] uppercase mb-8"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            <Feather className="w-3.5 h-3.5" />
            Записная книжка поэта
          </p>
          <h1
            className="font-display font-bold uppercase leading-[0.95] text-5xl sm:text-6xl md:text-7xl"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
          >
            <span className="block text-paper">Егор</span>
            <span className="block text-paper">Андреев</span>
            <span className="block text-gold">+Стихи и песни</span>
          </h1>
          <p
            className="mt-8 max-w-xl text-paper/90 text-lg sm:text-xl leading-relaxed"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}
          >
            Стихи и песни, написанные в свободное время — иногда со звуком.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#lenta"
              className="px-8 py-3 bg-ink text-paper font-medium tracking-wide uppercase text-sm hover:bg-ink-soft transition-colors"
            >
              Читать стихи
            </a>
            <Link
              href="/vecher-na-reke"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gold text-paper font-medium tracking-wide uppercase text-sm hover:bg-gold hover:text-ink transition-colors"
            >
              <Music className="w-4 h-4" />
              Слушать песни
            </Link>
          </div>
        </div>
      </section>

      <section id="lenta" className="mx-auto max-w-2xl px-4 py-14">
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
                  className="shrink-0 self-start block w-fit p-1.5 border-2 border-gold bg-line rounded-sm"
                >
                  <div className="w-24 h-24 overflow-hidden bg-paper-raised">
                    <CoverImage
                      src={post.cover}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
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

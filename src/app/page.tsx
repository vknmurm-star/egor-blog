import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

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
    <section className="mx-auto max-w-2xl px-4 py-14">
      <p className="text-text-muted mb-10 leading-relaxed">
        Стихи и песни, написанные в свободное время. Иногда со звуком —
        под некоторыми текстами есть плеер с песней на эти слова.
      </p>
      <div className="space-y-10">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-line pb-10">
            <p className="text-xs text-rust mb-2 tracking-wide uppercase">
              {formatDate(post.date)}
              {post.audio && <span className="ml-2 text-gold">♫ с песней</span>}
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
          </article>
        ))}
        {posts.length === 0 && (
          <p className="text-text-muted">Пока здесь пусто — скоро появятся первые публикации.</p>
        )}
      </div>
    </section>
  );
}

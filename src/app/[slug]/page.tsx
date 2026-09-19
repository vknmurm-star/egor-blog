import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import CoverImage from "@/components/CoverImage";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(decodeURIComponent(slug));
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/${post.slug}`,
    image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
    publishedTime: post.date,
  });
}

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  // Egor иногда сохраняет через CMS без поля "Дата" — без этой проверки
  // showed "Invalid Date" вместо того, чтобы просто скрыть строку.
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Next.js для не-ASCII (кириллических) динамических сегментов иногда
  // передаёт сюда percent-encoded строку (например, при статической
  // генерации: %D0%B2%D1%80%D0%B5...) вместо декодированной — хотя в
  // generateMetadata выше тот же params.slug приходит уже декодированным.
  // decodeURIComponent на уже декодированной ASCII-строке — no-op, так что
  // безопасно применять всегда.
  const post = getPostBySlug(decodeURIComponent(slug));
  if (!post) notFound();

  // getAllPosts() отсортирован от новых к старым — соседи по дате
  // публикации, для простой навигации "предыдущий/следующий стих".
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const olderPost = currentIndex >= 0 ? allPosts[currentIndex + 1] : undefined;
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: post.title,
    text: post.content.trim(),
    description: post.excerpt,
    url: `${SITE_URL}/${post.slug}`,
    datePublished: post.date,
    image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
    author: {
      "@type": "Person",
      name: "Егор Андреев",
    },
  };

  return (
    <article className="mx-auto max-w-2xl px-4 pt-32 pb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      {post.cover && (
        <div className="mb-8 p-2 border border-gold/40 bg-bg-raised rounded-sm">
          <div className="aspect-video w-full overflow-hidden bg-bg-raised">
            <CoverImage
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      <Link
        href="/"
        className="text-sm text-paper-muted hover:text-gold-soft transition-colors"
      >
        ← Все публикации
      </Link>
      {formatDate(post.date) && (
        <p className="text-xs text-gold-soft mt-6 mb-2 tracking-wide uppercase">
          {formatDate(post.date)}
        </p>
      )}
      <h1 className="font-heading text-4xl text-paper mb-8">{post.title}</h1>

      {post.audio && (
        <audio controls className="w-full mb-8">
          <source src={post.audio} />
          Ваш браузер не поддерживает воспроизведение аудио.
        </audio>
      )}

      {post.video && (
        // preload="metadata" — не тянет всё видео каждому, кто просто
        // читает текст стиха, только длительность/первый кадр.
        <video
          controls
          playsInline
          preload="metadata"
          poster={post.cover}
          className="w-full mb-8 rounded-sm bg-black"
        >
          <source src={post.video} type="video/mp4" />
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      )}

      <div className="poem-text font-poem text-xl text-paper/90">
        {post.content.trim()}
      </div>

      {(olderPost || newerPost) && (
        <nav className="mt-14 pt-8 border-t border-line flex items-center justify-between gap-4 text-sm">
          {olderPost ? (
            <Link
              href={`/${olderPost.slug}`}
              className="text-paper-muted hover:text-gold-soft transition-colors"
            >
              ← {olderPost.title}
            </Link>
          ) : (
            <span />
          )}
          {newerPost && (
            <Link
              href={`/${newerPost.slug}`}
              className="text-right text-paper-muted hover:text-gold-soft transition-colors"
            >
              {newerPost.title} →
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}

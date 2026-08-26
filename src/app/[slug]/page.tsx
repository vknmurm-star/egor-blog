import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";
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
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/${post.slug}`,
  });
}

function formatDate(iso: string) {
  const d = new Date(iso);
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
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-14">
      {post.cover && (
        <div className="mb-8 p-2 border-2 border-gold bg-paper rounded-sm">
          <div className="aspect-video w-full overflow-hidden bg-paper-raised">
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
        className="text-sm text-text-muted hover:text-rust transition-colors"
      >
        ← Все публикации
      </Link>
      <p className="text-xs text-rust mt-6 mb-2 tracking-wide uppercase">
        {formatDate(post.date)}
      </p>
      <h1 className="font-display text-3xl text-ink mb-8">{post.title}</h1>

      {post.audio && (
        <audio controls className="w-full mb-8">
          <source src={post.audio} />
          Ваш браузер не поддерживает воспроизведение аудио.
        </audio>
      )}

      <div className="poem-text font-poem text-lg text-text">
        {post.content.trim()}
      </div>
    </article>
  );
}

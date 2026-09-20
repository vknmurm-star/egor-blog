import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsPage, getTotalPages } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";
import PoemsList from "@/components/home/PoemsList";

// Страница 1 отдельно НЕ генерируется — она живёт на "/" (см. src/app/page.tsx).
// dynamicParams: false ниже гарантирует чистый 404 на /page/1 и на любой
// номер за пределами текущего totalPages, а не рендер "на лету" дубля
// главной или страницы, которой ещё нет по факту количества постов.
export function generateStaticParams() {
  const totalPages = getTotalPages();
  const pages = [];
  for (let p = 2; p <= totalPages; p++) {
    pages.push({ page: String(p) });
  }
  return pages;
}

export const dynamicParams = false;

function parsePage(page: string): number | null {
  const n = Number(page);
  return Number.isInteger(n) ? n : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parsePage(page);
  if (pageNum === null) return {};
  return buildMetadata({
    title: `Стихи — страница ${pageNum}`,
    description: `Стихи и песни Егора Андреева — страница ${pageNum} ленты публикаций.`,
    path: `/page/${pageNum}`,
  });
}

export default async function PaginatedPostsPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNum = parsePage(page);
  if (pageNum === null) notFound();

  const result = getPostsPage(pageNum);
  if (!result) notFound();

  return (
    <div className="pt-32">
      <PoemsList
        posts={result.posts}
        currentPage={result.currentPage}
        totalPages={result.totalPages}
      />
    </div>
  );
}

import Link from "next/link";

function pageHref(page: number): string {
  return page === 1 ? "/" : `/page/${page}`;
}

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Навигация по страницам"
      className="mt-14 flex items-center justify-center gap-2 flex-wrap"
    >
      {currentPage > 1 && (
        <Link
          href={pageHref(currentPage - 1)}
          className="px-4 py-2 rounded-full border border-line text-sm text-paper-muted hover:text-gold-soft hover:border-gold/50 transition-colors"
        >
          ← Назад
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={
            page === currentPage
              ? "w-10 h-10 flex items-center justify-center rounded-full bg-gold text-bg-deep font-medium text-sm"
              : "w-10 h-10 flex items-center justify-center rounded-full border border-line text-sm text-paper-muted hover:text-gold-soft hover:border-gold/50 transition-colors"
          }
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={pageHref(currentPage + 1)}
          className="px-4 py-2 rounded-full border border-line text-sm text-paper-muted hover:text-gold-soft hover:border-gold/50 transition-colors"
        >
          Далее →
        </Link>
      )}
    </nav>
  );
}

import Link from "next/link";

function pageHref(page: number): string {
  return page === 1 ? "/" : `/page/${page}`;
}

export default function Pagination({
  currentPage,
  totalPages,
  prevPageLastSlug,
  nextPageFirstSlug,
  pageFirstSlugs,
}: {
  currentPage: number;
  totalPages: number;
  // Слаги граничных постов соседних страниц — без них "Назад"/"Далее"
  // открывали бы страницу сверху, под шапкой, а не к месту, где читатель
  // остановился (см. skill egorpoet-poetry-blog, раздел 11: scroll-mt-*
  // уже стоит на самих постах, поэтому просто добавляем #slug к ссылке).
  prevPageLastSlug?: string;
  nextPageFirstSlug?: string;
  // Слаг первого поста для КАЖДОЙ страницы (индекс 0 = страница 1) — та же
  // логика для номерных ссылок 1/2/3...: ведут на якорь, а не просто
  // открывают страницу сверху.
  pageFirstSlugs?: string[];
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const prevHref = `${pageHref(currentPage - 1)}${prevPageLastSlug ? `#${prevPageLastSlug}` : ""}`;
  const nextHref = `${pageHref(currentPage + 1)}${nextPageFirstSlug ? `#${nextPageFirstSlug}` : ""}`;

  return (
    <nav
      aria-label="Навигация по страницам"
      className="mt-14 flex items-center justify-center gap-2 flex-wrap"
    >
      {currentPage > 1 && (
        <Link
          href={prevHref}
          className="px-4 py-2 rounded-full border border-line text-sm text-paper-muted hover:text-gold-soft hover:border-gold/50 transition-colors"
        >
          ← Назад
        </Link>
      )}

      {pages.map((page) => {
        const firstSlug = pageFirstSlugs?.[page - 1];
        // Активная кнопка — без якоря, ей некуда вести: страница и так уже
        // открыта, лишний #slug только сдвинул бы скролл без навигации.
        const href =
          page === currentPage
            ? pageHref(page)
            : `${pageHref(page)}${firstSlug ? `#${firstSlug}` : ""}`;
        return (
          <Link
            key={page}
            href={href}
            aria-current={page === currentPage ? "page" : undefined}
            className={
              page === currentPage
                ? "w-10 h-10 flex items-center justify-center rounded-full bg-gold text-bg-deep font-medium text-sm"
                : "w-10 h-10 flex items-center justify-center rounded-full border border-line text-sm text-paper-muted hover:text-gold-soft hover:border-gold/50 transition-colors"
            }
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={nextHref}
          className="px-4 py-2 rounded-full border border-line text-sm text-paper-muted hover:text-gold-soft hover:border-gold/50 transition-colors"
        >
          Далее →
        </Link>
      )}
    </nav>
  );
}

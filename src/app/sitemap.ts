import type { MetadataRoute } from "next";
import { getAllPosts, getTotalPages, POSTS_PER_PAGE } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const allPosts = getAllPosts();

  const postRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
    // encodeURI, а не encodeURIComponent — слаг тут единственный сегмент
    // пути (без "/" внутри), но encodeURI безопаснее на случай, если
    // когда-нибудь в слаге появится "/"; кириллица percent-encode'ится
    // в любом случае. Без этого sitemap.xml с сырой кириллицей в <loc>
    // невалиден по спецификации.
    url: encodeURI(`${SITE_URL}/${post.slug}`),
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Страница 1 ленты — сама главная (уже добавлена ниже), поэтому здесь
  // только /page/2 и далее. lastModified страницы — дата самого нового
  // поста НА НЕЙ (первый элемент среза, allPosts отсортирован от новых
  // к старым), а не текущее время — иначе поисковик решит, что старая
  // страница пагинации меняется каждый день.
  const totalPages = getTotalPages();
  const paginationRoutes: MetadataRoute.Sitemap = [];
  for (let page = 2; page <= totalPages; page++) {
    const firstPostOnPage = allPosts[(page - 1) * POSTS_PER_PAGE];
    paginationRoutes.push({
      url: `${SITE_URL}/page/${page}`,
      lastModified: firstPostOnPage?.date ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...postRoutes,
    ...paginationRoutes,
  ];
}

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
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

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...postRoutes,
  ];
}

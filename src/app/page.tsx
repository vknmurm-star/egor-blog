import { getPostsPage, getPageFirstSlugs } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import PoemsList from "@/components/home/PoemsList";
import Books from "@/components/home/Books";
import QuoteBlock from "@/components/home/QuoteBlock";
import Events from "@/components/home/Events";
import Subscribe from "@/components/home/Subscribe";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  author: {
    "@type": "Person",
    name: "Егор Андреев",
  },
  inLanguage: "ru-RU",
};

export default function Home() {
  // Первая страница ленты (getPostsPage(1) не бывает null — при пустом
  // content/posts вернёт totalPages: 1, posts: []).
  const { posts, currentPage, totalPages, nextPageFirstSlug } = getPostsPage(1)!;
  const pageFirstSlugs = getPageFirstSlugs();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero />
      <About />
      <PoemsList
        posts={posts}
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageFirstSlug={nextPageFirstSlug}
        pageFirstSlugs={pageFirstSlugs}
      />
      <Books />
      <QuoteBlock />
      <Events />
      <Subscribe />
    </>
  );
}

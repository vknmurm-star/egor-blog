import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  audio?: string;
  cover?: string;
};

export type Post = PostMeta & {
  content: string;
  video?: string;
};

// Egor периодически сохраняет пост через CMS без поля "Дата". Раньше это
// давало Invalid Date/пустой lastmod в sitemap. Фолбэк: дата последнего
// git-коммита файла (наиболее точная — реальная дата публикации), а если
// git недоступен (не репозиторий, бинарь не найден) — mtime файла на диске.
function resolveDate(filePath: string, rawDate?: string): string {
  if (rawDate) {
    const parsed = new Date(rawDate);
    if (!Number.isNaN(parsed.getTime())) return rawDate;
  }
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%aI", "--", filePath],
      { cwd: process.cwd(), encoding: "utf8" }
    ).trim();
    if (out) return out;
  } catch {
    // не git-репозиторий или git недоступен — идём дальше на mtime
  }
  try {
    return fs.statSync(filePath).mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function listSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPosts(): PostMeta[] {
  return listSlugs()
    .map((slug) => {
      const filePath = path.join(POSTS_DIR, `${slug}.md`);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title as string,
        date: resolveDate(filePath, data.date as string | undefined),
        excerpt: data.excerpt as string,
        audio: data.audio as string | undefined,
        cover: data.cover as string | undefined,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const POSTS_PER_PAGE = 10;

export function getTotalPages(): number {
  return Math.max(1, Math.ceil(getAllPosts().length / POSTS_PER_PAGE));
}

export interface PostsPage {
  posts: PostMeta[];
  currentPage: number;
  totalPages: number;
  // Слаги для якорных ссылок "Назад"/"Далее" в пагинации — граничные посты
  // соседних страниц, а не первые попавшиеся: "Назад" должен приземлять на
  // ПОСЛЕДНИЙ пост предыдущей страницы (он непосредственно предшествует
  // текущей — переход ощущается как продолжение чтения назад), "Далее" —
  // на ПЕРВЫЙ пост следующей (продолжение чтения вперёд). undefined на
  // границах (страницы 1 или последней).
  prevPageLastSlug?: string;
  nextPageFirstSlug?: string;
}

/** Возвращает срез постов для страницы пагинации (1-indexed) или null,
 * если номер страницы вне диапазона — вызывающий код решает, что делать
 * (notFound()/redirect на главную и т.п.). */
export function getPostsPage(page: number): PostsPage | null {
  const allPosts = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null;
  const start = (page - 1) * POSTS_PER_PAGE;
  return {
    posts: allPosts.slice(start, start + POSTS_PER_PAGE),
    currentPage: page,
    totalPages,
    prevPageLastSlug: page > 1 ? allPosts[start - 1]?.slug : undefined,
    nextPageFirstSlug:
      page < totalPages ? allPosts[start + POSTS_PER_PAGE]?.slug : undefined,
  };
}

/** Слаг первого поста для каждой страницы пагинации (индекс 0 = страница 1)
 * — нужен для номерных ссылок 1/2/3.../N в пагинации, чтобы они тоже вели
 * на якорь конкретного поста, а не просто открывали страницу сверху (та
 * же логика, что для "Назад"/"Далее"). */
export function getPageFirstSlugs(): string[] {
  const allPosts = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const slugs: string[] = [];
  for (let page = 1; page <= totalPages; page++) {
    const slug = allPosts[(page - 1) * POSTS_PER_PAGE]?.slug;
    if (slug) slugs.push(slug);
  }
  return slugs;
}

/** На какой странице пагинации лежит пост с этим slug — нужно для ссылки
 * "Все публикации" со страницы поста (см. skill egorpoet-poetry-blog,
 * раздел 11): она должна вести на ту страницу ленты, где реально
 * находится пост, а не всегда на первую. */
export function getPostPageNumber(slug: string): number {
  const allPosts = getAllPosts();
  const index = allPosts.findIndex((p) => p.slug === slug);
  if (index === -1) return 1;
  return Math.floor(index / POSTS_PER_PAGE) + 1;
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    date: resolveDate(filePath, data.date as string | undefined),
    excerpt: data.excerpt as string,
    audio: data.audio as string | undefined,
    cover: data.cover as string | undefined,
    video: data.video as string | undefined,
    content,
  };
}

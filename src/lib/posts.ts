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

#!/usr/bin/env node
/**
 * Рассылка подписчикам о новых стихах. Запускается тем же cron-циклом, что
 * и автодеплой (см. auto-deploy-check.sh на сервере), ПОСЛЕ сборки/рестарта
 * — сравнивает текущий список постов с data/last-notified-posts.json
 * (слаги, о которых уже разослано) и рассылает письма только о разнице.
 *
 * Обычный node-скрипт (.mjs), не TS-модуль из src/lib — cron вызывает его
 * напрямую через `node`, без прогона через Next.js/ts-node. Из-за этого
 * логика чтения env/SMTP и подписчиков продублирована в упрощённом виде из
 * src/lib/mailer.ts и src/lib/subscribers.ts, а не импортируется оттуда.
 *
 * Важно про первый запуск: если last-notified-posts.json ещё нет, скрипт
 * ЗАПОМИНАЕТ все текущие посты как уже разосланные и завершается без единого
 * письма — иначе при первом включении рассылки подписчики (если появятся до
 * первого реального нового поста) получили бы разом письма про все старые
 * стихи.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import nodemailer from "nodemailer";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const DATA_DIR = path.join(ROOT, "data");
const SUBSCRIBERS_PATH = path.join(DATA_DIR, "subscribers.json");
const LAST_NOTIFIED_PATH = path.join(DATA_DIR, "last-notified-posts.json");

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function env(name) {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

function getTransport() {
  const host = env("SMTP_HOST");
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");
  if (!host || !user || !pass) return null;
  const port = Number(env("SMTP_PORT") || "465");
  const secureEnv = env("SMTP_SECURE");
  const secure = secureEnv ? secureEnv === "true" : port === 465;
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

async function sendMail(transport, { to, subject, html, text }) {
  try {
    await transport.sendMail({
      from: env("SMTP_FROM") || env("SMTP_USER"),
      to,
      subject,
      html,
      text,
    });
    return true;
  } catch (err) {
    console.error(`[notify-subscribers] Ошибка отправки «${subject}» для ${to}:`, err.message || err);
    return false;
  }
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function getCurrentPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), "utf8");
      const { data } = matter(raw);
      return { slug, title: data.title || slug, date: data.date || "" };
    })
    .sort((a, b) => (a.date < b.date ? -1 : 1)); // старые сначала — письма уйдут в хронологическом порядке
}

async function main() {
  loadEnvLocal();

  const SITE_URL = env("SITE_URL") || "https://egorpoet.ru";
  const posts = getCurrentPosts();
  const currentSlugs = posts.map((p) => p.slug);

  const lastNotified = readJson(LAST_NOTIFIED_PATH, null);
  if (lastNotified === null) {
    writeJson(LAST_NOTIFIED_PATH, { slugs: currentSlugs });
    console.log(
      `[notify-subscribers] Первый запуск: запомнил ${currentSlugs.length} существующих постов, писем не отправлено.`,
    );
    return;
  }

  const knownSlugs = new Set(lastNotified.slugs || []);
  const newPosts = posts.filter((p) => !knownSlugs.has(p.slug));

  if (newPosts.length === 0) {
    console.log("[notify-subscribers] Новых постов нет.");
    return;
  }

  const subscribers = readJson(SUBSCRIBERS_PATH, []);
  console.log(
    `[notify-subscribers] Новых постов: ${newPosts.length}, подписчиков: ${subscribers.length}.`,
  );

  if (subscribers.length > 0) {
    const transport = getTransport();
    if (!transport) {
      console.error("[notify-subscribers] SMTP не настроен — письма не отправлены.");
    } else {
      for (const post of newPosts) {
        const postUrl = encodeURI(`${SITE_URL}/${post.slug}`);
        for (const subscriber of subscribers) {
          const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${subscriber.token}`;
          const ok = await sendMail(transport, {
            to: subscriber.email,
            subject: `Новый стих: ${post.title}`,
            html: `
              <p>Егор Андреев опубликовал новый стих — <strong>${post.title}</strong>.</p>
              <p><a href="${postUrl}">${postUrl}</a></p>
              <p style="color:#888; font-size:12px; margin-top:24px;">
                Отписаться от рассылки: <a href="${unsubscribeUrl}">${unsubscribeUrl}</a>
              </p>
            `,
            text: `Егор Андреев опубликовал новый стих — ${post.title}.\n${postUrl}\n\nОтписаться от рассылки: ${unsubscribeUrl}`,
          });
          if (!ok) {
            console.error(`[notify-subscribers] Не удалось отправить «${post.title}» на ${subscriber.email}`);
          }
        }
      }
    }
  }

  // Помечаем как разосланные ВСЕ текущие посты (не только успешно отправленные
  // по каждому подписчику) — иначе разовый сбой SMTP превратится в бесконечный
  // повтор рассылки на каждом cron-цикле. Это осознанный компромисс:
  // при временной недоступности SMTP письмо о конкретном посте может не дойти
  // части подписчиков и не будет разослано повторно.
  writeJson(LAST_NOTIFIED_PATH, { slugs: currentSlugs });
  console.log("[notify-subscribers] Готово.");
}

main().catch((err) => {
  console.error("[notify-subscribers] Необработанная ошибка:", err);
  process.exit(1);
});

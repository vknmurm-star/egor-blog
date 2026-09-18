# egor-blog (egorpoet.ru)

Личный блог Егора Андреева — стихи и песни на его стихи. Мигрирован с
собственного VDS `kvm.an51.su` (где жил как `egor.an51.su`) на хостинг
Beget — тот же сервер, где развёрнут `andreev-zakon.ru` (проект
andreev-site). **andreev-zakon.ru при работе с этим проектом трогать
нельзя** — сервер общий для обоих сайтов на одном IP.

Домен: **egorpoet.ru**.

## Стек

Next.js (App Router) + Tailwind v4 + Decap CMS, без базы данных — контент
в markdown-файлах в git (`content/posts/*.md`), как во всех похожих
проектах на этом VDS.

## Порт и процесс

PM2-процесс `egorpoet`, слушает порт **3002** (следующий свободный на
Beget на момент миграции — 3000 занят демо-приложением Beget, 3001 —
`andreev-site`). Порт передаётся через `PORT=3002` при `pm2 start`.

## Формат поста

`content/posts/<slug>.md`:
```yaml
---
title: "Заголовок"
date: "YYYY-MM-DD"
excerpt: "Короткое описание для ленты и SEO"
audio: "/audio/<файл>.mp3"   # необязательно
---
Текст стихотворения, построчно.

Пустая строка — разрыв между строфами.
```

**Важно**: тело поста рендерится КАК ЕСТЬ (через CSS `white-space:
pre-line` в `.poem-text`), не через `marked`/markdown-парсинг — это
осознанное решение, чтобы переносы строк в стихах не терялись и не
требовали markdown-трюков (два пробела в конце строки и т.п.). Поэтому
и в `config.yml` поле тела поста — `widget: "text"` (обычный
многострочный textarea), а НЕ `widget: "markdown"` — иначе Decap CMS
может нормализовать текст через свой WYSIWYG-редактор и сломать
построчную структуру стиха.

## Аудио-файлы

Загружаются через Decap CMS (media library, см. `config.yml`,
`media_folder`) прямо в `public/audio/`, оттуда раздаются статикой.
Поле `audio` в frontmatter — путь вида `/audio/filename.mp3`. Если поля
нет или файл не залит — плеер на странице поста просто не рендерится
(проверка `{post.audio && ...}` в `src/app/[slug]/page.tsx`).

## SITE_URL и абсолютные URL

`src/lib/seo.ts` хардкодит `SITE_URL = "https://egorpoet.ru"` (не из
env) — так же, как в `andreev-site`. `src/app/api/auth/route.ts` и
`api/callback/route.ts` берут базовый URL из `process.env.SITE_URL`, а
не `req.nextUrl.origin` — за nginx reverse proxy `req.nextUrl.origin`
видит только `localhost:3002`.

## Изображения

- **Hero на главной** (`src/app/page.tsx`) — фон под шапкой готов
  принять реальное фото: `public/images/hero-placeholder.jpg` (файла
  пока нет, показывается CSS-градиент из токенов темы, см.
  `public/images/README.txt`). Просто положить файл с этим именем —
  код трогать не нужно.
- **Обложки постов** — опциональное поле `cover` в frontmatter,
  путь вида `/images/covers/<slug>.jpg` (см.
  `public/images/covers/README.txt` для конвенции именования). Пустое
  поле/отсутствующий файл не ломает вёрстку — `src/components/CoverImage.tsx`
  скрывает себя при ошибке загрузки (`onError`), а не показывает
  битую иконку.
- Три из четырёх демо-постов уже содержат `cover:` с ожидаемым путём
  (файлов там пока нет — ждут реальных изображений), `utro.md`
  специально оставлен без поля, чтобы показать состояние "без
  обложки".

## Деплой

Сервер — Beget (IP 159.194.200.182), путь `/var/www/egorpoet-site`,
процесс из skill `beget-cms-deploy` (по аналогии с `andreev-site`).
`.env.local` на сервере (не в git) должен содержать:
```
GITHUB_OAUTH_CLIENT_ID=...
GITHUB_OAUTH_CLIENT_SECRET=...
SITE_URL=https://egorpoet.ru
```
**Важно**: GitHub OAuth App поддерживает только один callback URL —
для egorpoet.ru нужно отдельное OAuth-приложение (не то же, что
использовалось для egor.an51.su), иначе смена callback сломает вход в
CMS на старом домене, пока он ещё жив.

Ручной деплой: `git pull && npm install && rm -rf .next && npm run build &&
pm2 restart egorpoet` в `/var/www/egorpoet-site`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# egor-blog

Личный блог Егора Андреева — стихи и песни на его стихи. Отдельный проект
от юридического сайта andreev-zakon.ru (тот развёрнут на другом сервере,
Beget). Этот сайт живёт на собственном VDS `kvm.an51.su`, том же, где
`site-001`, `market-store`, `finance-001`, `mv-004`.

Домен: **egor.an51.su**.

## Стек

Next.js (App Router) + Tailwind v4 + Decap CMS, без базы данных — контент
в markdown-файлах в git (`content/posts/*.md`), как во всех похожих
проектах на этом VDS.

## Порт и процесс

PM2-процесс `egor-blog`, слушает порт **3004** (следующий свободный на
момент создания — 3000/3001/3002/3003 заняты другими проектами на этом
же VDS). Порт передаётся через `PORT=3004` при `pm2 start`.

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

`src/lib/seo.ts` хардкодит `SITE_URL = "https://egor.an51.su"` (не из
env) — так же, как в `andreev-site`. `src/app/api/auth/route.ts` (когда
будет добавлен на этапе настройки CMS) ДОЛЖЕН брать базовый URL из
`process.env.SITE_URL`, а не `req.nextUrl.origin` — за nginx reverse
proxy `req.nextUrl.origin` видит только `localhost:3004`.

## Деплой

Процесс из skill `vds-nextjs-deploy`. `.env.local` на сервере (не в
git) должен содержать при настройке CMS:
```
GITHUB_OAUTH_CLIENT_ID=...
GITHUB_OAUTH_CLIENT_SECRET=...
SITE_URL=https://egor.an51.su
```

Автодеплой через cron настраивается на последнем этапе (`deploy.sh` +
`auto-deploy-check.sh` + `crontab`, паттерн идентичен другим проектам
на этом VDS).

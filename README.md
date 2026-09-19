# Егор Андреев — личный сайт

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Decap CMS. Контент
постов — markdown-файлы в `content/posts/*.md` (см. `CLAUDE.md`).

## Подписка на новости

Форма подписки на главной (`src/components/home/Subscribe.tsx`) отправляет
email на `POST /api/subscribe`. Подписчики хранятся в `data/subscribers.json`
(не в git), рассылка о новых постах — отдельный скрипт
`scripts/notify-subscribers.mjs`, запускается cron'ом на сервере вместе с
автодеплоем. Подробности — в `CLAUDE.md`, раздел «Подписка на новости».

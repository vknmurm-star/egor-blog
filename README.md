# Егор Андреев — личный сайт

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Decap CMS. Контент
постов — markdown-файлы в `content/posts/*.md` (см. `CLAUDE.md`).

## Подписка на новости

Форма подписки на главной (`src/components/home/Subscribe.tsx`) отправляет
email на `POST /api/subscribe` (`src/app/api/subscribe/route.ts`). Сейчас
это заглушка — валидирует адрес и логирует заявку (`pm2 logs egor-blog`),
реальная отправка никуда не подключена.

Чтобы подключить реальный сервис рассылки, в `route.ts` после валидации
нужно добавить вызов одного из вариантов:

- **Resend** (`resend` npm-пакет) — добавить email в аудиторию через
  `resend.contacts.create(...)`, либо просто переслать заявку письмом
  себе на почту через `resend.emails.send(...)`.
- **Unisender / SendPulse** — REST API, добавление контакта в список
  рассылки по HTTP-запросу с API-ключом.
- Простая пересылка заявки на свою почту через nodemailer + SMTP.

Во всех случаях API-ключи кладутся в `.env.local` на сервере (не в git),
переменные окружения — см. `CLAUDE.md`.

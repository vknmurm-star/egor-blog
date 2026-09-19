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

## Подписка на новости (рассылка о новых стихах)

Реализована полностью (раньше `/api/subscribe` был заглушкой с одним
`console.log`) — по тому же паттерну, что форма обратной связи на
andreev-zakon.ru (nodemailer + Timeweb SMTP, honeypot, rate-limit), плюс
собственно рассылка о новых постах и отписка.

**Хранилище — JSON-файлы в `data/` (в `.gitignore`, не в git):**
- `data/subscribers.json` — массив `{ email, token, subscribedAt }`.
  `token` — случайный hex (`crypto.randomBytes(24)`), нужен для ссылки
  отписки, чтобы не передавать голый email в query. Работа с файлом —
  `src/lib/subscribers.ts` (`addSubscriber`/`removeSubscriberByToken`,
  дедуп по email регистронезависимо).
- `data/last-notified-posts.json` — `{ slugs: [...] }`, слаги постов, о
  которых уже разослано письмо. **При первом запуске скрипта рассылки
  (файла ещё нет) он создаётся сразу со списком ВСЕХ текущих постов БЕЗ
  отправки писем** — иначе при включении рассылки подписчики бы получили
  разом письма про все старые стихи.

**Подписка (`src/components/home/Subscribe.tsx` → `POST /api/subscribe`,
`src/app/api/subscribe/route.ts`):** honeypot-поле `website`, rate-limit
5 запросов/10 мин с IP (`src/lib/rateLimit.ts`, тот же паттерн, что в
andreev-site — за nginx `X-Forwarded-For`/`X-Real-IP` уже проброшены,
проверено в текущем конфиге egorpoet). При НОВОМ email: письмо-уведомление
администратору (`ADMIN_EMAIL`) «Новый подписчик: …» + best-effort письмо-
подтверждение самому подписчику со ссылкой отписки. Повторная отправка тем
же email не шлёт уведомление админу повторно (дедуп по email в
`addSubscriber`).

**Рассылка о новых постах (`scripts/notify-subscribers.mjs`):** обычный
`.mjs`-скрипт, запускается напрямую через `node` (НЕ импортирует
`src/lib/*.ts` — переиспользовать TS-модули без прогона через
Next.js/ts-node нельзя, поэтому чтение env/SMTP и подписчиков в скрипте
продублировано в упрощённом виде). Встроен в тот же cron-цикл, что
автодеплой — вызов добавлен в конец `deploy.sh` на сервере (**не в git**,
как и `auto-deploy-check.sh`, который его вызывает), ПОСЛЕ `pm2 restart
egorpoet`: `node scripts/notify-subscribers.mjs`. Логика: сравнивает
текущие слаги
постов (`content/posts/*.md`) с `data/last-notified-posts.json`; если
появились новые — на каждый новый пост каждому подписчику уходит письмо
(заголовок + прямая ссылка `${SITE_URL}/<slug>` + ссылка отписки с его
токеном), затем `last-notified-posts.json` обновляется на текущий полный
список слагов. **Обновляется всегда после попытки рассылки, даже если
SMTP временно недоступен** — осознанный компромисс, чтобы разовый сбой не
превратился в бесконечный повтор рассылки на каждом cron-цикле (см.
комментарий в самом скрипте).

**Отписка (`/unsubscribe?token=...`, `src/app/unsubscribe/page.tsx` +
`src/components/UnsubscribeForm.tsx` → `POST /api/unsubscribe`):**
показывает подтверждение, по кнопке удаляет запись из `subscribers.json`
по токену. Ответ API нейтрален и для найденного, и для отсутствующего
токена (`{ ok: true, removed: boolean }`) — страница просто показывает
разный текст ("Вы отписаны" / "Вы уже не подписаны"), не намекая на
техническую причину.

**SMTP** — тот же Timeweb-релей, что у andreev-zakon.ru
(`smtp.timeweb.ru:465`), но с самого начала своим отдельным ящиком:
изначально был запущен на общем с andreev-site `egor@an51.su` (осознанный
выбор пользователя — не заводить отдельный ящик), затем заведён отдельный
`egorpoet@an51.su` специально под этот проект, и `SMTP_USER`/`SMTP_FROM`
переключены на него. **`ADMIN_EMAIL` — отдельная переменная и НЕ менялась,
по-прежнему `AndreevBank@bk.ru`** (контакт Егора-поэта, куда приходят
уведомления о новых подписчиках) — не путать ни адрес отправителя с
адресом получателя уведомлений, ни `ADMIN_EMAIL=egor@an51.su` в
`.env.local` проекта andreev-site (два разных файла в двух разных
директориях, `/var/www/andreev-site` и `/var/www/egorpoet-site`).

Требуемые переменные в `.env.local` на Beget (`SMTP_PASS` пользователь
дописывает сам через SSH, не в код/git/чат):
```
SMTP_HOST=smtp.timeweb.ru
SMTP_PORT=465
SMTP_USER=egorpoet@an51.su
SMTP_FROM=egorpoet@an51.su
ADMIN_EMAIL=AndreevBank@bk.ru
SMTP_PASS=<пароль от egorpoet@an51.su>
```

**Грабли: `pm2 restart` НЕ всегда печатает предупреждение
"Use --update-env", но при смене `.env.local` беспокоиться об этом не
нужно.** Предупреждение относится к переменным, которые PM2 сам передаёт
процессу при `pm2 start` (например `PORT=3002` — она передана явно при
запуске и «заморожена» в pm2's saved env, `--update-env`/`pm2 restart
--update-env` нужен, чтобы обновить именно такие). Но `SMTP_HOST/USER/
PASS/FROM/ADMIN_EMAIL` в `.env.local` читает НЕ pm2, а сам `next start`
при старте Node-процесса (обычный dotenv-механизм Next.js) — обычный
`pm2 restart egorpoet` убивает и заново поднимает процесс `next start`,
и тот перечитывает `.env.local` с диска заново при каждом запуске.
Проверено практически 2026-09-19: после добавления `SMTP_PASS` через SSH
и обычного `pm2 restart egorpoet` (без `--update-env`) переменная сразу
подхватилась — живая форма подписки отправила оба письма без единой
записи `[mailer] SMTP не настроен` в логах, отдельный ad-hoc
`transporter.verify()` с теми же значениями из `.env.local` подтвердил
AUTH OK. **Пересоздавать процесс (`pm2 delete && pm2 start`) или
использовать `--update-env` не требовалось.** Если после обычного
`pm2 restart` новый пароль всё же не подхватился (лог по-прежнему
показывает «SMTP не настроен» на новой подписке) — тогда уже стоит
подозревать что-то другое (опечатка в имени переменной, лишние
пробелы/кавычки в значении, файл `.env.local` лежит не в той директории)
и проверять `cat .env.local`, а не сразу пересоздавать процесс.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
